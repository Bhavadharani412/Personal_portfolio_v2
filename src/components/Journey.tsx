import React, { useRef } from "react";
import { motion } from "motion/react";
import { JOURNEY_DATA } from "../data/portfolioData";

export const Journey: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="journey"
      aria-label="Engineering Journey"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            JOURNEY
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#61727A] max-w-md">
          A continuous progression from algorithmic foundations and community initiatives
          to enterprise systems, open source, leadership development, and scalable AI infrastructure.
        </p>
      </div>

      {/* Horizontal Timeline Track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-thin"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#D9DDD7 transparent" }}
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
          {/* Continuous horizontal line running through the marker row */}
          <div
            className="absolute left-7 right-12 top-3 h-[2px] bg-[#D9DDD7] z-0"
            aria-hidden="true"
          />

          {JOURNEY_DATA.map((milestone, idx) => {
            const isNow = milestone.tag === "NOW";

            return (
              <motion.article
                key={milestone.date}
                id={`milestone-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="relative z-10 flex flex-col items-start text-left group h-full"
              >
                {/* Circular Marker / Dot on top of the line */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 z-10 ${
                    isNow
                      ? "bg-[#102A36] ring-4 ring-[#F4C928]/40 shadow-sm"
                      : "bg-[#F7F5EE] border-2 border-[#1268A3] ring-4 ring-[#F7F5EE]"
                  }`}
                >
                  {isNow ? (
                    <span className="w-2 h-2 rounded-full bg-[#F4C928] animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1268A3]" />
                  )}
                </div>

                {/* Vertical Connector Line to Card */}
                <div className="w-[2px] h-3 bg-[#D9DDD7] ml-[11px]" aria-hidden="true" />

                {/* Card Container */}
                <div
                  className={`w-full flex-1 flex flex-col justify-between p-4.5 rounded-xl border transition-all duration-300 ${
                    isNow
                      ? "bg-white border-[#F4C928]/80 shadow-md ring-1 ring-[#F4C928]/30"
                      : "bg-[#FFFDF7]/90 hover:bg-white border-[#D9DDD7]/80 hover:border-[#1268A3]/30 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Date and Tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                      <span className="text-[11px] font-mono font-bold text-[#1268A3] tracking-wider uppercase">
                        {milestone.date}
                      </span>
                      <span
                        className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                          isNow
                            ? "bg-[#F4C928]/20 border-[#F4C928] text-[#102A36] font-semibold"
                            : "bg-[#FFFDF7] border-[#D9DDD7] text-[#61727A]"
                        }`}
                      >
                        {milestone.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#102A36] tracking-tight leading-snug">
                      {milestone.title}
                    </h3>

                    {/* Organization */}
                    {milestone.organization && (
                      <p className="mt-1 text-xs font-semibold text-[#1268A3]/80 leading-snug">
                        {milestone.organization}
                      </p>
                    )}

                    {/* Description */}
                    <p className="mt-2.5 text-xs text-[#61727A] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Key Takeaway / Focus */}
                  {milestone.keyTakeaway && (
                    <div className="mt-4 pt-3 border-t border-[#D9DDD7]/60 w-full">
                      <span className="font-mono text-[#1268A3] font-semibold uppercase text-[10px] block mb-1">
                        Key Takeaways:
                      </span>
                      <p className="text-[11px] text-[#61727A] leading-relaxed bg-[#F7F5EE]/80 rounded-md p-2 border border-[#D9DDD7]/40">
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

      {/* Mobile scroll hint */}
      <p className="mt-3 text-center sm:text-left text-[11px] font-mono text-[#61727A]/70 lg:hidden select-none">
        ← scroll horizontally to explore full journey →
      </p>
    </section>
  );
};
