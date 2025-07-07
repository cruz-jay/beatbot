"use client";
import Link from "next/link";
import next from "../../public/stack/next.png";
import supabase from "../../public/stack/supabase.jpg";
import tailwind from "../../public/stack/tailwind.png";
import Image from "next/image";

function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0e1c26] text-[#fdfbf6] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Me</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#2a454b] to-[#253e45] mx-auto"></div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Technologies Stack - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-[#13232c] rounded-lg border border-[#1c3139] p-6 h-full">
              <h2 className="text-xl font-bold mb-6 text-center">
                Technologies Used
              </h2>

              <div className="flex flex-col gap-4">
                <div className="bg-[#172a32] rounded-lg border border-[#1c3139] p-4 flex flex-col items-center hover:border-[#2a454b] transition-all">
                  <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
                    <Image src={next} alt="Next.js" className="w-8 h-8" />
                  </div>
                  <span className="text-center text-sm font-medium">
                    Next.js
                  </span>
                </div>

                <div className="bg-[#172a32] rounded-lg border border-[#1c3139] p-4 flex flex-col items-center hover:border-[#2a454b] transition-all">
                  <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
                    <Image
                      src={supabase}
                      alt="Supabase"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <span className="text-center text-sm font-medium">
                    Supabase
                  </span>
                </div>

                <div className="bg-[#172a32] rounded-lg border border-[#1c3139] p-4 flex flex-col items-center hover:border-[#2a454b] transition-all">
                  <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
                    <Image
                      src={tailwind}
                      alt="Tailwind CSS"
                      className="w-8 h-8"
                    />
                  </div>
                  <span className="text-center text-sm font-medium">
                    Tailwind CSS
                  </span>
                </div>

                <div className="bg-[#172a32] rounded-lg border border-[#1c3139] p-4 flex flex-col items-center hover:border-[#2a454b] transition-all">
                  <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#fdfbf6]"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm-1 4v12l8-6-8-6z" />
                    </svg>
                  </div>
                  <span className="text-center text-sm font-medium">
                    FastAPI
                  </span>
                </div>

                <div className="bg-[#172a32] rounded-lg border border-[#1c3139] p-4 flex flex-col items-center hover:border-[#2a454b] transition-all">
                  <div className="w-12 h-12 bg-[#21373f] rounded-full mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#fdfbf6]"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span className="text-center text-sm font-medium">
                    LLM Modal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile and Project Section */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Profile Section */}
              <div className="bg-[#13232c] rounded-lg border border-[#1c3139] p-8 h-full flex flex-col">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-[#2a454b] to-[#253e45] flex items-center justify-center text-4xl font-bold text-[#fdfbf6]">
                    JC
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">
                  CS Student @ UNLV
                </h2>

                <p className="text-[#fdfbf6]/80 mb-6 text-center">
                  I'm a Computer Science student at the University of Nevada,
                  Las Vegas, passionate about web development and creating new
                  things!
                </p>

                <div className="mt-auto">
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    Connect With Me
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="https://github.com/cruz-jay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#172a32] hover:bg-[#1c3139] px-4 py-3 rounded-lg transition-all border border-[#1c3139] hover:border-[#2a454b]">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </Link>

                    <Link
                      href="https://www.linkedin.com/in/jay-cruz-unlv/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#172a32] hover:bg-[#1c3139] px-4 py-3 rounded-lg transition-all border border-[#1c3139] hover:border-[#2a454b]">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </Link>
                  </div>
                </div>
              </div>

              {/* About This Project Section */}
              <div className="bg-[#13232c] rounded-lg border border-[#1c3139] p-8 h-full">
                <h2 className="text-2xl font-bold mb-6">Project Highlight</h2>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    About This Project
                  </h3>
                  {/* Blank space for personal content */}
                  <div className="text-[#fdfbf6]/80 min-h-[200px] flex items-center justify-center border-2 border-dashed border-[#1c3139] rounded-lg">
                    <p className="text-center text-[#fdfbf6]/60 italic">
                      Content to be added personally
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
