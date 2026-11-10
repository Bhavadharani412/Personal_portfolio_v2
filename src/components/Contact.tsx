import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Mail,
  FileText,
  Copy,
  Check,
  FolderGit2,
  BookOpen,
  GitPullRequest,
  Globe,
  Code2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";

interface ContactProps {
  onOpenChat?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenChat }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(ENGINEER_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenBhavaChat = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      const trigger = document.getElementById("chatbot-collapsed-trigger");
      if (trigger) trigger.click();
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact and Quick Links"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Welcoming Contact Banner (Natural Section Heading, Palette 4) */}
      <div className="relative rounded-3xl bg-[#1F211F] text-[#F8F5ED] p-8 sm:p-12 mb-12 overflow-hidden border border-[#1F211F] shadow-[0_20px_50px_rgba(31,33,31,0.12)]">
        {/* Decorative Orbital Rings in Steel Azure & Sunflower Gold */}
        <div
          className="pointer-events-none absolute -right-16 -top-24 w-80 h-80 rounded-full border border-[#4C83BC]/35"
          style={{
            boxShadow: "0 0 0 36px rgba(239, 179, 35, 0.04), 0 0 0 76px rgba(76, 131, 188, 0.05)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#FFD66B] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            Have a Thoughtful Problem to Solve?
          </span>

          <h2
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-[0.98]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Let's make something{" "}
            <span className="font-serif-italic font-normal text-[#EFB323]">
              matter.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#F8F5ED]/80 leading-relaxed max-w-xl">
            I'm always happy to connect around software engineering internships, product engineering roles,
            backend and AI systems, or open-source collaborations. Write directly to{" "}
            <strong className="text-[#FFFDF8] font-medium">Bhavadharani</strong> below.
          </p>

          {/* Direct Email Action Addressed to Bhavadharani */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${ENGINEER_PROFILE.email}?subject=Hello%20Bhavadharani`}
              className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold text-sm transition-all shadow-[0_8px_24px_rgba(239,179,35,0.3)] hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span>Email Bhavadharani ({ENGINEER_PROFILE.email})</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              id="copy-email-btn"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 text-[#FFFDF8] text-xs font-mono font-semibold border border-[#FFFDF8]/20 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#EFB323]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? "Copied Address!" : "Copy Email"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Quick Links Directory + "Try the Chatbot (Bhava 2.0)" Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: All 8 Quick Links (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] shadow-[0_6px_24px_rgba(31,33,31,0.03)]">
            <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-3.5 mb-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#174F91] font-bold">
                QUICK LINKS & PROFILES
              </span>
              <span className="text-[11px] font-mono text-[#5C5F5B]">
                DIRECT NAVIGATION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Projects */}
              <button
                onClick={() => scrollToSection("projects")}
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">Projects</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </button>

              {/* 2. Blogs */}
              <button
                onClick={() => scrollToSection("blogs")}
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">Blogs</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </button>

              {/* 3. Open Source */}
              <button
                onClick={() => scrollToSection("open-source")}
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GitPullRequest className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">Open Source</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </button>

              {/* 4. Resume */}
              <button
                id="download-resume-btn"
                onClick={() => setResumeModalOpen(true)}
                className="p-3.5 rounded-2xl bg-[#FFD66B]/35 hover:bg-[#EFB323] border border-[#EFB323] flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#1F211F]" />
                  <span className="text-sm font-bold text-[#1F211F]">Resume</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#1F211F]" />
              </button>

              {/* 5. GitHub */}
              <a
                id="social-link-github"
                href={ENGINEER_PROFILE.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">GitHub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </a>

              {/* 6. LinkedIn */}
              <a
                id="social-link-linkedin"
                href={ENGINEER_PROFILE.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </a>

              {/* 7. LeetCode */}
              <a
                id="social-link-leetcode"
                href={ENGINEER_PROFILE.socials.leetcode}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">LeetCode</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </a>

              {/* 8. Personal Website */}
              <a
                id="social-link-website"
                href={ENGINEER_PROFILE.socials.website}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-[#F8F5ED] hover:bg-[#FFD66B]/35 border border-[#E4DFD3] hover:border-[#EFB323] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#174F91]" />
                  <span className="text-sm font-bold text-[#1F211F]">Personal Website</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F5B] group-hover:text-[#1F211F]" />
              </a>
            </div>

            {/* Hashnode Publication Link */}
            <div className="mt-4 pt-4 border-t border-[#E4DFD3] flex items-center justify-between text-xs">
              <span className="font-mono text-[#5C5F5B]">TECHNICAL WRITING ARCHIVE</span>
              <a
                id="social-link-hashnode"
                href={ENGINEER_PROFILE.socials.hashnode}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-bold text-[#174F91] hover:underline inline-flex items-center gap-1"
              >
                <span>Hashnode (@Bhavadharani412)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Small Box Referring to "Try the Chatbot" & Linking to Bhava 2.0 (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] shadow-[0_6px_24px_rgba(31,33,31,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-3.5 mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#174F91] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#EFB323]" />
                  <span>TRY THE CHATBOT</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFD66B]/60 text-[#1F211F] border border-[#EFB323]">
                  BHAVA 2.0
                </span>
              </div>

              <h3
                className="text-2xl font-bold text-[#1F211F] tracking-tight mb-2.5"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                Curious about my work? Ask{" "}
                <span className="font-serif-italic font-normal text-[#174F91]">
                  Bhava 2.0
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed mb-6">
                Instead of filling out a static form, you can chat directly with{" "}
                <strong className="text-[#1F211F] font-semibold">Bhava 2.0</strong> — my conversational digital twin
                grounded in my projects, engineering architecture, skills, and internship experience.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                id="contact-try-chatbot-btn"
                type="button"
                onClick={handleOpenBhavaChat}
                className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold text-xs sm:text-sm transition-all shadow-[0_6px_18px_rgba(239,179,35,0.25)] cursor-pointer border border-[#1F211F]/10"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Try the Chatbot · Open Bhava 2.0</span>
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("home")}
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#F8F5ED] hover:bg-[#FFD66B]/30 text-[#174F91] border border-[#E4DFD3] text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                <span>Explore Bhava 2.0 Digital Twin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Quick Inspection Modal */}
      <AnimatePresence>
        {resumeModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F211F]/45 backdrop-blur-xs"
            onClick={() => setResumeModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-3 mb-5">
                <span className="font-mono text-xs text-[#174F91] font-bold">
                  BHAVADHARANI // CURRICULUM VITAE SUMMARY
                </span>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="text-xs font-mono text-[#5C5F5B] hover:text-[#1F211F] cursor-pointer"
                >
                  [ESC]
                </button>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#1F211F]/90 leading-relaxed font-mono">
                <p>
                  <strong>NAME:</strong> Bhavadharani K
                </p>
                <p>
                  <strong>ROLE:</strong> Software Engineer (Backend Systems, Dev Tools, Practical AI)
                </p>
                <p>
                  <strong>EDUCATION:</strong> B.Tech Information Technology, Nandha Engineering College (Sep 2023 – Present)
                </p>
                <p>
                  <strong>EXPERIENCE & PROGRAMS:</strong> Synergy Marine Group Project Intern (Project Neptune SAP S/4HANA UAT), Infosys Pragati Cohort 3, Aspire Leaders Program, McKinsey Forward
                </p>
                <p>
                  <strong>LEADERSHIP:</strong> Founder & Mentor, DEVS NEC Student Developer Community
                </p>
                <p>
                  <strong>KEY STACK:</strong> Java, Python, TypeScript, Rust, Kotlin, React, FastAPI, Node.js, Yjs CRDTs, PostgreSQL, SQLite, Groq API
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4DFD3] flex justify-end gap-2.5">
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C5F5B] hover:text-[#1F211F] cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={`mailto:${ENGINEER_PROFILE.email}?subject=Resume%20Request%20for%20Bhavadharani`}
                  className="px-5 py-2 text-xs font-bold rounded-full bg-[#EFB323] text-[#1F211F] hover:bg-[#FFD66B] transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Request Full Resume PDF</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
