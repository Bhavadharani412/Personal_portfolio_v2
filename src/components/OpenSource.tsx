import React from "react";
import { motion } from "motion/react";
import { GitPullRequest, GitBranch, ArrowUpRight, CheckCircle2, RefreshCw, ExternalLink } from "lucide-react";
import { OPEN_SOURCE_DATA } from "../data/portfolioData";

export const OpenSource: React.FC = () => {
  return (
    <section
      id="open-source"
      aria-label="Open Source Contributions"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            OPEN SOURCE CONTRIBUTIONS
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#61727A] max-w-md">
          Collaborative development, component refactoring, accessibility fixes, and ongoing engagement in public codebases.
        </p>
      </div>

      {/* Grid of Contributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {OPEN_SOURCE_DATA.map((work, idx) => {
          const isOngoing = work.status === "ongoing";

          return (
            <motion.div
              key={work.name}
              id={`open-source-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between ${
                isOngoing
                  ? "bg-[#F7F5EE]/80 border-dashed border-[#D9DDD7] text-[#61727A]"
                  : "bg-[#FFFDF7] border-[#D9DDD7] hover:border-[#1268A3] shadow-xs"
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-md font-semibold ${
                      isOngoing
                        ? "bg-[#D9DDD7]/50 text-[#61727A]"
                        : "bg-[#1268A3]/10 text-[#1268A3]"
                    }`}
                  >
                    {isOngoing ? "CONTINUING" : "CONTRIBUTION WORK"}
                  </span>
                  {work.repoUrl && (
                    <a
                      href={work.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#61727A] hover:text-[#102A36] transition-colors"
                      aria-label={`View repository for ${work.name}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Organization / Project Name */}
                <h3
                  className={`text-xl font-bold tracking-tight mb-2 ${
                    isOngoing ? "text-[#102A36]/70" : "text-[#102A36]"
                  }`}
                  style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                >
                  {work.name}
                </h3>

                {/* Role / Context */}
                <p className="text-xs font-mono text-[#1268A3] mb-4">
                  {work.role}
                </p>

                {/* Description */}
                <p className="text-sm text-[#102A36]/80 leading-relaxed mb-6">
                  {work.description}
                </p>

                {/* Contribution Highlights */}
                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-[#61727A]">
                    {isOngoing ? "ONGOING ENGAGEMENT" : "KEY HIGHLIGHTS"}
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#102A36]/85">
                    {work.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        {isOngoing ? (
                          <RefreshCw className="w-3.5 h-3.5 text-[#61727A] mt-0.5 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1268A3] mt-0.5 shrink-0" />
                        )}
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status Footer + View Button */}
              <div className="mt-8 pt-4 border-t border-[#D9DDD7]/60">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#61727A] mb-3">
                  <span>REPOSITORY DISCIPLINE</span>
                  <span className={isOngoing ? "text-[#61727A]" : "text-[#1268A3] font-semibold"}>
                    {isOngoing ? "ACTIVE EXPLORATION" : "VERIFIED COMMITS"}
                  </span>
                </div>
                {/* View button — shown when a repoUrl exists */}
                {work.repoUrl && (
                  <a
                    id={`open-source-view-${idx}`}
                    href={work.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#102A36] text-white hover:bg-[#1268A3] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View →</span>
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
