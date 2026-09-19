import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";

interface HeroProps {
  onOpenChat: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat, onExploreWork }) => {

  return (
    <section
      id="home"
      aria-label="Introduction & Hero"
      className="relative min-h-[80vh] flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Subtle Atmospheric Gradient (Yellow & Blue within allowed palette, restrained) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 28%, rgba(244, 201, 40, 0.12) 0%, rgba(18, 104, 163, 0.05) 55%, rgba(247, 245, 238, 0) 100%)",
        }}
      />

      {/* Abstract System Topology Canvas / Interactive Grid */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#D9DDD7"
                strokeWidth="0.8"
                strokeDasharray="2 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Status Chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#D9DDD7] shadow-xs mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4C928] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4C928]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-[#102A36]/80 font-medium">
            SOFTWARE ENGINEER · SYSTEMS & AI
          </span>
        </motion.div>

        {/* Primary Identity: BHAVADHARANI */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#102A36] leading-[1.04]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {ENGINEER_PROFILE.name}
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-[#61727A] font-normal max-w-2xl leading-relaxed"
        >
          Software engineer building <span className="text-[#102A36] font-medium">backend systems</span>,{" "}
          <span className="text-[#102A36] font-medium">developer tools</span> and{" "}
          <span className="text-[#102A36] font-medium">practical AI experiences</span>.
        </motion.p>

        {/* Actions: Primary CTA & Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Primary CTA: Explore my work ↗ */}
          <button
            id="hero-primary-cta"
            onClick={onExploreWork}
            className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#F4C928] hover:bg-[#FFD84A] text-[#102A36] font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Explore my work</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary CTA: chat with Bhava 2.0 */}
          <button
            id="hero-secondary-cta"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#FFFDF7] hover:bg-[#FFFDF7] text-[#1268A3] border border-[#1268A3]/30 hover:border-[#1268A3] font-medium text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#1268A3]" />
            <span>chat with Bhava 2.0</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

