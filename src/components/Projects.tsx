import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Github, ExternalLink, BookOpen } from "lucide-react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => (
  <motion.article
    key={project.id}
    id={`project-${project.id}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="bg-[#FFFDF7] border border-[#D9DDD7] rounded-2xl p-6 shadow-xs hover:border-[#1268A3]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
  >
    {/* Top: category + title */}
    <div className="flex flex-col gap-3 mb-4">
      <span className="self-start text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#1268A3]/10 text-[#1268A3] font-semibold tracking-wider">
        {project.category}
      </span>
      {project.metricsHighlight && (
        <span className="text-xs text-[#61727A] font-medium">
          {project.metricsHighlight}
        </span>
      )}
      <h3
        className="text-lg font-bold text-[#102A36] tracking-tight leading-snug"
        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
      >
        {project.title}
      </h3>
    </div>

    {/* Problem & Solution */}
    <div className="space-y-3 mb-4 flex-1">
      <div className="bg-[#F7F5EE]/70 border-l-2 border-[#1268A3] p-3 rounded-r-xl">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#1268A3] font-semibold mb-1">
          PROBLEM
        </h4>
        <p className="text-xs text-[#102A36]/85 leading-relaxed line-clamp-3">
          {project.problem}
        </p>
      </div>
      <div className="bg-[#F7F5EE]/70 border-l-2 border-[#F4C928] p-3 rounded-r-xl">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#102A36] font-semibold mb-1">
          SOLUTION
        </h4>
        <p className="text-xs text-[#102A36]/85 leading-relaxed line-clamp-3">
          {project.solution}
        </p>
      </div>
    </div>

    {/* Technologies */}
    <div className="mb-4">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#61727A] font-medium mb-2">
        TECHNOLOGIES
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[11px] font-mono bg-[#FFFDF7] text-[#102A36] border border-[#D9DDD7] rounded-lg"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#D9DDD7]/80">
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#102A36] text-white hover:bg-[#1268A3] transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub ↗</span>
        </a>
      )}
      {project.links.live && (
        <a
          href={project.links.live}
          target={project.links.live.startsWith("#") ? "_self" : "_blank"}
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F4C928] text-[#102A36] hover:bg-[#FFD84A] transition-colors font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live ↗</span>
        </a>
      )}
      {project.links.blog && (
        <a
          href={project.links.blog}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FFFDF7] text-[#1268A3] border border-[#1268A3]/30 hover:border-[#1268A3] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog ↗</span>
        </a>
      )}
    </div>
  </motion.article>
);

export { ProjectCard };

interface ProjectsProps {
  onViewAll?: () => void;
}

export const Projects: React.FC<ProjectsProps> = () => {
  return (
    <section
      id="projects"
      aria-label="Things I've Built"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            THINGS I'VE BUILT
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#61727A] max-w-md">
          A selection of real-world software engineering systems, community platforms, and AI-grounded developer tools.
        </p>
      </div>

      {/* Horizontal Smooth Scroll Track */}
      <div
        className="overflow-x-auto overflow-y-hidden pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-thin"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#D9DDD7 transparent" }}
      >
        <div className="flex gap-6 w-max pr-8">
          {PROJECTS_DATA.map((project, index) => (
            <div
              key={project.id}
              className="w-[320px] sm:w-[350px] shrink-0 flex"
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint for smaller screens */}
      <p className="mt-2 text-center text-[11px] font-mono text-[#61727A]/60 lg:hidden select-none">
        ← scroll horizontally to explore all {PROJECTS_DATA.length} projects →
      </p>
    </section>
  );
};
