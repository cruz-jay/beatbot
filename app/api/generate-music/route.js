import axios from "axios";
import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request) {
  let trackData = null;

  try {
    console.log("Starting music generation request...");

    // Check authentication first
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to generate music" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, description, model, title, genre, userEmail } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Make sure we have an email to identify the user
    const email = userEmail || session.user.email;
    if (!email) {
      return NextResponse.json(
        { error: "Unable to identify user account" },
        { status: 400 }
      );
    }

    // Look up the user ID from the email
    const { data: userData, error: userError } = await supabase
      .from("USER_ACCOUNTS")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error("Error finding user by email:", userError);
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    const userId = userData.id;
    console.log(`User found: ${userId}`);

    // Check user's track limit
    const { data: limitData, error: limitError } = await supabase
      .from("LIMITS")
      .select("*")
      .eq("user_id", userId)
      .single();

    // If no limit record exists, create one
    if (limitError && limitError.code === "PGRST116") {
      console.log("Creating new limit record for user");
      await supabase.from("LIMITS").insert([
        {
          user_id: userId,
          tracks_count: 0,
          last_updated: new Date().toISOString(),
        },
      ]);
    } else if (limitData && limitData.tracks_count >= 5) {
      return NextResponse.json(
        { error: "You've reached your limit of 5 tracks" },
        { status: 403 }
      );
    } else if (limitError) {
      console.error("Error checking track limit:", limitError);
      return NextResponse.json(
        { error: "Failed to check track limit" },
        { status: 500 }
      );
    }

    // Create a pending track record
    console.log("Creating pending track record");
    const { data: newTrackData, error: trackError } = await supabase
      .from("TRACKS")
      .insert([
        {
          user_id: userId,
          title: title || "Untitled Track",
          music_prompt: prompt,
          genre: genre || "unknown",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (trackError) {
      console.error("Error creating track record:", trackError);
      return NextResponse.json(
        { error: "Failed to create track record" },
        { status: 500 }
      );
    }

    trackData = newTrackData;
    console.log(`Track created with ID: ${trackData.id}`);

    // Get the Hugging Face API token
    const hfToken = process.env.HUGGING_FACE_API_TOKEN;

    if (!hfToken) {
      console.error("Hugging Face API token is not configured");
      await markTrackAsFailed(trackData.id, "API configuration missing");
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    // Set up the API URL and request payload
    let apiUrl;
    let requestPayload;

    if (model?.includes("facebook/musicgen")) {
      apiUrl = `https://api-inference.huggingface.co/models/${model}`;
      requestPayload = {
        inputs: description ? `${prompt}. ${description}` : prompt,
      };
    } else if (model === "stability-ai/stable-audio-open-1.0") {
      apiUrl =
        "https://api-inference.huggingface.co/models/stability-ai/stable-audio-open-1.0";
      requestPayload = {
        inputs: {
          prompt: description ? `${prompt}. ${description}` : prompt,
          duration: 8,
          guidance_scale: 3.5,
          seed: Math.floor(Math.random() * 1000000),
        },
      };
    } else {
      // Default to musicgen-small if no model specified
      apiUrl =
        "https://api-inference.huggingface.co/models/facebook/musicgen-small";
      requestPayload = {
        inputs: description ? `${prompt}. ${description}` : prompt,
      };
    }

    console.log(`Using model API: ${apiUrl}`);
    console.log(`Request payload: ${JSON.stringify(requestPayload)}`);

    // Call the Hugging Face API with enhanced retry mechanism
    let response;
    let retryCount = 0;
    const maxRetries = 5; // Increased from 2 to 5
    let lastError = null;

    while (retryCount <= maxRetries) {
      try {
        console.log(`API attempt ${retryCount + 1}/${maxRetries + 1}`);

        response = await axios({
          method: "POST",
          url: apiUrl,
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          data: requestPayload,
          responseType: "arraybuffer",
          timeout: 90000, // Increased from 65000 to 90000
        });

        console.log("API call successful");
        break; // Success, exit the loop
      } catch (err) {
        lastError = err;
        retryCount++;

        console.error(`API attempt ${retryCount} failed:`, err.message);

        // Check for specific error conditions
        const errorString = err.toString();
        const responseData = err.response?.data;
        let responseText = "";

        if (responseData) {
          try {
            // Try to convert response data to string if it's a buffer
            responseText = Buffer.from(responseData).toString();
            console.log(
              "Response error text:",
              responseText.substring(0, 200) + "..."
            );
          } catch (e) {
            console.error("Cannot convert response data to text:", e);
          }
        }

        // If we've reached max retries or it's a permanent error, stop retrying
        if (retryCount > maxRetries) {
          console.log("Maximum retries reached, giving up");
          break;
        }

        // Determine if we should retry based on error type
        const shouldRetry =
          err.message.includes("timeout") ||
          err.message.includes("busy") ||
          err.message.includes("ECONNRESET") ||
          err.message.includes("ETIMEDOUT") ||
          err.message.includes("429") || // Too Many Requests
          err.message.includes("503") || // Service Unavailable
          responseText.includes("Service Unavailable") ||
          (err.response?.status >= 500 && err.response?.status < 600); // Server errors

        if (!shouldRetry) {
          console.log("Error is not retryable, giving up");
          break;
        }

        // Calculate exponential backoff with jitter
        const delay = Math.min(
          3000 * Math.pow(2, retryCount - 1) + Math.random() * 1000,
          30000 // Cap at 30 seconds
        );

        console.log(`Retrying in ${Math.round(delay / 1000)} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!response) {
      // Determine the appropriate error message based on last error
      let errorMessage =
        "The AI model is currently unavailable. Please try again later.";

      if (lastError?.response?.status === 429) {
        errorMessage =
          "Too many requests. Please wait a moment before trying again.";
      } else if (lastError?.response?.status === 503) {
        errorMessage =
          "The AI service is temporarily unavailable. Please try again later.";
      } else if (lastError?.message?.includes("timeout")) {
        errorMessage =
          "The request timed out. The model might be experiencing high demand.";
      }

      // Update track status to failed
      await markTrackAsFailed(trackData.id, errorMessage);

      return NextResponse.json({ error: errorMessage }, { status: 503 });
    }

    // Check response format - make sure it's valid audio data
    const contentType = response.headers?.["content-type"] || "";

    if (
      !contentType.includes("audio") &&
      !contentType.includes("application/octet-stream")
    ) {
      console.error(`Unexpected content type: ${contentType}`);

      // Try to extract useful error info from response
      let errorInfo;
      try {
        const responseText = Buffer.from(response.data).toString();

        if (
          responseText.includes("<!DOCTYPE html>") ||
          responseText.includes("<html")
        ) {
          errorInfo = "Server returned HTML instead of audio data.";
        } else {
          errorInfo = `Unexpected response format: ${responseText.substring(
            0,
            100
          )}...`;
        }
      } catch (e) {
        errorInfo = "Could not parse response data";
      }

      await markTrackAsFailed(trackData.id, "Invalid response from AI service");
      return NextResponse.json(
        { error: `Failed to generate audio: ${errorInfo}` },
        { status: 500 }
      );
    }

    // Convert the audio data to base64
    const audioData = Buffer.from(response.data).toString("base64");
    const audioUrl = `data:audio/wav;base64,${audioData}`;
    console.log("Audio data successfully converted to base64");

    // Update the track record with completed status and audio URL
    console.log("Updating track with audio URL");
    const { error: updateError } = await supabase
      .from("TRACKS")
      .update({
        status: "completed",
        audio_url: audioUrl,
      })
      .eq("id", trackData.id);

    if (updateError) {
      console.error("Error updating track record:", updateError);
      // Continue anyway since we have the audio
    }

    // Increment the user's track count
    console.log("Incrementing user track count");
    const { error: incrementError } = await supabase
      .from("LIMITS")
      .update({
        tracks_count: limitData ? limitData.tracks_count + 1 : 1,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (incrementError) {
      console.error("Error incrementing track count:", incrementError);
      // Continue anyway since we have the audio
    }

    // Return the track data and audio URL
    console.log("Music generation completed successfully");
    return NextResponse.json({
      success: true,
      trackId: trackData.id,
      audioUrl,
      title: trackData.title,
      genre: trackData.genre,
    });
  } catch (error) {
    // Log the full error
    console.error("Critical error in API route:", error);

    // If we created a track, mark it as failed
    if (trackData?.id) {
      await markTrackAsFailed(trackData.id, "Processing error");
    }

    // Enhanced error handling
    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response status:", error.response.status);
      statusCode = error.response.status;

      try {
        if (error.response.data instanceof Buffer) {
          const dataString = error.response.data.toString();

          if (
            dataString.includes("<!DOCTYPE html>") ||
            dataString.includes("<html")
          ) {
            // This is an HTML error page
            if (
              dataString.includes("Service Unavailable") ||
              dataString.includes("503")
            ) {
              errorMessage =
                "The AI service is currently unavailable. Please try again later.";
            } else {
              errorMessage =
                "The AI service returned an error page instead of audio data.";
            }
          } else if (
            dataString.trim().startsWith("{") &&
            dataString.trim().endsWith("}")
          ) {
            // This looks like JSON
            try {
              const jsonError = JSON.parse(dataString);
              errorMessage = jsonError.error || "API error occurred";
            } catch {
              errorMessage = dataString;
            }
          } else {
            errorMessage = dataString.substring(0, 100); // First 100 chars
          }
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } catch (e) {
        console.error("Error parsing response data:", e);
        errorMessage = "Error processing API response";
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from AI service. Please try again.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || "Failed to make request to AI service";
    }

    return NextResponse.json(
      { error: `Failed to generate music: ${errorMessage}` },
      { status: statusCode }
    );
  }
}

// Helper function to mark a track as failed
async function markTrackAsFailed(trackId, reason) {
  if (!trackId) return;

  try {
    console.log(`Marking track ${trackId} as failed: ${reason}`);
    await supabase
      .from("TRACKS")
      .update({
        status: "failed",
        failure_reason: reason || "Unknown error",
      })
      .eq("id", trackId);
  } catch (error) {
    console.error("Error marking track as failed:", error);
  }
}
