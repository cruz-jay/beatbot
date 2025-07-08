"use client";

import { useTracks } from "../_store/useTrack";

export default function LeftBar() {
  const {
    tracks,
    setCurrentTrack,
    currentTrack,
    isLoading: audioLoading,
  } = useTracks();

  const handleTrackClick = (track) => {
    const trackData = {
      trackId: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      audioKey: track.audioKey,
    };

    console.log("Setting current track:", trackData);
    setCurrentTrack(trackData);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#0e1c26] to-[#13232c] flex flex-col border-r border-[#253e45]">
      {/* Header */}
      <div className="p-6 border-b border-[#253e45]">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="p-6 border-b border-[#253e45]">
        <div className="text-center">
          <h2 className="text-lg font-bold text-cyan-400 mb-2">Your Library</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>
      </div>

      {/* Tracks list */}
      <div className="flex-1 overflow-y-auto p-4">
        {audioLoading ? (
          <div className="flex items-center justify-center h-20 text-gray-400">
            <svg
              className="animate-spin h-6 w-6 mr-3"
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
            <span className="text-sm">Loading tracks...</span>
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#172a32] to-[#1c3139] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#253e45]">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No tracks yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Create your first masterpiece!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentTrack?.trackId === track.id
                    ? "bg-gradient-to-r from-[#21373f] to-[#253e45] border border-cyan-400/50 shadow-lg shadow-cyan-400/10"
                    : "bg-gradient-to-r from-[#172a32] to-[#1c3139] border border-[#253e45] hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/5"
                }`}
                onClick={() => handleTrackClick(track)}>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {track.title || `Track ${track.id}`}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {track.audioUrl ? "Ready to play" : "Processing..."}
                    </div>
                  </div>
                  {currentTrack?.trackId === track.id && (
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
