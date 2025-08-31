"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import StudioTitle from "../_components/StudioTitle";
import MusicTrackForm from "../_components/MusicTrackForm";
import TrackPlayer from "../_components/TrackPlayer";
import LeftBar from "../_components/LeftBar";

export default function StudioPage() {
  return (
    <div className="flex h-screen bg-[#0e1c26] text-white overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={18} minSize={15} maxSize={25} className="h-screen">
          <LeftBar />
        </Panel>

        <PanelResizeHandle className="w-px bg-[#253e45] hover:bg-cyan-400/50 transition-colors" />

        <Panel defaultSize={82}>
          <div className="h-screen flex flex-col p-6">
            <div className="flex-none text-center mb-8">
              <StudioTitle />
            </div>

            <div className="flex-grow flex items-center justify-center">
              <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <MusicTrackForm />
                  <TrackPlayer />
                </div>
              </div>
            </div>

            <div className="flex-none mt-8 text-center border-t border-[#253e45] pt-6">
              <div className="mt-2 flex justify-center gap-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-400"></div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
