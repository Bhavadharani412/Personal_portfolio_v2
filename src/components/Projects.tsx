import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, BookOpen, Plus, Minus } from "lucide-react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { Project } from "../types";

const ProjectArtwork: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const id = project.id;

  return (
    <div
      className="relative h-48 sm:h-52 w-full overflow-hidden border-b border-[#E4DFD3] flex items-center justify-center p-5 select-none"
      style={{
        background:
          index % 2 === 0
            ? "linear-gradient(135deg, #F8F5ED 0%, #FFFDF8 60%, rgba(255, 214, 107, 0.22) 100%)"
            : "linear-gradient(135deg, #F8F5ED 0%, rgba(76, 131, 188, 0.14) 65%, #FFFDF8 100%)",
      }}
      aria-hidden="true"
    >
      {/* Top Architecture Badge inside Artwork (No artificial numbering) */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FFFDF8]/90 border border-[#E4DFD3] text-[#174F91] font-semibold">
          {project.architecturePreview.badge}
        </span>
      </div>

      {/* Bespoke Original Artwork per Project */}
      {id === "webtrack" && (
        <div className="mt-5 w-[78%] max-w-[250px] h-28 bg-[#FFFDF8] border border-[#174F91]/25 rounded-xl shadow-[0_14px_28px_rgba(23,79,145,0.10)] -rotate-2 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-1.5">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
              <span className="w-2 h-2 rounded-full bg-[#FFD66B]" />
              <span className="w-2 h-2 rounded-full bg-[#4C83BC]" />
            </div>
            <span className="text-[9px] font-mono text-[#174F91] font-semibold">
              chrome.storage.local
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-14 pt-2 px-1">
            {[42, 78, 55, 92, 64, 85, 48].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-t-sm transition-transform group-hover:scale-y-105"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 3 || i === 5 ? "#EFB323" : i % 2 === 0 ? "#174F91" : "#4C83BC",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {id === "collaborative-text-editor" && (
        <div className="mt-5 relative w-[78%] max-w-[250px] h-28 flex items-center justify-center">
          <div className="w-48 h-26 bg-[#FFFDF8] border border-[#E4DFD3] rounded-xl shadow-[0_14px_28px_rgba(31,33,31,0.08)] rotate-2 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-20 h-2 rounded-full bg-[#174F91]/80" />
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#FFD66B]/60 text-[#1F211F] font-bold">
                Yjs CRDT
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E4DFD3]" />
            <div className="w-4/5 h-1.5 rounded-full bg-[#E4DFD3]" />
            <div className="w-3/5 h-1.5 rounded-full bg-[#EFB323]" />
          </div>
          <div className="absolute -top-1 right-3 bg-[#EFB323] text-[#1F211F] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
            ● Peer A · Synced
          </div>
          <div className="absolute bottom-1 left-2 bg-[#174F91] text-[#FFFDF8] text-[9px] font-mono px-2 py-0.5 rounded-full shadow-xs">
            ● WebSocket Live
          </div>
        </div>
      )}

      {id === "talentgraph-ai" && (
        <div className="mt-5 relative w-60 h-28 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 220 100" fill="none">
            <line x1="110" y1="50" x2="45" y2="24" stroke="#4C83BC" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="110" y1="50" x2="175" y2="24" stroke="#174F91" strokeWidth="1.5" />
            <line x1="110" y1="50" x2="52" y2="80" stroke="#174F91" strokeWidth="1.5" />
            <line x1="110" y1="50" x2="170" y2="80" stroke="#EFB323" strokeWidth="2" />
            <circle cx="45" cy="24" r="11" fill="#FFFDF8" stroke="#4C83BC" strokeWidth="2" />
            <circle cx="175" cy="24" r="12" fill="#174F91" />
            <circle cx="52" cy="80" r="11" fill="#FFD66B" stroke="#EFB323" strokeWidth="2" />
            <circle cx="170" cy="80" r="13" fill="#FFFDF8" stroke="#174F91" strokeWidth="2" />
            <circle cx="110" cy="50" r="18" fill="#EFB323" stroke="#1F211F" strokeWidth="2" />
          </svg>
          <span className="absolute text-[9px] font-mono font-bold text-[#1F211F]">
            100K
          </span>
        </div>
      )}

      {id === "skillos" && (
        <div className="mt-5 w-[80%] max-w-[255px] h-28 bg-[#1F211F] text-[#FFFDF8] rounded-xl p-3.5 font-mono text-[10px] shadow-[0_14px_30px_rgba(31,33,31,0.16)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#FFD66B]">
            <span>› skillos --mode=focus</span>
            <span className="px-1.5 py-0.2 bg-[#174F91] text-[#FFFDF8] rounded text-[8px]">
              RUST → ANDROID
            </span>
          </div>
          <div className="space-y-1 text-[#F8F5ED]/85 text-[9px]">
            <div>✓ Plan → Category → Subject</div>
            <div className="text-[#EFB323]">● Session timer active [Room DB]</div>
          </div>
          <div className="w-full bg-[#FFFDF8]/15 h-1.5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-[#EFB323]" />
          </div>
        </div>
      )}

      {id === "jewelflow" && (
        <div className="mt-5 relative flex items-center justify-center w-56 h-28">
          <div className="w-24 h-24 rotate-12 bg-gradient-to-br from-[#FFD66B] via-[#EFB323] to-[#174F91] p-[2px] rounded-2xl shadow-[0_12px_28px_rgba(239,179,35,0.28)]">
            <div className="w-full h-full bg-[#FFFDF8] rounded-[14px] flex flex-col items-center justify-center p-2 text-center">
              <div className="w-8 h-8 rotate-45 border-2 border-[#EFB323] bg-[#FFD66B]/40 mb-1" />
              <span className="text-[8px] font-mono font-bold text-[#1F211F] tracking-wider">
                ZUSTAND · REST
              </span>
            </div>
          </div>
          <div className="ml-3 space-y-1.5 text-[9px] font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] border border-[#E4DFD3] text-[#1F211F] font-semibold">
              Catalog & Filters
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-[#174F91] text-[#FFFDF8] font-semibold">
              Cart & Wishlist API
            </div>
          </div>
        </div>
      )}

      {id === "personal-portfolio-digital-twin" && (
        <div className="mt-5 relative w-60 h-28 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-[#174F91]/40 flex items-center justify-center relative">
            <div className="w-20 h-20 rounded-full border border-[#EFB323] bg-[#FFD66B]/25 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-[#1F211F]">
                BHAVA 2.0
              </span>
            </div>
            <span className="absolute -left-6 top-3 px-2 py-0.5 rounded-full bg-[#FFFDF8] border border-[#E4DFD3] text-[8px] font-mono font-semibold text-[#174F91]">
              Edge Worker
            </span>
            <span className="absolute -right-6 bottom-3 px-2 py-0.5 rounded-full bg-[#EFB323] text-[8px] font-mono font-bold text-[#1F211F]">
              Llama 3.3
            </span>
          </div>
        </div>
      )}

      {id === "ai-notes-generator" && (
        <div className="mt-5 flex items-center gap-2.5 w-[82%] max-w-[255px]">
          <div className="flex-1 p-2.5 rounded-xl bg-[#FFFDF8] border border-[#E4DFD3] space-y-1.5">
            <div className="text-[8px] font-mono text-[#5C5F5B] uppercase">Raw Transcript</div>
            <div className="h-1.5 w-full bg-[#E4DFD3] rounded" />
            <div className="h-1.5 w-5/6 bg-[#E4DFD3] rounded" />
            <div className="h-1.5 w-4/6 bg-[#E4DFD3] rounded" />
          </div>
          <div className="px-2 py-1 rounded-full bg-[#EFB323] text-[#1F211F] font-mono text-[9px] font-bold shrink-0">
            Chunk →
          </div>
          <div className="flex-1 p-2.5 rounded-xl bg-[#174F91] text-[#FFFDF8] space-y-1.5 shadow-sm">
            <div className="text-[8px] font-mono text-[#FFD66B] uppercase">Study Notes</div>
            <div className="h-1.5 w-full bg-[#FFD66B] rounded" />
            <div className="h-1.5 w-4/5 bg-[#FFFDF8]/80 rounded" />
            <div className="h-1.5 w-3/5 bg-[#FFFDF8]/60 rounded" />
          </div>
        </div>
      )}

      {id === "dev-explain-ai" && (
        <div className="mt-5 w-[82%] max-w-[255px] bg-[#FFFDF8] border border-[#E4DFD3] rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-[9px] font-mono mb-2 pb-1.5 border-b border-[#E4DFD3]">
            <span className="font-bold text-[#1F211F]">ask_groq() Gateway</span>
            <span className="text-[#174F91] font-semibold">3 Workflows</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[8px] font-mono text-center">
            <div className="p-1.5 rounded-lg bg-[#FFD66B]/45 text-[#1F211F] font-semibold border border-[#EFB323]/50">
              Code AST
            </div>
            <div className="p-1.5 rounded-lg bg-[#174F91]/10 text-[#174F91] font-semibold border border-[#174F91]/20">
              Repo Review
            </div>
            <div className="p-1.5 rounded-lg bg-[#F8F5ED] text-[#1F211F] font-semibold border border-[#E4DFD3]">
              Article Gen
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => (
  <motion.article
    key={project.id}
    id={`project-${project.id}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
    className="group bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(31,33,31,0.03)] hover:border-[#174F91] hover:shadow-[0_18px_42px_rgba(23,79,145,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
  >
    <div>
      {/* Original Artwork Header */}
      <ProjectArtwork project={project} index={index} />

      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#174F91]/10 text-[#174F91] font-semibold tracking-wide">
            {project.category}
          </span>
        </div>

        <h3
          className="text-xl font-bold text-[#1F211F] tracking-tight leading-snug mb-2 group-hover:text-[#174F91] transition-colors"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {project.title}
        </h3>

        {project.metricsHighlight && (
          <p className="text-xs font-mono text-[#5C5F5B] mb-4">
            {project.metricsHighlight}
          </p>
        )}

        {/* Concise Problem Statement & What I Built */}
        <div className="space-y-2.5 mb-5">
          <div className="bg-[#F8F5ED] border-l-2 border-[#174F91] p-3 rounded-r-xl">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#174F91] font-bold mb-1">
              PROBLEM
            </h4>
            <p className="text-xs text-[#1F211F]/85 leading-relaxed">
              {project.problem}
            </p>
          </div>
          <div className="bg-[#F8F5ED] border-l-2 border-[#EFB323] p-3 rounded-r-xl">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#1F211F] font-bold mb-1">
              WHAT I BUILT
            </h4>
            <p className="text-xs text-[#1F211F]/85 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#5C5F5B] font-semibold mb-2">
            TECHNOLOGY STACK
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-mono bg-[#F8F5ED] text-[#1F211F] border border-[#E4DFD3] rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Repository, Live Demo & Blog Links */}
    <div className="px-6 py-4 bg-[#F8F5ED]/60 border-t border-[#E4DFD3] flex flex-wrap items-center gap-2">
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#1F211F] text-[#FFFDF8] hover:bg-[#174F91] transition-colors"
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#EFB323] text-[#1F211F] hover:bg-[#FFD66B] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Demo ↗</span>
        </a>
      )}
      {project.links.blog && (
        <a
          href={project.links.blog}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFDF8] text-[#174F91] border border-[#174F91]/30 hover:border-[#174F91] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog ↗</span>
        </a>
      )}
    </div>
  </motion.article>
);

export const Projects: React.FC = () => {
  const [showAllInline, setShowAllInline] = useState(false);

  const featuredProjects = PROJECTS_DATA.slice(0, 3);
  const remainingProjects = PROJECTS_DATA.slice(3);

  return (
    <section
      id="projects"
      aria-label="Selected Works"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Natural Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-end">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#174F91] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            Selected Works
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F] leading-[1.02]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            WORKS
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1F211F] leading-[1.15]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Small details. Real problems.{" "}
            <span className="font-serif-italic font-normal text-[#174F91]">
              Useful software.
            </span>
          </p>
        </div>
      </div>

      {/* Three Featured Projects Prominently Displayed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Remaining Projects Revealed on Interaction */}
      <AnimatePresence>
        {showAllInline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {remainingProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + 3} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "View All Works" Interaction */}
      <div className="mt-12 flex justify-center">
        <button
          id="view-all-works-btn"
          onClick={() => setShowAllInline((prev) => !prev)}
          aria-expanded={showAllInline}
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold text-sm transition-all shadow-[0_6px_20px_rgba(239,179,35,0.25)] hover:-translate-y-0.5 cursor-pointer border border-[#1F211F]/10"
        >
          {showAllInline ? (
            <>
              <Minus className="w-4 h-4" />
              <span>Show Featured Works</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>View All Works</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
