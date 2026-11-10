import React from "react";
import { Compass, BookOpen, Users } from "lucide-react";

export const AboutMe: React.FC = () => {
  const values = [
    {
      title: "Think clearly",
      desc: "Understand the problem before reaching for a solution.",
      icon: Compass,
    },
    {
      title: "Build responsibly",
      desc: "Care about reliability, privacy, and the details.",
      icon: BookOpen,
    },
    {
      title: "Keep growing",
      desc: "Learn in public and make progress measurable.",
      icon: Users,
    },
  ];

  return (
    <section
      id="about"
      aria-label="About Bhavadharani"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Natural Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-end">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#174F91] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            A Little About Me
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F] leading-[1.02]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            ABOUT
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1F211F] leading-[1.15]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Technical curiosity, with a{" "}
            <span className="font-serif-italic font-normal text-[#174F91]">
              human point of view.
            </span>
          </p>
        </div>
      </div>

      {/* Simple, Well-Composed Two-Column About Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Minimal Abstract Sculpture Card (From Approved Mockup, Palette 4) */}
        <div className="lg:col-span-5">
          <div
            className="relative min-h-[340px] sm:min-h-[370px] rounded-3xl bg-[#174F91] overflow-hidden p-7 flex flex-col justify-between border border-[#174F91] shadow-[0_14px_36px_rgba(23,79,145,0.12)]"
            aria-hidden="true"
          >
            {/* Geometric Forms */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-60 bg-[#F8F5ED] rounded-t-full rounded-b-2xl rotate-6 shadow-[16px_14px_0_#4C83BC]" />
            <div className="absolute right-12 top-11 w-20 h-20 rounded-full bg-[#EFB323] shadow-[0_8px_20px_rgba(239,179,35,0.35)]" />
            <div className="absolute left-10 bottom-14 w-16 h-16 rounded-full border border-[#FFD66B]/80" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-[#FFFDF8]/15 text-[#FFFDF8] backdrop-blur-xs">
                SOFTWARE · PRODUCT · SYSTEMS
              </span>
              <span className="text-[11px] font-mono text-[#FFD66B]">
                INDIA
              </span>
            </div>

            <div className="relative z-10">
              <span className="font-serif-italic text-2xl sm:text-3xl text-[#FFFDF8]">
                A mind in motion.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Genuine Personal Narrative & Values */}
        <div className="lg:col-span-7 space-y-5 text-[#5C5F5B] text-base sm:text-[17px] leading-[1.8]">
          <p className="text-lg sm:text-xl text-[#1F211F] font-medium leading-relaxed">
            I'm pursuing a <strong className="font-semibold">B.Tech in Information Technology</strong> at{" "}
            <span className="underline decoration-[#EFB323] decoration-2 underline-offset-4">
              Nandha Engineering College
            </span>
            . My interests sit where software engineering, product thinking, and practical problem-solving meet.
          </p>

          <p>
            I like understanding why something needs to exist before deciding how to build it. That means asking better
            questions, breaking down complexity, testing assumptions, and caring about the experience on the other side
            of the screen.
          </p>

          <p>
            Outside code, I enjoy public speaking, writing in <strong className="text-[#1F211F] font-medium">Tamil and English</strong>,
            sharing what I learn, and helping people grow through collaborative communities like{" "}
            <strong className="text-[#1F211F] font-medium">DEVS NEC</strong>.
          </p>

          {/* Compact Values Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E4DFD3] hover:border-[#EFB323] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFD66B]/40 text-[#174F91] flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <strong
                    className="block text-sm font-bold text-[#1F211F] mb-1"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {val.title}
                  </strong>
                  <span className="text-xs text-[#5C5F5B] leading-relaxed block">
                    {val.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
