import Link from "next/link";

function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0e1c26] flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0e1c26] via-[#13232c] to-[#172a32]"></div>

      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#2a454b_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_#21373f_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl mb-6 font-bold text-[#fdfbf6] tracking-tighter">
            Beat
            <span className="text-[#2a454b] bg-gradient-to-r from-[#2a454b] to-[#253e45] bg-clip-text text-transparent">
              {" "}
              Bot Studio
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2a454b] to-[#253e45] mx-auto rounded-full"></div>
        </div>

        <p className="text-[#fdfbf6]/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Create music with the power of AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <Link
            href="/studio"
            className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[#2a454b] to-[#253e45] hover:from-[#253e45] hover:to-[#21373f] text-[#fdfbf6] rounded-lg transition-all duration-300 shadow-lg shadow-[#2a454b]/30 hover:shadow-[#2a454b]/50 transform hover:-translate-y-1">
            <span className="flex items-center justify-center gap-2">
              Head into Studio
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 text-lg font-semibold border-2 border-[#1c3139] hover:border-[#2a454b] text-[#fdfbf6]/90 hover:text-[#fdfbf6] rounded-lg transition-all duration-300 bg-[#13232c]/50 hover:bg-[#172a32]/70 backdrop-blur-sm">
            About
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2a454b] via-[#253e45] to-[#21373f]"></div>
    </main>
  );
}

export default Page;
