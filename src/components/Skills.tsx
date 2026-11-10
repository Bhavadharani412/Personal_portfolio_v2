import React, { useState } from "react";
import { motion } from "motion/react";
import { SKILLS_DATA } from "../data/portfolioData";
import { Compass, Code2, Sparkles, Wrench } from "lucide-react";

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [inspectedSkill, setInspectedSkill] = useState<{ name: string; context: string } | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    "Forward-Deployed Engineering": <Compass className="w-4 h-4" />,
    "Software Development": <Code2 className="w-4 h-4" />,
    "AI and Machine Learning": <Sparkles className="w-4 h-4" />,
    "DevOps and Engineering Tools": <Wrench className="w-4 h-4" />,
  };

  const filteredCategories =
    activeCategory === "ALL"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((cat) => cat.category === activeCategory);

  return (
    <section
      id="skills"
      aria-label="Engineering Capabilities & Skills"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Natural Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-end">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#174F91] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            What I Work With
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F] leading-[1.02]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            SKILLS
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1F211F] leading-[1.15]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            A practical toolkit for{" "}
            <span className="font-serif-italic font-normal text-[#174F91]">
              building things.
            </span>
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <button
          id="skill-filter-all"
          onClick={() => setActiveCategory("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeCategory === "ALL"
              ? "bg-[#1F211F] text-[#FFFDF8]"
              : "bg-[#FFFDF8] text-[#5C5F5B] hover:text-[#1F211F] border border-[#E4DFD3]"
          }`}
        >
          ALL CATEGORIES
        </button>
        {SKILLS_DATA.map((cat) => (
          <button
            key={cat.category}
            id={`skill-filter-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === cat.category
                ? "bg-[#EFB323] text-[#1F211F] border border-[#EFB323]"
                : "bg-[#FFFDF8] text-[#5C5F5B] hover:text-[#1F211F] border border-[#E4DFD3]"
            }`}
          >
            <span className="text-[#174F91]">{categoryIcons[cat.category]}</span>
            <span>{cat.category}</span>
          </button>
        ))}
      </div>

      {/* Four Meaningful Capability Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredCategories.map((cat, idx) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="p-7 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] flex flex-col justify-between shadow-[0_6px_24px_rgba(31,33,31,0.03)] hover:border-[#174F91] transition-colors"
          >
            <div>
              {/* Group Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E4DFD3]">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#FFD66B]/45 border border-[#EFB323]/50 text-[#174F91] flex items-center justify-center shrink-0">
                    {categoryIcons[cat.category]}
                  </span>
                  <h3
                    className="text-lg sm:text-xl font-bold text-[#1F211F]"
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {cat.category}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#5C5F5B] bg-[#F8F5ED] px-2.5 py-1 rounded-full border border-[#E4DFD3]">
                  {cat.skills.length} capabilities
                </span>
              </div>

              {/* Group Description */}
              <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed mb-5">
                {cat.description}
              </p>

              {/* Flexible Capability Chips */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isInspected = inspectedSkill?.name === skill.name;
                  return (
                    <button
                      key={skill.name}
                      id={`skill-tag-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      onClick={() => setInspectedSkill(isInspected ? null : skill)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all text-left cursor-pointer border ${
                        isInspected
                          ? "bg-[#EFB323] text-[#1F211F] border-[#1F211F]/20 ring-2 ring-[#FFD66B] shadow-xs"
                          : "bg-[#F8F5ED] hover:bg-[#FFD66B]/35 text-[#1F211F] border-[#E4DFD3] hover:border-[#EFB323]"
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Practical Context Drawer */}
            {inspectedSkill && cat.skills.some((s) => s.name === inspectedSkill.name) && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 pt-4 border-t border-[#E4DFD3]/80"
              >
                <div className="text-xs bg-[#F8F5ED] p-3.5 rounded-2xl border border-[#EFB323]/60">
                  <div className="font-mono text-[10px] text-[#174F91] uppercase font-bold mb-1">
                    {inspectedSkill.name}
                  </div>
                  <p className="text-[#1F211F]/85 leading-relaxed">
                    {inspectedSkill.context}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
