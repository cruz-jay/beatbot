import axios from "axios";
import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request) {
  let trackData = null;

  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to generate music" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, description, title, genre, userEmail } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const email = userEmail || session.user.email;
    if (!email) {
      return NextResponse.json(
        { error: "Unable to identify user account" },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from("USER_ACCOUNTS")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    const userId = userData.id;

    const { data: limitData, error: limitError } = await supabase
      .from("LIMITS")
      .select("*")
      .eq("user_id", userId)
      .single();

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
      return NextResponse.json(
        { error: "Failed to check track limit" },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: "Failed to create track record" },
        { status: 500 }
      );
    }

    trackData = newTrackData;

    // CALL NEW API
    let response;
    try {
      response = await axios({
        method: "POST",
        url: "https://cruz-jay--music-generation-api-musicgenerator-api.modal.run",
        headers: { "Content-Type": "application/json" },
        data: {
          prompt: description ? `${prompt}. ${description}` : prompt,
          duration: 25,
        },
        timeout: 120000,
      });
    } catch (err) {
      await markTrackAsFailed(trackData.id, "API request failed");
      return NextResponse.json(
        { error: "Failed to reach music generation API" },
        { status: 503 }
      );
    }

    const audioBase64 = response.data.audio_base64;
    if (!audioBase64) {
      await markTrackAsFailed(trackData.id, "No audio data returned");
      return NextResponse.json(
        { error: "No audio returned from API" },
        { status: 500 }
      );
    }

    const audioUrl = `data:audio/wav;base64,${audioBase64}`;

    const { error: updateError } = await supabase
      .from("TRACKS")
      .update({ status: "completed", audio_url: audioUrl })
      .eq("id", trackData.id);

    if (updateError) {
      console.error("Error updating track record:", updateError);
    }

    const { error: incrementError } = await supabase
      .from("LIMITS")
      .update({
        tracks_count: limitData ? limitData.tracks_count + 1 : 1,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (incrementError) {
      console.error("Error incrementing track count:", incrementError);
    }

    return NextResponse.json({
      success: true,
      trackId: trackData.id,
      audioUrl,
      title: trackData.title,
      genre: trackData.genre,
    });
  } catch (error) {
    if (trackData?.id) {
      await markTrackAsFailed(trackData.id, "Unexpected error");
    }
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function markTrackAsFailed(trackId, reason) {
  try {
    await supabase
      .from("TRACKS")
      .update({
        status: "failed",
        failure_reason: reason || "Unknown error",
      })
      .eq("id", trackId);
  } catch (e) {
    console.error("Error marking track as failed:", e);
  }
}
