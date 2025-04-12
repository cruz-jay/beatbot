"use client";
import { useTracks } from "../_store/useTracks";
import SignOutButton from "./SignOutButton";
import UserInfo from "./UserInfo";

export function LeftBar() {
  const {
    tracks,
    setCurrentTrack,
    currentTrack,
    isLoading: audioLoading,
  } = useTracks();

  return (
    <div className="h-full bg-[#e2d1a2] flex flex-col">
      <div className="p-4 border-b border-[#b19681]">
        <div className="flex justify-center items-center">
          <UserInfo>
            <SignOutButton />
          </UserInfo>
        </div>
      </div>
      {/*  Section title */}
      <div className="p-4 flex justify-center items-center border-b border-[#b19681]">
        <span className="font-bold text-[#5c4b3e]">Your Tracks</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        {audioLoading ? (
          <div className="flex items-center justify-center h-20 text-[#85766a]">
            <svg
              className="animate-spin h-5 w-5 mr-2"
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
            Loading...
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-8 text-[#85766a]">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-30"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <p>No tracks yet</p>
            <p className="text-xs mt-1">Create your first track!</p>
          </div>
        ) : (
          // Tracks list
          tracks.map((track) => {
            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 p-2 hover:bg-[#decea0] rounded-[0.425rem] cursor-pointer mb-2 ${
                  currentTrack?.trackId === track.id ? "bg-[#decea0]" : ""
                }`}
                onClick={() =>
                  setCurrentTrack({
                    trackId: track.id,
                    title: track.title,
                    genre: track.genre,
                    audioUrl: track.audio_url,
                  })
                }>
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d9d4f] to-[#9db18c] rounded-[0.425rem] flex items-center justify-center overflow-hidden">
                  {
                    <svg
                      className="w-6 h-6 text-[#fdfbf6]"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  }
                </div>
                <div>
                  <div className="font-medium text-[#5c4b3e]">
                    {track.title || `Track ${track.id}`}
                  </div>
                  {track.genre && (
                    <div className="text-sm text-[#85766a]">{track.genre}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LeftBar;
