import { supabase } from "./supabase";

export async function generateMusic(formData, userId) {
  try {
    const response = await fetch("/api/generate-music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.description,
        albumArt: formData.albumArt,
        title: formData.title,
        genre: formData.genre,
        userId: userId,
        model: formData.model || "facebook/musicgen-small",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate music");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error generating music:", err);
    throw err;
  }
}

// New function to generate only images
export async function generateImage(imageParams, userId) {
  try {
    const response = await fetch("/api/generate-music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generateImage: true,
        imagePrompt: imageParams.prompt,
        imageWidth: imageParams.width || 1024,
        imageHeight: imageParams.height || 1024,
        imageSteps: imageParams.steps || 30,
        imageGuidance: imageParams.guidance || 7.5,
        userId: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error generating image:", err);
    throw err;
  }
}

// Check if user has available track slots
export async function checkUserTrackLimit(userId) {
  try {
    const { data: userLimit, error: limitError } = await supabase
      .from("LIMITS")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (limitError) {
      // If no record exists, create one
      if (limitError.code === "PGRST116") {
        const { data, error } = await supabase
          .from("LIMITS")
          .insert([{ user_id: userId, tracks_count: 0 }])
          .select()
          .single();

        if (error) throw error;
        return { canCreate: true, tracksCount: 0, maxTracks: 5 };
      }
      throw limitError;
    }

    return {
      canCreate: userLimit.tracks_count < 5,
      tracksCount: userLimit.tracks_count,
      maxTracks: 5,
    };
  } catch (err) {
    console.error("Error checking user track limit:", err);
    throw err;
  }
}

// Create a new track record
export async function createTrackRecord(trackData) {
  try {
    const { data, error } = await supabase
      .from("TRACKS")
      .insert([
        {
          user_id: trackData.userId,
          title: trackData.title,
          music_prompt: trackData.prompt,
          genre: trackData.genre,
          audio_url: trackData.audioUrl,
          status: trackData.status || "pending",
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

// Create artwork record
export async function createArtworkRecord(artworkData) {
  try {
    const { data, error } = await supabase
      .from("ARTWORK")
      .insert([
        {
          track_id: artworkData.trackId,
          user_id: artworkData.userId, // Support standalone artwork (without track)
          image_prompt: artworkData.prompt,
          image_url: artworkData.imageUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error creating artwork record:", err);
    throw err;
  }
}

// Get user artwork (both standalone and track-related)
export async function getUserArtwork(userId) {
  try {
    const { data, error } = await supabase
      .from("ARTWORK")
      .select(
        `
        *,
        TRACKS(*)
      `
      )
      .or(`user_id.eq.${userId},TRACKS.user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error fetching user artwork:", err);
    throw err;
  }
}

// Update user track count
export async function incrementUserTrackCount(userId) {
  try {
    const { data: userLimit, error: fetchError } = await supabase
      .from("LIMITS")
      .select("tracks_count")
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    const newCount = userLimit.tracks_count + 1;

    const { data, error } = await supabase
      .from("LIMITS")
      .update({
        tracks_count: newCount,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error incrementing track count:", err);
    throw err;
  }
}

/// CREATE USER
export async function createUser(newUser) {
  const userToInsert = {
    created_at: new Date().toISOString(),
    fullName: newUser.fullName || null,
    email: newUser.email,
    provider: newUser.provider,
    provider_Id: newUser.providerAccountId,
  };

  const { data, error } = await supabase
    .from("USER_ACCOUNTS")
    .insert([userToInsert]);

  if (error) {
    console.error("Error creating user:", error);
    throw new Error("User could not be created");
  }

  return data;
}

/// GET USER BY EMAIL
export async function getUser(email) {
  if (!email) return null;

  try {
    const { data: allMatches, error: countError } = await supabase
      .from("USER_ACCOUNTS")
      .select("*")
      .eq("email", email);

    if (allMatches && allMatches.length > 1) {
      console.log(
        `Found ${allMatches.length} users with email ${email}. This may cause issues.`
      );
    }

    // Now try to get a single record
    const { data, error } = await supabase
      .from("USER_ACCOUNTS")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log(`No user found with email: ${email}`);
        return null;
      }
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  } catch (err) {
    return null;
  }
}

/// UPDATE USER
export async function updateUser(email, updates) {
  const { data, error } = await supabase
    .from("USER_ACCOUNTS")
    .update(updates)
    .eq("email", email);

  if (error) {
    console.error("Error updating user:", error);
    throw new Error("User could not be updated");
  }

  return data;
}

// Get user tracks
export async function getUserTracks(userId) {
  try {
    const { data, error } = await supabase
      .from("TRACKS")
      .select(
        `
        *,
        ARTWORK(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error fetching user tracks:", err);
    throw err;
  }
}
