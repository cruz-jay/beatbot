"use client";

import { useState, useRef, useEffect } from "react";
import { useTracks } from "../_store/useTrack";
import Image from "next/image";

function TrackPlayer() {
  const { currentTrack } = useTracks();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Reset player state when track changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setIsLoaded(false);
    setError(null);

    if (audioRef.current && currentTrack?.audioUrl) {
      console.log(
        "Loading new track:",
        currentTrack.title,
        currentTrack.audioUrl
      );

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [currentTrack?.trackId, currentTrack?.audioKey]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      console.log("Audio can play");
      setIsLoaded(true);
      setError(null);
    };

    const handleError = (e) => {
      console.error("Audio error:", e);
      setError("Failed to load audio");
      setIsLoaded(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log("Audio load started");
      setError(null);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [currentTrack?.audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack || !isLoaded) {
      console.log("Cannot play: missing audio, track, or not loaded");
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setError("Failed to play audio");
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    if (duration > 0) {
      const percentage = (current / duration) * 100;
      setProgress(percentage);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative p-6 bg-gradient-to-br from-[#0e1c26] to-[#172a32] rounded-2xl border border-[#253e45] shadow-2xl h-full flex flex-col">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-2xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Album Art */}
        <div className="relative mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-[#13232c] to-[#1c3139] rounded-3xl border border-[#253e45] flex items-center justify-center shadow-2xl">
            {currentTrack ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                {/* <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg> */}
                <Image
                  src="/BeatBot.png"
                  width={600}
                  height={700}
                  alt="BeatBot Logo"
                />
              </div>
            )}
          </div>

          {/* Animated rings */}
          {currentTrack && isPlaying && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
              <div
                className="absolute inset-4 border-2 border-blue-500/30 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}></div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          {currentTrack ? (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                {currentTrack.title}
              </h3>
              <p className="text-gray-400 text-sm">BeatBot Studio</p>

              {/* Error display */}
              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}

              {/* Loading indicator */}
              {!isLoaded && !error && (
                <div className="text-gray-400 text-sm mt-2">
                  Loading audio...
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400">Select a track to play</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "200ms" }}></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "400ms" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden audio element */}
        {currentTrack && (
          <audio
            ref={audioRef}
            src={currentTrack.audioUrl}
            onTimeUpdate={updateProgress}
            onEnded={handleEnded}
            onPause={handlePause}
            onPlay={handlePlay}
            preload="auto"
          />
        )}

        {/* Progress Bar */}
        {currentTrack && (
          <div className="w-full max-w-md mb-8">
            <div className="h-2 bg-[#13232c] rounded-full overflow-hidden border border-[#253e45]">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={togglePlay}
            disabled={!currentTrack || !isLoaded || error}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentTrack && isLoaded && !error
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40"
                : "bg-[#13232c] text-gray-500 cursor-not-allowed border border-[#253e45]"
            }`}>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackPlayer;
