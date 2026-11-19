import React, { useState } from "react";
import { ArrowUp, ShieldCheck, Cpu, X } from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";

interface FooterProps {
  onNavigateEngineering?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateEngineering }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToTop();
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3] text-xs text-[#5C5F5B]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E4DFD3]/80">
        {/* Identity & Tagline */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#EFB323] text-[#1F211F] font-bold text-[11px] grid place-items-center">
              BK
            </span>
            <span
              className="text-base font-bold tracking-tight text-[#1F211F]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {ENGINEER_PROFILE.name} K
            </span>
          </div>
          <p className="text-xs text-[#5C5F5B] leading-relaxed max-w-sm">
            {ENGINEER_PROFILE.tagline} Built with curiosity, engineering discipline, and care.
          </p>
        </div>

        {/* Useful Navigation */}
        <div className="md:col-span-4 space-y-2.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#174F91] font-bold">
            Navigation
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-[#1F211F]">
            <button onClick={() => scrollTo("home")} className="text-left hover:text-[#174F91] cursor-pointer">
              Home
            </button>
            <button onClick={() => scrollTo("about")} className="text-left hover:text-[#174F91] cursor-pointer">
              About
            </button>
            <button onClick={() => scrollTo("journey")} className="text-left hover:text-[#174F91] cursor-pointer">
              Journey
            </button>
            <button onClick={() => scrollTo("projects")} className="text-left hover:text-[#174F91] cursor-pointer">
              Works
            </button>
            <button onClick={() => scrollTo("blogs")} className="text-left hover:text-[#174F91] cursor-pointer">
              Blogs
            </button>
            <button onClick={() => scrollTo("open-source")} className="text-left hover:text-[#174F91] cursor-pointer">
              Open Source
            </button>
            <button onClick={() => scrollTo("skills")} className="text-left hover:text-[#174F91] cursor-pointer">
              Skills
            </button>
            <button onClick={() => scrollTo("contact")} className="text-left hover:text-[#174F91] cursor-pointer">
              Contact
            </button>
          </div>
        </div>

        {/* Standard & External Links */}
        <div className="md:col-span-3 space-y-2.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#174F91] font-bold">
            Profiles, Architecture & Privacy
          </div>
          <div className="flex flex-col gap-2 text-xs font-medium text-[#1F211F]">
            <a href={ENGINEER_PROFILE.socials.github} target="_blank" rel="noreferrer" className="hover:text-[#174F91]">
              GitHub ↗
            </a>
            <a href={ENGINEER_PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#174F91]">
              LinkedIn ↗
            </a>
            <a href={ENGINEER_PROFILE.socials.hashnode} target="_blank" rel="noreferrer" className="hover:text-[#174F91]">
              Hashnode ↗
            </a>
            {onNavigateEngineering && (
              <button
                onClick={onNavigateEngineering}
                className="inline-flex items-center gap-1.5 text-left text-[#174F91] hover:text-[#1F211F] font-semibold cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-[#EFB323]" />
                <span>How This Site Works (/engineering)</span>
              </button>
            )}
            <button
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex items-center gap-1.5 text-left text-[#5C5F5B] hover:text-[#1F211F] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#174F91]" />
              <span>Privacy & Telemetry Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Back-to-Top Row */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-center sm:text-left font-mono text-[11px]">
          <span>© {currentYear} Bhavadharani K. All rights reserved.</span>
          <span className="hidden sm:inline text-[#E4DFD3]">•</span>
          <span className="text-[#174F91]">Made with curiosity and care.</span>
        </div>

        <button
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#EFB323] border border-[#E4DFD3] hover:border-[#EFB323] text-[#1F211F] font-semibold transition-all cursor-pointer shadow-2xs"
          aria-label="Back to top"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Privacy & Data Handling Notice Modal */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F211F]/45 backdrop-blur-xs"
          onClick={() => setPrivacyOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl p-6 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-2.5">
              <span className="font-mono text-xs font-bold text-[#174F91]">
                PRIVACY & DATA HANDLING NOTICE
              </span>
              <button
                onClick={() => setPrivacyOpen(false)}
                className="p-1 rounded-full hover:bg-[#F8F5ED] text-[#5C5F5B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#5C5F5B] leading-relaxed">
              <p>
                <strong className="text-[#1F211F]">What is collected:</strong> A random, non-persistent{" "}
                <code className="font-mono">sessionStorage</code> session ID (cleared when you close the tab), referral/UTM source tags, and anonymous interaction events (such as project views or link clicks). No cookies or third-party ad trackers are used.
              </p>
              <p>
                <strong className="text-[#1F211F]">AI Chat Processing:</strong> Questions submitted to Bhava 2.0 are sent through a Cloudflare Worker to{" "}
                <strong className="text-[#1F211F]">Groq</strong> for LLM inference and logged in Cloudflare D1 to monitor answer quality and latency.
              </p>
              <p>
                <strong className="text-[#1F211F]">30-Day Retention Purge:</strong> Raw chat question content in D1 is automatically scrubbed and replaced with{" "}
                <code className="font-mono">[purged]</code> after 30 days via a scheduled Worker cron job.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
