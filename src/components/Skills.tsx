import React, { useState } from "react";
import { motion } from "motion/react";
import { SKILLS_DATA } from "../data/portfolioData";
import { Cpu, Database, Wrench, Code2, Sparkles, GitBranch, Users } from "lucide-react";

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [inspectedSkill, setInspectedSkill] = useState<{ name: string; context: string } | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    LANGUAGES: <Code2 className="w-4 h-4" />,
    // Legacy key
    FRAMEWORKS: <Cpu className="w-4 h-4" />,
    // New key
    "FRAMEWORKS & RUNTIME": <Cpu className="w-4 h-4" />,
    // Legacy key
    DATABASES: <Database className="w-4 h-4" />,
    // New key
    "DATABASES & PERSISTENCE": <Database className="w-4 h-4" />,
    ENGINEERING: <Wrench className="w-4 h-4" />,
    "DATA / AI": <Sparkles className="w-4 h-4" />,
    "SOFTWARE ENGINEERING PRACTICES": <GitBranch className="w-4 h-4" />,
    "SOFT SKILLS": <Users className="w-4 h-4" />,
  };

  const filteredCategories =
    activeCategory === "ALL"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((cat) => cat.category === activeCategory);

  return (
    <section
      id="skills"
      aria-label="Engineering Toolkit"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            SKILLS
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#61727A] max-w-md">
          A disciplined engineering toolkit structured around backend architectures, reliable data stores, and production developer workflows.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <button
          id="skill-filter-all"
          onClick={() => setActiveCategory("ALL")}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
            activeCategory === "ALL"
              ? "bg-[#102A36] text-white"
              : "bg-[#FFFDF7] text-[#61727A] hover:text-[#102A36] border border-[#D9DDD7]"
          }`}
        >
          ALL CATEGORIES
        </button>
        {SKILLS_DATA.map((cat) => (
          <button
            key={cat.category}
            id={`skill-filter-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === cat.category
                ? "bg-[#1268A3] text-white"
                : "bg-[#FFFDF7] text-[#61727A] hover:text-[#102A36] border border-[#D9DDD7]"
            }`}
          >
            {categoryIcons[cat.category]}
            <span>{cat.category}</span>
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.category}
            className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF7] border border-[#D9DDD7] flex flex-col justify-between shadow-2xs hover:border-[#1268A3]/50 transition-colors"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9DDD7]/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#1268A3]/10 text-[#1268A3]">
                    {categoryIcons[cat.category]}
                  </span>
                  <h3 className="text-sm font-mono font-bold tracking-wider text-[#102A36]">
                    {cat.category}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#61727A]">
                  {cat.skills.length} {["SOFT SKILLS", "SOFTWARE ENGINEERING PRACTICES"].includes(cat.category) ? "SKILLS" : "TOOLS"}
                </span>
              </div>

              {/* Category Description */}
              <p className="text-xs text-[#61727A] leading-relaxed mb-5">
                {cat.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isInspected = inspectedSkill?.name === skill.name;
                  return (
                    <button
                      key={skill.name}
                      id={`skill-tag-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      onClick={() =>
                        setInspectedSkill(isInspected ? null : skill)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all text-left ${
                        isInspected
                          ? "bg-[#F4C928] text-[#102A36] ring-2 ring-[#F4C928]/40 shadow-xs"
                          : "bg-[#F7F5EE] hover:bg-[#F4C928]/20 text-[#102A36] border border-[#D9DDD7]/60"
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inspect Detail Drawer */}
            {inspectedSkill && cat.skills.some((s) => s.name === inspectedSkill.name) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-5 pt-3.5 border-t border-[#D9DDD7]/80 text-xs text-[#102A36] bg-[#F7F5EE]/80 p-3 rounded-xl"
              >
                <div className="font-mono text-[10px] text-[#1268A3] uppercase font-semibold mb-1">
                  PRACTICAL CONTEXT // {inspectedSkill.name}
                </div>
                <p className="text-[#61727A] leading-relaxed">
                  {inspectedSkill.context}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};
