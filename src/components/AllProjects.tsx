import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { ProjectCard } from "./Projects";

interface AllProjectsProps {
  onBack: () => void;
}

export const AllProjects: React.FC<AllProjectsProps> = ({ onBack }) => {
  return (
    <section
      id="all-projects"
      aria-label="All Works"
      className="py-28 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      {/* Back navigation */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <button
          id="all-projects-back-btn"
          onClick={onBack}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#E4DFD3] text-xs font-mono font-semibold text-[#1F211F] hover:border-[#EFB323] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Portfolio</span>
        </button>
      </motion.div>

      {/* Section Header */}
      <div className="mb-12">
        <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#174F91] font-semibold">
          COMPLETE ARCHIVE // {PROJECTS_DATA.length} SYSTEMS
        </span>
        <h2
          className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          ALL WORKS
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#5C5F5B] max-w-xl">
          Every project I've built — from developer tools and AI backends to distributed collaboration and learning systems.
        </p>
      </div>

      {/* All projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {PROJECTS_DATA.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
