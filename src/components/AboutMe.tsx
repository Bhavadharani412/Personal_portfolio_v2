import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Code2, Server, GitBranch, TerminalSquare } from "lucide-react";

export const AboutMe: React.FC = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(0);

  const principles = [
    {
      label: "Zero Black Boxes",
      detail: "Deconstruct abstractions down to memory, event loops, and network boundaries before trusting them.",
      icon: TerminalSquare,
    },
    {
      label: "Reliability Over Hype",
      detail: "Build predictable backend pipelines with clean failure isolation rather than speculative complexity.",
      icon: Server,
    },
    {
      label: "Tools That Empower",
      detail: "Engineering is multiplied when developer tooling simplifies cognitive overhead for teammates.",
      icon: Code2,
    },
    {
      label: "Open Collaboration",
      detail: "Code is a social artifact. Great software emerges from rigorous peer review and community mentorship.",
      icon: GitBranch,
    },
  ];

  return (
    <section
      id="about"
      aria-label="About Bhavadharani"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="mb-14">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          ABOUT ME
        </h2>
      </div>

      {/* Asymmetric Proportional Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Text-led Narrative (Editorial & Spacious - 7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-[#102A36]/90 text-base sm:text-lg leading-relaxed font-normal">
          <p className="text-xl sm:text-2xl text-[#102A36] font-medium leading-snug">
            I am a student software engineer driven by a fundamental impulse:{" "}
            <span className="underline decoration-[#F4C928] decoration-2 underline-offset-4">
              to understand how computing systems genuinely behave under the surface.
            </span>
          </p>

          <p className="text-[#61727A]">
            Rather than treating frameworks as opaque magic, I obsess over what happens between the lines of code —
            from abstract syntax trees and request lifecycle bottlenecks to relational database indices and network
            concurrency models.
          </p>

          <p className="text-[#61727A]">
            My work spans three interconnected spaces: crafting resilient <strong className="text-[#102A36] font-medium">backend systems</strong> that
            handle enterprise workflows gracefully, developing <strong className="text-[#102A36] font-medium">developer tools</strong> that transform code
            comprehension into accessible technical writing, and integrating <strong className="text-[#102A36] font-medium">practical AI models</strong> into
            predictable, user-centric products.
          </p>

          <p className="text-[#61727A]">
            Beyond code, I believe deeply in community-driven growth. Whether mentoring junior contributors at DEVS NEC,
            contributing to open-source codebases, or testing mental frameworks through the McKinsey Forward program,
            I approach software engineering as an ongoing discipline of clarity, craft, and shared problem-solving.
          </p>
        </div>

        {/* Abstract UI Component: Engineering Principles & Mental Model (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF7] border border-[#D9DDD7] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(16,42,54,0.03)]">
          <div className="flex items-center justify-between border-b border-[#D9DDD7]/80 pb-3 mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#61727A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1268A3]"></span>
              CORE MENTAL MODELS
            </span>
            <span className="text-[11px] font-mono text-[#1268A3] bg-[#1268A3]/10 px-2 py-0.5 rounded">
              SYSTEM ETHOS
            </span>
          </div>

          <div className="space-y-2.5">
            {principles.map((p, index) => {
              const Icon = p.icon;
              const isSelected = selectedPrinciple === index;
              return (
                <div
                  key={p.label}
                  id={`principle-${index}`}
                  onClick={() => setSelectedPrinciple(index)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "bg-[#F7F5EE] border-[#F4C928] shadow-xs"
                      : "bg-[#FFFDF7] border-transparent hover:border-[#D9DDD7] hover:bg-[#F7F5EE]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#F4C928] text-[#102A36]" : "bg-[#F7F5EE] text-[#61727A]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-[#102A36]">
                        {p.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-mono text-[#1268A3] font-medium">active</span>
                    )}
                  </div>
                  {isSelected && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2.5 text-xs text-[#61727A] leading-relaxed pl-9"
                    >
                      {p.detail}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#D9DDD7]/80 flex items-center justify-between text-xs text-[#61727A]">
            <span>ENGINEER PROFILE</span>
            <span className="font-mono text-[#102A36] font-medium">BHAVADHARANI // B.TECH IT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
