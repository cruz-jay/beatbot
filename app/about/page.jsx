"use client";
import Link from "next/link";
import { useState } from "react";
import next_auth from "../../public/stack/next-auth.png";
import next from "../../public/stack/next.png";
import react from "../../public/stack/react.png";
import supabase from "../../public/stack/supabase.jpg";
import tailwind from "../../public/stack/tailwind.png";
import tanstack from "../../public/stack/tanstack.png";
import Image from "next/image";

function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  return (
    <main className="min-h-screen bg-[#e4d7b0] text-[#5c4b3e] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Me</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#8d9d4f] to-[#9db18c] mx-auto"></div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-8 h-full flex flex-col">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-[#8d9d4f] to-[#9db18c] flex items-center justify-center text-4xl font-bold text-[#fdfbf6]">
                  JC
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-4">
                CS Student @ UNLV
              </h2>

              <p className="text-[#5c4b3e] mb-6">
                I'm a Computer Science student at the University of Nevada, Las
                Vegas, passionate about web development and creating new things!
              </p>

              <div className="mt-auto">
                <h3 className="text-xl font-semibold mb-3">Connect With Me</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://github.com/cruz-jay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#decea0] hover:bg-[#dbc894] px-4 py-2 rounded-[0.425rem] transition-all text-[#5c4b3e]">
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
                    className="flex items-center gap-2 bg-[#decea0] hover:bg-[#dbc894] px-4 py-2 rounded-[0.425rem] transition-all text-[#5c4b3e]">
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
          </div>

          {/* About This Project Section (moved from below) */}
          <div className="md:col-span-2">
            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-8 h-full">
              <h2 className="text-2xl font-bold mb-6">Project Highlight</h2>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  About This Project
                </h3>
                <p className="text-[#5c4b3e]">
                  This music production platform combines my passion for coding
                  and music. Built with modern web technologies, it provides a
                  seamless experience for artists to create, collaborate, and
                  share their work. The authentication system supports multiple
                  providers, and the interface is designed for both professional
                  producers and hobbyists.
                </p>

                <p className="text-[#5c4b3e] mt-4">
                  BeatBot Studio allows users to generate music using AI
                  technology, making music production accessible to everyone
                  regardless of their technical music background. The platform
                  uses Hugging Face's models to generate tracks based on text
                  descriptions, providing a unique creative experience.
                </p>

                <p className="text-[#5c4b3e] mt-4">
                  The user interface is designed to be intuitive and responsive,
                  allowing for a seamless experience across different devices.
                  Users can create, manage, and share their tracks all within
                  the same application.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">
            Technologies Used
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={next} alt="" />
              </div>
              <span className="text-center">Next</span>
            </div>

            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={react} alt="" />
              </div>
              <span className="text-center">React</span>
            </div>

            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={supabase} alt="" />
              </div>
              <span className="text-center">Supabase</span>
            </div>

            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={next_auth} alt="" />
              </div>
              <span className="text-center">AuthJS</span>
            </div>

            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={tanstack} alt="" />
              </div>
              <span className="text-center">TanStack Query</span>
            </div>

            <div className="bg-[#e7dbbf] rounded-[0.425rem] border border-[#b19681] p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#decea0] rounded-full mb-3">
                <Image src={tailwind} alt="" />
              </div>
              <span className="text-center">Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
