import React from "react";
import { motion } from "motion/react";
import { GitPullRequest, Compass, ArrowUpRight, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { OPEN_SOURCE_DATA } from "../data/portfolioData";

export const OpenSource: React.FC = () => {
  return (
    <section
      id="open-source"
      aria-label="Open Source Contributions"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Natural Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-end">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#174F91] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            Public Codebases
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F] leading-[1.02]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            OPEN SOURCE
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1F211F] leading-[1.15]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Better software happens{" "}
            <span className="font-serif-italic font-normal text-[#174F91]">
              together.
            </span>
          </p>
        </div>
      </div>

      {/* Exactly Three Cards: 1st Actual Contribution, 2nd Actual Contribution, 3rd Future Intent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {OPEN_SOURCE_DATA.slice(0, 3).map((work, idx) => {
          const isFuture = work.status === "future" || work.status === "ongoing";

          return (
            <motion.article
              key={work.name}
              id={`open-source-${idx}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className={`rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between ${
                isFuture
                  ? "bg-gradient-to-br from-[#F8F5ED] via-[#FFFDF8] to-[#FFD66B]/20 border-2 border-dashed border-[#EFB323]"
                  : "bg-[#FFFDF8] border-[#E4DFD3] hover:border-[#174F91] shadow-[0_6px_24px_rgba(31,33,31,0.03)] hover:shadow-[0_16px_38px_rgba(23,79,145,0.08)]"
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold ${
                      isFuture
                        ? "bg-[#FFD66B]/60 text-[#1F211F] border border-[#EFB323]"
                        : "bg-[#174F91]/10 text-[#174F91]"
                    }`}
                  >
                    {isFuture ? (
                      <>
                        <Compass className="w-3.5 h-3.5 text-[#1F211F]" />
                        <span>FUTURE INTENT · ROADMAP</span>
                      </>
                    ) : (
                      <>
                        <GitPullRequest className="w-3.5 h-3.5 text-[#174F91]" />
                        <span>MERGED CONTRIBUTION</span>
                      </>
                    )}
                  </span>

                  {work.repoUrl && (
                    <a
                      href={work.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#F8F5ED] hover:bg-[#EFB323] text-[#1F211F] flex items-center justify-center transition-colors"
                      aria-label={`View pull requests for ${work.name}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Project / Intent Title */}
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F211F] mb-1.5"
                  style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                >
                  {work.name}
                </h3>

                {/* Role / Context */}
                <p className="text-xs font-mono font-semibold text-[#174F91] mb-4">
                  {work.role}
                </p>

                {/* Description */}
                <p className="text-sm text-[#5C5F5B] leading-relaxed mb-6">
                  {work.description}
                </p>

                {/* Highlights / Future Focus Areas */}
                <div className="space-y-2.5 bg-[#F8F5ED] p-4 rounded-2xl border border-[#E4DFD3]/80">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-[#174F91] font-bold">
                    {isFuture ? "WHAT I INTEND TO EXPLORE NEXT" : "MERGED WORK & VALIDATION"}
                  </div>
                  <ul className="space-y-2 text-xs text-[#1F211F]/85">
                    {work.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        {isFuture ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#EFB323] mt-0.5 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#174F91] mt-0.5 shrink-0" />
                        )}
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Action */}
              <div className="mt-7 pt-4 border-t border-[#E4DFD3]">
                {work.repoUrl ? (
                  <a
                    id={`open-source-view-${idx}`}
                    href={work.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-bold bg-[#1F211F] text-[#FFFDF8] hover:bg-[#174F91] transition-colors"
                  >
                    <span>Explore Merged Pull Requests</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FFD66B]" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 rounded-full bg-[#FFFDF8] border border-[#E4DFD3] text-[11px] font-mono text-[#5C5F5B]">
                    <span>STATUS: UPCOMING EXPLORATION</span>
                    <span className="text-[#174F91] font-bold">OPEN TO COLLABORATE</span>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
