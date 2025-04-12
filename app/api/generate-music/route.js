import axios from "axios";
import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request) {
  try {
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

    // Check user's track limit
    const { data: limitData, error: limitError } = await supabase
      .from("LIMITS")
      .select("*")
      .eq("user_id", userId)
      .single();

    // If no limit record exists, create one
    if (limitError && limitError.code === "PGRST116") {
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
    const { data: trackData, error: trackError } = await supabase
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

    // Get the Hugging Face API token
    const hfToken = process.env.HUGGING_FACE_API_TOKEN;

    if (!hfToken) {
      console.error("Hugging Face API token is not configured");
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

    // Call the Hugging Face API with retry mechanism
    let response;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        response = await axios({
          method: "POST",
          url: apiUrl,
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          data: requestPayload,
          responseType: "arraybuffer",
          timeout: 65000,
        });

        break; // Success, exit the loop
      } catch (err) {
        retryCount++;

        // If we've reached max retries or it's not a timeout/busy error, stop retrying
        if (
          retryCount > maxRetries ||
          (!err.message.includes("timeout") && !err.message.includes("busy"))
        ) {
          throw err;
        }

        // Wait 3 seconds before retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (!response) {
      // Update track status to failed
      await supabase
        .from("TRACKS")
        .update({ status: "failed" })
        .eq("id", trackData.id);

      return NextResponse.json(
        {
          error: "The AI model is currently too busy. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Convert the audio data to base64
    const audioData = Buffer.from(response.data).toString("base64");
    const audioUrl = `data:audio/wav;base64,${audioData}`;

    // Update the track record with completed status and audio URL
    await supabase
      .from("TRACKS")
      .update({
        status: "completed",
        audio_url: audioUrl,
      })
      .eq("id", trackData.id);

    // Increment the user's track count
    await supabase
      .from("LIMITS")
      .update({
        tracks_count: limitData ? limitData.tracks_count + 1 : 1,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", userId);

    // Return the track data and audio URL
    return NextResponse.json({
      success: true,
      trackId: trackData.id,
      audioUrl,
      title: trackData.title,
      genre: trackData.genre,
    });
  } catch (error) {
    console.error("Error in API route:", error);

    // Provide a more detailed error message if available
    const errorMessage = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : Buffer.from(error.response.data).toString() // Handle arraybuffer errors
      : error.message || "Unknown error occurred";

    return NextResponse.json(
      { error: `Failed to generate music: ${errorMessage}` },
      { status: 500 }
    );
  }
}
