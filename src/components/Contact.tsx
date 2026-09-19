import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Mail, Send, CheckCircle2, FileText, Download, Copy, Check } from "lucide-react";
import { ENGINEER_PROFILE } from "../data/portfolioData";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(ENGINEER_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const socialLinks = [
    { name: "LinkedIn", href: ENGINEER_PROFILE.socials.linkedin, external: true },
    { name: "GitHub", href: ENGINEER_PROFILE.socials.github, external: true },
    { name: "LeetCode", href: ENGINEER_PROFILE.socials.leetcode, external: true },
    { name: "Hashnode", href: ENGINEER_PROFILE.socials.hashnode, external: true },
    { name: "Gmail", href: `mailto:${ENGINEER_PROFILE.email}`, external: false },
  ];

  return (
    <section
      id="contact"
      aria-label="Contact and Socials"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="mb-14">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#1268A3] font-semibold">
          07 // ENGAGEMENT
        </span>
        <h2
          className="mt-1 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          LET'S CONNECT
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#61727A] max-w-xl">
          Interested in discussing software engineering internships, product engineering roles,
          or backend & practical AI architectures? Feel free to send a note or explore my channels.
        </p>
      </div>

      {/* Grid: Contact Form + Direct Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF7] border border-[#D9DDD7] rounded-3xl p-6 sm:p-9 shadow-[0_4px_20px_rgba(16,42,54,0.03)]">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#F4C928]/25 text-[#102A36] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-[#102A36]" />
              </div>
              <h3 className="text-xl font-bold text-[#102A36] mb-2">Message Sent</h3>
              <p className="text-sm text-[#61727A] max-w-sm mb-6">
                Thank you, {formData.name}. I've received your note and will get back to you shortly at {formData.email}.
              </p>
              <button
                id="send-another-message"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", message: "" });
                }}
                className="text-xs font-mono font-medium text-[#1268A3] hover:underline"
              >
                Send another message →
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#102A36] mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  placeholder="Your name or team"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EE] border border-[#D9DDD7] text-sm text-[#102A36] placeholder-[#61727A]/60 focus:outline-none focus:border-[#1268A3] focus:ring-2 focus:ring-[#1268A3]/10 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#102A36] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EE] border border-[#D9DDD7] text-sm text-[#102A36] placeholder-[#61727A]/60 focus:outline-none focus:border-[#1268A3] focus:ring-2 focus:ring-[#1268A3]/10 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono font-medium uppercase tracking-wider text-[#102A36] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell me about your team, role, or project opportunity..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F5EE] border border-[#D9DDD7] text-sm text-[#102A36] placeholder-[#61727A]/60 focus:outline-none focus:border-[#1268A3] focus:ring-2 focus:ring-[#1268A3]/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#F4C928] hover:bg-[#FFD84A] text-[#102A36] font-semibold text-sm transition-all shadow-2xs hover:shadow-sm"
              >
                <span>Send message</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Channels & Social Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-[#D9DDD7] shadow-2xs">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#1268A3] font-semibold mb-2">
              DIRECT INBOX
            </div>
            <div className="text-base font-semibold text-[#102A36] font-mono break-all mb-4">
              {ENGINEER_PROFILE.email}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${ENGINEER_PROFILE.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#102A36] text-white text-xs font-medium hover:bg-[#1268A3] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Mail Client ↗</span>
              </a>
              <button
                id="copy-email-btn"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#F4C928]/30 text-[#102A36] text-xs font-medium border border-[#D9DDD7] transition-colors"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#1268A3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? "Copied!" : "Copy Address"}</span>
              </button>
            </div>
          </div>

          {/* Elegant Social Links List */}
          <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-[#D9DDD7] shadow-2xs">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#61727A] font-semibold mb-3">
              TECHNICAL PROFILES & PRESENCE
            </div>
            <div className="divide-y divide-[#D9DDD7]/60">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  id={`social-link-${link.name.toLowerCase()}`}
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noreferrer" : ""}
                  className="py-3 flex items-center justify-between group hover:text-[#1268A3] transition-colors text-sm font-medium text-[#102A36]"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {link.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#61727A] group-hover:text-[#1268A3] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Download Resume Action */}
          <div className="p-5 rounded-2xl bg-[#F7F5EE] border border-[#D9DDD7] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#1268A3]" />
              <span className="text-xs font-mono font-medium text-[#102A36]">
                RESUME // CURRICULUM VITAE
              </span>
            </div>
            <button
              id="download-resume-btn"
              onClick={() => setResumeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F4C928] hover:bg-[#FFD84A] text-[#102A36] text-xs font-semibold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Quick Inspection Modal */}
      <AnimatePresence>
        {resumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A36]/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FFFDF7] border border-[#D9DDD7] rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#D9DDD7]/80 pb-3 mb-5">
                <span className="font-mono text-xs text-[#1268A3] font-semibold">
                  BHAVADHARANI // CURRICULUM VITAE
                </span>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="text-xs font-mono text-[#61727A] hover:text-[#102A36]"
                >
                  [ESC]
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#102A36]/90 leading-relaxed font-mono">
                <p>
                  <strong>ROLE:</strong> Software Engineer (Backend, Dev Tools, Practical AI)
                </p>
                <p>
                  <strong>EDUCATION:</strong> B.Tech Information Technology (Sep 2023 – Present)
                </p>
                <p>
                  <strong>PROGRAMS:</strong> Infosys Pragati (Cohort 3), McKinsey Forward, Synergy Marine Group Intern
                </p>
                <p>
                  <strong>LEADERSHIP:</strong> Founder, DEVS NEC student developer community
                </p>
                <p>
                  <strong>KEY TECH:</strong> Java, Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Docker
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D9DDD7]/80 flex justify-end gap-2">
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#61727A] hover:text-[#102A36]"
                >
                  Close
                </button>
                <a
                  href={`mailto:${ENGINEER_PROFILE.email}?subject=Resume%20Request%20for%20Bhavadharani`}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#F4C928] text-[#102A36] hover:bg-[#FFD84A] transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Request Full PDF</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
