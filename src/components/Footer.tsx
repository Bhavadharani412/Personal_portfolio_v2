import React from "react";
import { ArrowUp } from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#61727A]">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
        <span className="font-bold tracking-wider text-[#102A36]">
          {ENGINEER_PROFILE.name}
        </span>
        <span className="hidden sm:inline text-[#D9DDD7]">|</span>
        <span>Software Engineer · Backend Systems, Dev Tools & Practical AI</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-[11px]">
          {new Date().getFullYear()} · SYSTEM VERIFIED
        </span>
        <button
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="p-2 rounded-full bg-[#FFFDF7] hover:bg-[#F4C928]/30 border border-[#D9DDD7] text-[#102A36] transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
