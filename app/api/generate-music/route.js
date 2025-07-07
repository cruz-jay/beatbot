import axios from "axios";
import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request) {
  let trackData = null;

  try {
    const body = await request.json();
    const { prompt, description, title } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 1. Insert a new placeholder track
    const { data: newTrack, error: insertError } = await supabase
      .from("TRACKS")
      .insert([
        {
          title: title || "Untitled Track",
          prompt,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create track record" },
        { status: 500 }
      );
    }

    trackData = newTrack;

    // 2. Call external music generation API
    let response;
    try {
      response = await axios.post(
        "https://cruz-jay--music-generation-api-musicgenerator-api.modal.run",
        {
          prompt: description ? `${prompt}. ${description}` : prompt,
          duration: 25,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
        }
      );
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

    // 3. Create proper WAV data URL (since your model generates WAV files)
    const dataUrl = `data:audio/wav;base64,${audioBase64}`;

    // 4. Update the track in DB
    const { error: updateError } = await supabase
      .from("TRACKS")
      .update({
        status: "completed",
        base64_data: audioBase64,
        mp3_url: dataUrl, // This is actually WAV data
      })
      .eq("id", trackData.id);

    if (updateError) {
      console.error("Error updating track:", updateError);
    }

    // 5. Return response with correct field names that frontend expects
    return NextResponse.json({
      success: true,
      trackId: trackData.id,
      base64: audioBase64,
      audioUrl: dataUrl, // Frontend expects 'audioUrl', not 'mp3Url'
      title: trackData.title,
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
