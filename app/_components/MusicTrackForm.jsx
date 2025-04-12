"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { supabase } from "@/app/_lib/supabase";
import { useTracks } from "../_store/useTracks";

function MusicTrackForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [trackLimit, setTrackLimit] = useState({
    canCreate: true,
    tracksCount: 0,
    maxTracks: 5,
  });

  const { addTrack, refreshTracks } = useTracks();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      description: "",
      title: "",
      genre: "",
    },
  });

  const musicPrompt = watch("description");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserByEmail(session.user.email);
    }
  }, [session, status]);

  // Fetch user by email
  const fetchUserByEmail = async (email) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("USER_ACCOUNTS")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) {
        setError("Unable to find your account");
        return;
      }

      if (userData && userData.id) {
        fetchUserTrackLimit(userData.id);
      } else {
        setError("Account not found");
      }
    } catch (err) {
      setError("Error looking up your account");
    }
  };

  // Fetch track limit
  const fetchUserTrackLimit = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("LIMITS")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setTrackLimit({ canCreate: true, tracksCount: 0, maxTracks: 5 });
        }
      } else {
        setTrackLimit({
          canCreate: data.tracks_count < 5,
          tracksCount: data.tracks_count,
          maxTracks: 5,
        });
      }
    } catch (err) {
      setError(`Failed to check track limit: ${err.message}`);
    }
  };

  // Form submission
  const onSubmit = async (formData) => {
    if (status !== "authenticated") {
      setError("Please sign in to create tracks");
      return;
    }

    if (!session?.user?.email) {
      setError("Unable to identify your account");
      return;
    }

    if (!trackLimit.canCreate) {
      setError(`You've reached your limit of ${trackLimit.maxTracks} tracks`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: formData.description,
          model: "facebook/musicgen-small",
          title: formData.title,
          genre: formData.genre,
          userEmail: session.user.email,
          generateImage: true,
          imageWidth: 1024,
          imageHeight: 1024,
          imageSteps: 30,
          imageGuidance: 7.5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate music");
      }

      const data = await response.json();

      addTrack({
        trackId: data.trackId,
        title: data.title || formData.title,
        genre: data.genre || formData.genre,
        audioUrl: data.audioUrl,
        imageUrl: data.imageUrl,
      });

      setSuccess("Your track was created successfully!");
      refreshTracks();

      if (session?.user?.email) {
        fetchUserByEmail(session.user.email);
      }

      reset();
    } catch (err) {
      if (
        err.message.includes("too busy") ||
        err.message.includes("try again later")
      ) {
        setError(
          "The AI model is currently experiencing high demand. Please try again in a few minutes."
        );
      } else {
        setError(err.message || "Failed to create track. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] h-full flex flex-col">
      <h2 className="text-xl font-bold mb-3 text-[#5c4b3e]">
        Create a new Track!
      </h2>

      {/* Track limit indicator */}
      <div className="mb-2 text-sm text-[#85766a]">
        Tracks used:{" "}
        <span className="text-[#5c4b3e] font-medium">
          {trackLimit.tracksCount}/{trackLimit.maxTracks}
        </span>
        {!trackLimit.canCreate && (
          <span className="ml-2 text-[#d98b7e]">
            You've reached your track limit
          </span>
        )}
      </div>

      {error && (
        <div className="bg-[#d98b7e]/20 border border-[#d98b7e] text-[#d98b7e] px-3 py-2 rounded-[0.425rem] mb-3 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-[#9db18c]/20 border border-[#9db18c] text-[#5e6e58] px-3 py-2 rounded-[0.425rem] mb-3 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-grow">
        <div className="space-y-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#5c4b3e]">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Title of the Track"
            className="w-full bg-[#f3ead2] border border-[#b19681] rounded-[0.425rem] px-3 py-2 text-[#5c4b3e] text-sm focus:outline-none focus:ring-1 focus:ring-[#8d9d4f]"
            {...register("title", {
              required: "Title is required",
            })}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-[#d98b7e]">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-[#5c4b3e]">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            placeholder="Enter music genre (e.g., Pop, Rock, Hip Hop)"
            className="w-full bg-[#f3ead2] border border-[#b19681] rounded-[0.425rem] px-3 py-2 text-[#5c4b3e] text-sm focus:outline-none focus:ring-1 focus:ring-[#8d9d4f]"
            {...register("genre", {
              required: "Genre is required",
            })}
          />
          {errors.genre && (
            <p className="mt-1 text-xs text-[#d98b7e]">
              {errors.genre.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#5c4b3e]">
            Music Description
          </label>
          <textarea
            placeholder="Describe in detail what you want to create"
            id="description"
            className="w-full h-24 bg-[#f3ead2] border border-[#b19681] rounded-[0.425rem] px-3 py-2 text-[#5c4b3e] text-sm focus:outline-none focus:ring-1 focus:ring-[#8d9d4f]"
            {...register("description", {
              required: "Music description is required",
            })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-[#d98b7e]">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="pt-2 mt-auto">
          <button
            type="submit"
            disabled={
              isGenerating ||
              !musicPrompt ||
              !trackLimit.canCreate ||
              status !== "authenticated"
            }
            className={`w-full py-2 px-3 rounded-[0.425rem] font-medium text-sm ${
              isGenerating ||
              !musicPrompt ||
              !trackLimit.canCreate ||
              status !== "authenticated"
                ? "bg-[#decea0] text-[#85766a] cursor-not-allowed"
                : "bg-gradient-to-r from-[#8d9d4f] to-[#9db18c] hover:from-[#7c8c3e] hover:to-[#8a9f7b] text-[#fdfbf6]"
            } transition-all flex items-center justify-center gap-2`}>
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-[#fdfbf6]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 18.414L5.636 12.05l1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414z" />
                </svg>
                Generate Music
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MusicTrackForm;
