import Link from "next/link";

function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#e4d7b0] flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#e4d7b0] via-[#dbc894] to-[#e4d7b0]"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl mb-6 font-bold text-[#5c4b3e] tracking-tighter">
          Beat-<span className="text-[#8d9d4f]">Bot Studio</span>
        </h1>
        <p className="text-[#5c4b3e] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Create and produce music with the power of AI
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 text-lg font-semibold bg-[#8d9d4f] hover:bg-[#7c8c3e] text-[#fdfbf6] rounded-[0.425rem] transition-all duration-300 shadow-lg shadow-[#8d9d4f]/30">
            Get Started - SignUp & Login
          </Link>

          <Link
            href="/about"
            className="px-8 py-4 text-lg font-semibold border border-[#b19681] hover:border-[#8d9d4f] text-[#5c4b3e] rounded-[0.425rem] transition-all duration-300 bg-[#decea0]/50 hover:bg-[#decea0]">
            Learn About Me and This Site
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Page;
