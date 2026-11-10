import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { JOURNEY_DATA } from "../data/portfolioData";

export const Journey: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(JOURNEY_DATA.length - 1);

  return (
    <section
      id="journey"
      aria-label="Engineering Journey"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            JOURNEY
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#5C5F5B] max-w-md">
          A continuous progression from algorithmic foundations and community initiatives
          to enterprise systems, open source, leadership development, and scalable AI infrastructure.
        </p>
      </div>

      {/* Horizontal Timeline Track (Restored Original Published Structure) */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-thin"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E4DFD3 transparent" }}
      >
        <div
          className="relative grid gap-6 pb-4"
          style={{
            minWidth: "max-content",
            width: "100%",
            gridTemplateColumns: `repeat(${JOURNEY_DATA.length}, minmax(260px, 320px))`,
            paddingLeft: "16px",
            paddingRight: "32px",
          }}
        >
          {/* Subtle Curved Horizontal Path Running Through the Marker Row */}
          <svg
            className="pointer-events-none absolute left-7 right-12 top-0.5 h-5 w-[calc(100%-4.75rem)] z-0 overflow-visible"
            viewBox="0 0 1000 20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 0 10 Q 70 4, 142 10 T 285 10 T 428 10 T 571 10 T 714 10 T 857 10 T 1000 10"
              fill="none"
              stroke="#E4DFD3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {JOURNEY_DATA.map((milestone, idx) => {
            const isNow = milestone.tag === "NOW";
            const isActive = selectedIdx === idx;

            return (
              <motion.article
                key={milestone.date}
                id={`milestone-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                onClick={() => setSelectedIdx(idx)}
                className="relative z-10 flex flex-col items-start text-left group h-full cursor-pointer"
              >
                {/* Circular Marker / Dot on top of the line */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx(idx);
                  }}
                  aria-label={`Select milestone ${milestone.title}`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 z-10 cursor-pointer ${
                    isNow || isActive
                      ? "bg-[#1F211F] ring-4 ring-[#EFB323]/45 shadow-sm"
                      : "bg-[#F8F5ED] border-2 border-[#174F91] ring-4 ring-[#F8F5ED]"
                  }`}
                >
                  {isNow || isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#EFB323] animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174F91]" />
                  )}
                </button>

                {/* Vertical Connector Line to Card */}
                <div
                  className={`w-[2px] h-3 ml-[11px] transition-colors ${
                    isActive || isNow ? "bg-[#EFB323]" : "bg-[#E4DFD3]"
                  }`}
                  aria-hidden="true"
                />

                {/* Card Container */}
                <div
                  className={`w-full flex-1 flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 ${
                    isNow || isActive
                      ? "bg-[#FFFDF8] border-[#EFB323] shadow-md ring-1 ring-[#EFB323]/35"
                      : "bg-[#FFFDF8]/90 hover:bg-[#FFFDF8] border-[#E4DFD3] hover:border-[#174F91]/40 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Date and Tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                      <span className="text-[11px] font-mono font-bold text-[#174F91] tracking-wider uppercase">
                        {milestone.date}
                      </span>
                      <span
                        className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                          isNow || isActive
                            ? "bg-[#EFB323]/25 border-[#EFB323] text-[#1F211F] font-semibold"
                            : "bg-[#FFFDF8] border-[#E4DFD3] text-[#5C5F5B]"
                        }`}
                      >
                        {milestone.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#1F211F] tracking-tight leading-snug">
                      {milestone.title}
                    </h3>

                    {/* Organization */}
                    {milestone.organization && (
                      <p className="mt-1 text-xs font-semibold text-[#174F91]/85 leading-snug">
                        {milestone.organization}
                      </p>
                    )}

                    {/* Description */}
                    <p className="mt-2.5 text-xs text-[#5C5F5B] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Key Takeaway / Focus */}
                  {milestone.keyTakeaway && (
                    <div className="mt-4 pt-3 border-t border-[#E4DFD3]/70 w-full">
                      <span className="font-mono text-[#174F91] font-semibold uppercase text-[10px] block mb-1">
                        Key Takeaways:
                      </span>
                      <p className="text-[11px] text-[#5C5F5B] leading-relaxed bg-[#F8F5ED]/90 rounded-md p-2.5 border border-[#E4DFD3]/50">
                        {milestone.keyTakeaway}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <p className="mt-3 text-center sm:text-left text-[11px] font-mono text-[#5C5F5B]/75 lg:hidden select-none">
        ← scroll horizontally to explore full journey →
      </p>
    </section>
  );
};
