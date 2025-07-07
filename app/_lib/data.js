export async function createTrackRecord(trackData) {
  try {
    const { data, error } = await supabase
      .from("TRACKS")
      .insert([
        {
          title: trackData.title,
          prompt: trackData.prompt,
          mp3_url: trackData.audioUrl, // Fixed: use audioUrl instead of m34Url
          base64_data: trackData.base64Data,
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error creating track record:", err);
    throw err;
  }
}

// Updated to handle WAV files properly
export function generateBlobUrlFromBase64(base64Data, mime = "audio/wav") {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error generating blob URL:", error);
    return null;
  }
}

// Helper function to detect audio format from base64 data
export function detectAudioFormat(base64Data) {
  try {
    // Decode first few bytes to check file signature
    const byteCharacters = atob(base64Data.substring(0, 20));
    const bytes = Array.from(byteCharacters, (c) => c.charCodeAt(0));

    // WAV file signature: "RIFF" (52 49 46 46)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46
    ) {
      return "audio/wav";
    }

    // MP3 file signature: ID3 or sync frame
    if (
      (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
      (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)
    ) {
      return "audio/mpeg";
    }

    // Default to WAV since your model generates WAV
    return "audio/wav";
  } catch (error) {
    console.error("Error detecting audio format:", error);
    return "audio/wav";
  }
}

// Enhanced blob URL generator that auto-detects format
export function generateBlobUrlFromBase64Auto(base64Data) {
  const mimeType = detectAudioFormat(base64Data);
  return generateBlobUrlFromBase64(base64Data, mimeType);
}

// Usage examples:
// const blobUrl = generateBlobUrlFromBase64(track.base64_data, "audio/wav");
// const autoDetectedBlobUrl = generateBlobUrlFromBase64Auto(track.base64_data);
// <audio src={blobUrl} controls />
// <a href={blobUrl} download={`${track.title}.wav`}>Download</a>
