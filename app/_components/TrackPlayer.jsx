"use client";

import { useState, useRef, useEffect } from "react";
import { useTracks } from "../_store/useTracks";

function TrackPlayer() {
  const { currentTrack } = useTracks();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Reset player state when track changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);

    // If there's an audio element and a new track is selected, load it
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [currentTrack?.trackId]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress bar
  const updateProgress = () => {
    if (!audioRef.current) return;

    const percentage =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(percentage);
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
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
            {currentTrack.genre && (
              <p className="text-xs text-[#85766a] mb-3">
                {currentTrack.genre}
              </p>
            )}

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={currentTrack.audioUrl}
              onTimeUpdate={updateProgress}
              onEnded={handleEnded}
            />

            {/* Progress bar */}
            <div className="h-2 w-full max-w-xs bg-[#decea0] rounded-full mb-3">
              <div
                className="h-2 bg-[#8d9d4f] rounded-full"
                style={{ width: `${progress}%` }}></div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <button
                className="p-2 rounded-full bg-[#decea0] hover:bg-[#dbc894] text-[#5c4b3e] mx-1"
                onClick={togglePlay}>
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
            <p className="text-[#85766a] text-sm">
              Your generated track will appear here
            </p>
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
