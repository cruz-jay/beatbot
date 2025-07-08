"use client";
import Link from "next/link";

export default function StudioTitle() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#21373f] via-[#2a454b] to-[#21373f] blur-lg opacity-50"></div>
      <div className="relative bg-gradient-to-r from-[#172a32] to-[#1c3139] p-6 rounded-2xl border border-[#253e45] shadow-2xl">
        <Link href="/">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            BeatBot Studio
          </h1>
        </Link>
        <div className="mt-2 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full"></div>
      </div>
    </div>
  );
}
