"use client";

import { useState, useRef, useEffect } from "react";
import { useTracks } from "../_store/useTrack";

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

      // Reset audio element
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Force reload of audio source
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

  // Handle play/pause
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

  // Update progress bar
  const updateProgress = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    if (duration > 0) {
      const percentage = (current / duration) * 100;
      setProgress(percentage);
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Handle audio pause (for external pause events)
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Handle audio play (for external play events)
  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="p-4 bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] h-full flex flex-col items-center justify-center">
      <div className="w-36 h-36 bg-gradient-to-br from-[#decea0] via-[#8d9d4f] to-[#dbc894] rounded-[0.425rem] mb-4 flex items-center justify-center">
        {currentTrack ? (
          <svg
            className="w-10 h-10 text-[#fdfbf6] opacity-70"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        ) : (
          <svg
            className="w-10 h-10 text-[#5c4b3e] opacity-70"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H13V18H11V16ZM11 6H13V14H11V6Z" />
          </svg>
        )}
      </div>

      <div className="text-center flex-grow flex flex-col justify-center">
        {currentTrack ? (
          <>
            <h3 className="font-medium text-base mb-1 text-[#5c4b3e]">
              {currentTrack.title}
            </h3>

            {/* Error display */}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            {/* Loading indicator */}
            {!isLoaded && !error && (
              <div className="text-[#85766a] text-sm mb-2">
                Loading audio...
              </div>
            )}

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={currentTrack.audioUrl}
              onTimeUpdate={updateProgress}
              onEnded={handleEnded}
              onPause={handlePause}
              onPlay={handlePlay}
              preload="auto"
            />

            {/* Progress bar */}
            <div className="h-2 w-full max-w-xs bg-[#decea0] rounded-full mb-3">
              <div
                className="h-2 bg-[#8d9d4f] rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}></div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <button
                className={`p-2 rounded-full ${
                  isLoaded && !error
                    ? "bg-[#decea0] hover:bg-[#dbc894] text-[#5c4b3e]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } mx-1 transition-colors`}
                onClick={togglePlay}
                disabled={!isLoaded || error}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-[#85766a] text-sm">Select a track to play</p>
            <div className="w-12 h-12 flex items-center justify-center bg-[#decea0] rounded-full">
              <svg
                className="w-6 h-6 text-[#8d9d4f] opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default TrackPlayer;
