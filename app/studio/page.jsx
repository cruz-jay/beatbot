"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import StudioTitle from "../_components/StudioTitle";
import MusicTrackForm from "../_components/MusicTrackForm";
import TrackPlayer from "../_components/TrackPlayer";
import LeftBar from "../_components/LeftBar";

export default function StudioPage() {
  return (
    <div className="flex h-screen bg-[#e4d7b0] text-[#5c4b3e] overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={18} minSize={15} maxSize={25} className="h-screen">
          <LeftBar />
        </Panel>

        <PanelResizeHandle className="w-2 bg-[#decea0] hover:bg-[#8d9d4f] transition-colors" />

        <Panel defaultSize={82}>
          <div className="h-screen flex flex-col py-4 px-6">
            <div className="flex-none text-center mb-2">
              <StudioTitle />
            </div>

            <div className="flex-grow flex items-center justify-center">
              <div className="bg-[#f3ead2] rounded-[0.425rem] p-4 border border-[#b19681] shadow-md w-full max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MusicTrackForm />
                  <TrackPlayer />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-none mt-2 text-center border-t-4 border-[#b19681] pt-2">
              <div className="text-[#85766a] text-sm">
                {new Date().getFullYear()} BeatBot Studio
              </div>
              <div className="mt-1 flex justify-center space-x-6"></div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
