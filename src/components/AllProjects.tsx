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
      aria-label="All Projects"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
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
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#61727A] hover:text-[#102A36] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Portfolio</span>
        </button>
      </motion.div>

      {/* Section Header */}
      <div className="mb-12">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          ALL PROJECTS
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#61727A] max-w-xl">
          Every project I've built — from developer tools and AI backends to community platforms and portfolio systems.
        </p>
      </div>

      {/* All projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS_DATA.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
