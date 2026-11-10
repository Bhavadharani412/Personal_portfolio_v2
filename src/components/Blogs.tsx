import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Clock, Plus, Minus } from "lucide-react";
import { BLOGS_DATA } from "../data/portfolioData";
import { BlogPost } from "../types";
import { ArticleModal } from "./ArticleModal";

const BlogCoverArtwork: React.FC<{ blog: BlogPost; index: number }> = ({ blog, index }) => {
  const id = blog.id;

  return (
    <div
      className="relative h-40 w-full overflow-hidden border-b border-[#E4DFD3] flex items-center justify-center p-4 select-none"
      style={{
        background:
          index % 3 === 0
            ? "linear-gradient(135deg, #F8F5ED 0%, rgba(239, 179, 35, 0.16) 100%)"
            : index % 3 === 1
            ? "linear-gradient(135deg, #F8F5ED 0%, rgba(23, 79, 145, 0.12) 100%)"
            : "linear-gradient(135deg, #FFFDF8 0%, rgba(76, 131, 188, 0.15) 55%, rgba(255, 214, 107, 0.2) 100%)",
      }}
      aria-hidden="true"
    >
      {/* Topic Badge (No artificial numbering) */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono">
        <span className="px-2.5 py-0.5 rounded-full bg-[#FFFDF8]/90 border border-[#E4DFD3] text-[#174F91] font-semibold uppercase tracking-wider truncate">
          {blog.topic}
        </span>
      </div>

      {/* Editorial Cover Artwork by Article ID */}
      {id.includes("webtrack") && (
        <div className="mt-5 flex items-center gap-2 bg-[#FFFDF8] border border-[#E4DFD3] rounded-xl px-3.5 py-2.5 shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EFB323] animate-pulse" />
          <div className="font-mono text-[10px] text-[#1F211F]">
            focus → active_tab → <span className="text-[#174F91] font-bold">persist()</span>
          </div>
        </div>
      )}

      {id === "bit-manipulation" && (
        <div className="mt-5 grid grid-cols-8 gap-1.5 p-2.5 rounded-xl bg-[#1F211F] text-[#FFFDF8] font-mono text-[10px] shadow-xs">
          {["1", "0", "1", "1", "0", "1", "0", "1", "0", "1", "1", "0", "1", "0", "1", "1"].map((bit, bIdx) => (
            <span
              key={bIdx}
              className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                bit === "1"
                  ? bIdx % 3 === 0
                    ? "bg-[#EFB323] text-[#1F211F]"
                    : "bg-[#174F91] text-[#FFFDF8]"
                  : "bg-[#FFFDF8]/10 text-[#FFFDF8]/60"
              }`}
            >
              {bit}
            </span>
          ))}
        </div>
      )}

      {id === "all-searching-algorithms" && (
        <div className="mt-5 w-[80%] max-w-[230px] space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#174F91] font-semibold">
            <span>low</span>
            <span className="px-1.5 py-0.2 rounded bg-[#EFB323] text-[#1F211F] font-bold">mid = O(log N)</span>
            <span>high</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[12, 24, 38, 56, 72, 88, 95].map((n, i) => (
              <div
                key={n}
                className={`py-1.5 rounded text-center font-mono text-[9px] font-bold border ${
                  i === 3
                    ? "bg-[#EFB323] border-[#1F211F] text-[#1F211F] scale-110"
                    : i < 3
                    ? "bg-[#FFFDF8]/60 border-[#E4DFD3] text-[#5C5F5B]"
                    : "bg-[#174F91]/15 border-[#174F91]/30 text-[#174F91]"
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {id === "building-qr-code-generator-in-rust" && (
        <div className="mt-5 flex items-center gap-3 bg-[#FFFDF8] border border-[#E4DFD3] p-2.5 rounded-xl shadow-2xs">
          <div className="grid grid-cols-3 gap-1 w-11 h-11 p-1 bg-[#F8F5ED] border border-[#1F211F] rounded">
            {[1, 1, 0, 1, 0, 1, 0, 1, 1].map((cell, cIdx) => (
              <span
                key={cIdx}
                className={cell ? (cIdx === 0 || cIdx === 8 ? "bg-[#EFB323]" : "bg-[#1F211F]") : "bg-transparent"}
              />
            ))}
          </div>
          <div className="font-mono text-[10px] space-y-0.5">
            <div className="font-bold text-[#1F211F]">cargo run -- qr</div>
            <div className="text-[#174F91]">→ output.svg</div>
          </div>
        </div>
      )}

      {id.includes("prime-number-checking") && (
        <div className="mt-5 flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-full border-2 border-[#174F91] bg-[#FFFDF8] flex items-center justify-center font-mono text-xs font-bold text-[#174F91]">
            6k±1
          </div>
          <div className="space-y-1 font-mono text-[9px]">
            <div className="px-2 py-0.5 rounded bg-[#FFD66B]/60 text-[#1F211F] font-semibold">
              O(N) → O(√N / 3)
            </div>
            <div className="text-[#5C5F5B]">5 Java Optimizations</div>
          </div>
        </div>
      )}

      {id === "study-system-101" && (
        <div className="mt-5 w-[78%] max-w-[225px] bg-[#1F211F] text-[#FFFDF8] rounded-xl p-2.5 font-mono text-[9px] border border-[#EFB323]/40">
          <div className="flex justify-between text-[#EFB323] mb-1">
            <span>STUDY SYSTEM 101</span>
            <span>[RATATUI]</span>
          </div>
          <div className="text-[#F8F5ED]/80">├─ state.rs · timer.rs</div>
          <div className="text-[#4C83BC]">└─ deep_evening_exec()</div>
        </div>
      )}

      {id === "beyond-the-editor" && (
        <div className="mt-5 flex items-center gap-2 font-mono text-[9px]">
          <span className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF8] border border-[#174F91] text-[#174F91] font-bold">
            Client A
          </span>
          <span className="px-2 py-1 rounded-full bg-[#EFB323] text-[#1F211F] font-bold">
            ⇄ Yjs CRDT ⇄
          </span>
          <span className="px-2.5 py-1.5 rounded-lg bg-[#174F91] text-[#FFFDF8] font-bold">
            Client B
          </span>
        </div>
      )}

      {id === "check-if-array-is-sorted-and-rotated" && (
        <div className="mt-5 flex items-end gap-1.5 h-12 px-3 py-2 bg-[#FFFDF8] border border-[#E4DFD3] rounded-xl">
          {[55, 75, 95, 30, 45].map((h, i) => (
            <div
              key={i}
              className="w-5 rounded-t transition-all"
              style={{
                height: `${h}%`,
                backgroundColor: i === 2 ? "#EFB323" : i > 2 ? "#174F91" : "#4C83BC",
              }}
            />
          ))}
          <span className="ml-2 text-[9px] font-mono font-bold text-[#1F211F] self-center">
            1 Pivot · O(N)
          </span>
        </div>
      )}

      {id === "cybersecurity-awareness-competition" && (
        <div className="mt-5 flex items-center gap-2.5 bg-[#FFFDF8] border border-[#E4DFD3] px-3.5 py-2 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-[#EFB323] text-[#1F211F] font-mono text-[10px] font-bold flex items-center justify-center">
            DoS
          </div>
          <div className="font-mono text-[9px]">
            <div className="font-bold text-[#1F211F]">Threat Identification</div>
            <div className="text-[#174F91]">Synergy Marine · Prize</div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BlogCardProps {
  blog: BlogPost;
  index: number;
  onSelect: (blog: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, index, onSelect }) => {
  const articleUrl = blog.url || `https://projects-explained.hashnode.dev/${blog.slug}`;
  const isLinkedIn = articleUrl.includes("linkedin.com");

  return (
    <motion.article
      key={blog.id}
      id={`blog-card-${blog.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      onClick={() => onSelect(blog)}
      className="group flex flex-col justify-between rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] hover:border-[#174F91] hover:shadow-[0_16px_38px_rgba(23,79,145,0.08)] hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      <div>
        {/* Distinctive Cover Artwork */}
        <BlogCoverArtwork blog={blog} index={index} />

        {/* Editorial Preview Body */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-3 text-[11px] font-mono text-[#5C5F5B]">
            <span className="text-[#174F91] font-semibold">{blog.date}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#EFB323]" />
              {blog.readTime}
            </span>
          </div>

          <h3
            className="text-lg sm:text-xl font-bold text-[#1F211F] tracking-tight group-hover:text-[#174F91] transition-colors leading-snug mb-3"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {blog.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed font-normal line-clamp-3">
            {blog.description}
          </p>
        </div>
      </div>

      {/* Clear Reading Links */}
      <div className="px-6 py-4 bg-[#F8F5ED]/60 border-t border-[#E4DFD3] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(blog);
          }}
          className="text-xs font-mono font-semibold text-[#5C5F5B] hover:text-[#1F211F] transition-colors cursor-pointer"
        >
          Quick Summary
        </button>

        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F211F] group-hover:text-[#174F91] transition-colors"
        >
          <span>{isLinkedIn ? "Read on LinkedIn" : "Read Article"}</span>
          <span className="w-6 h-6 rounded-full bg-[#FFD66B]/60 group-hover:bg-[#EFB323] text-[#1F211F] flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>
    </motion.article>
  );
};

export const Blogs: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [showAllBlocks, setShowAllBlocks] = useState(false);

  const featuredArticles = BLOGS_DATA.slice(0, 3);
  const remainingArticles = BLOGS_DATA.slice(3);

  return (
    <section
      id="blogs"
      aria-label="Blogs — Technical Writing"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E4DFD3]"
    >
      {/* Natural Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-end">
        <div className="lg:col-span-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase text-[#174F91] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EFB323]" />
            Technical Writing & Articles
          </span>
          <h2
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F211F] leading-[1.02]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            BLOGS
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1F211F] leading-[1.15]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Learning out loud.{" "}
            <span className="font-serif-italic font-normal text-[#174F91]">
              Sharing what sticks.
            </span>
          </p>
        </div>
      </div>

      {/* Three Featured Articles Initially */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {featuredArticles.map((blog, idx) => (
          <BlogCard key={blog.id} blog={blog} index={idx} onSelect={setSelectedArticle} />
        ))}
      </div>

      {/* Remaining Articles Revealed on "Read All Blogs" */}
      <AnimatePresence>
        {showAllBlocks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {remainingArticles.map((blog, idx) => (
                <BlogCard key={blog.id} blog={blog} index={idx + 3} onSelect={setSelectedArticle} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Read All Blogs" Interaction */}
      <div className="mt-12 flex justify-center">
        <button
          id="read-all-blocks-btn"
          onClick={() => setShowAllBlocks((prev) => !prev)}
          aria-expanded={showAllBlocks}
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold text-sm transition-all shadow-[0_6px_20px_rgba(239,179,35,0.25)] hover:-translate-y-0.5 cursor-pointer border border-[#1F211F]/10"
        >
          {showAllBlocks ? (
            <>
              <Minus className="w-4 h-4" />
              <span>Show Featured Blogs</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Read All Blogs</span>
            </>
          )}
        </button>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
};
