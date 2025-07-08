"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTracks } from "../_store/useTrack";

function MusicTrackForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { addTrack, refreshTracks } = useTracks();

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
    },
  });

  const musicPrompt = watch("description");

  const onSubmit = async (formData) => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.description,
          title: formData.title,
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
        audioUrl: data.audioUrl,
        imageUrl: data.imageUrl,
      });

      setSuccess("Your track was created successfully!");
      refreshTracks();
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

  // <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
  //   <Image src={Fast} alt="FastAPI" className="w-8 h-8" />
  // </div>

  return (
    <div className="relative p-6 bg-gradient-to-br from-[#0e1c26] to-[#172a32] rounded-2xl border border-[#253e45] shadow-2xl h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-300">Studio</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Facebook/MusicGen API AI model is down ►►
              <a
                href="https://huggingface.co/spaces/facebook/MusicGen"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-300">
                HuggingFace
              </a>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-4 text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300">
              Track Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter track title"
              className="w-full bg-[#13232c] border border-[#253e45] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300">
              Music Prompt
            </label>
            <textarea
              id="description"
              placeholder="Enter prompt"
              className="w-full h-32 bg-[#13232c] border border-[#253e45] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all resize-none"
              {...register("description", {
                required: "Music description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="pt-4 mt-auto">
            <button
              type="submit"
              disabled={isGenerating || !musicPrompt}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                isGenerating || !musicPrompt
                  ? "bg-[#172a32] text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              } flex items-center justify-center gap-3`}>
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating Your Masterpiece...</span>
                </>
              ) : (
                <>
                  <span>Generate </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MusicTrackForm;
