import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";
import MoltenMetal from "./MoltenMetal";

interface HeroProps {
  onOpenChat?: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork }) => {
  const scrollToContact = () => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      aria-label="Introduction & Hero"
      className="relative min-h-[88vh] flex flex-col justify-center items-center pt-28 pb-20 px-4 sm:px-6 overflow-hidden bg-[#F8F5ED]"
    >
      {/* Full-Width, Centered React Bits <MoltenMetal /> Background — Palette 4 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MoltenMetal
          colors={["#FFD66B", "#EFB323", "#EFB323", "#4C83BC", "#174F91"]}
          coreColor="#FFFDF8"
          backgroundColor="#F8F5ED"
          lightMode={true}
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          thickness={1}
          haze={0.75}
          offsetX={0}
          offsetY={0}
          mouseInteraction={true}
          flareOnClick={true}
        />

        {/* Soft Centered Readability Veil + Seamless Bottom Page Transition */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 56% 58% at 50% 48%, rgba(248, 245, 237, 0.88) 0%, rgba(248, 245, 237, 0.58) 56%, rgba(248, 245, 237, 0.12) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(248, 245, 237, 0) 0%, rgba(248, 245, 237, 0.85) 65%, #F8F5ED 100%)",
          }}
        />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Status / Availability Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md border border-[#E4DFD3] shadow-2xs mb-7"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFB323] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFB323]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-[#1F211F]/85 font-semibold">
            Software Engineer · Systems & Practical AI
          </span>
        </motion.div>

        {/* Prominent Centered Name: Bhavadharani */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-extrabold tracking-[-0.04em] text-[#1F211F] leading-[1.02]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {ENGINEER_PROFILE.name}
        </motion.h1>

        {/* Short Professional Identity Line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: "easeOut" }}
          className="mt-4 text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#174F91]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          Building backend systems, developer tools, and{" "}
          <span className="font-serif-italic font-normal text-[#1F211F]">
            practical AI experiences.
          </span>
        </motion.p>

        {/* Concise Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          className="mt-5 text-base sm:text-lg text-[#5C5F5B] font-normal max-w-2xl leading-relaxed"
        >
          I enjoy turning messy real-world problems into dependable software — understanding how systems behave under
          the surface and crafting tools that feel clear, reliable, and human.
        </motion.p>

        {/* Two Centered CTAs: Explore Works & Get in Touch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.26, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          <button
            id="hero-primary-cta"
            onClick={onExploreWork}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold text-sm sm:text-base transition-all duration-200 shadow-[0_8px_24px_rgba(239,179,35,0.28)] hover:shadow-[0_12px_28px_rgba(239,179,35,0.38)] hover:-translate-y-0.5 cursor-pointer border border-[#1F211F]/10"
          >
            <span>Explore Works</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            id="hero-secondary-cta"
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFFDF8]/95 hover:bg-[#174F91] text-[#1F211F] hover:text-[#FFFDF8] border border-[#1F211F]/20 hover:border-[#174F91] font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-2xs cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#174F91] group-hover:text-[#FFD66B]" />
            <span>Get in Touch</span>
          </button>
        </motion.div>

        {/* Subtle, Understated Supporting Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-12 pt-5 border-t border-[#E4DFD3]/90 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.12em] text-[#5C5F5B]"
        >
          <span>Software Development</span>
          <span className="text-[#EFB323]">•</span>
          <span>AI & LLM Systems</span>
          <span className="text-[#174F91]">•</span>
          <span>Systems Engineering</span>
        </motion.div>
      </div>
    </section>
  );
};
