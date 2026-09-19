import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { BLOGS_DATA } from "../data/portfolioData";
import { BlogPost } from "../types";
import { ArticleModal } from "./ArticleModal";

interface BlogCardProps {
  blog: BlogPost;
  index: number;
  onSelect: (blog: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, index, onSelect }) => {
  const articleUrl = blog.url || `https://projects-explained.hashnode.dev/${blog.slug}`;

  return (
    <motion.article
      key={blog.id}
      id={`blog-card-${blog.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect(blog)}
      className="group flex flex-col justify-between p-7 rounded-2xl bg-[#FFFDF7] border border-[#D9DDD7] hover:border-[#1268A3] hover:shadow-[0_8px_30px_rgba(18,104,163,0.06)] cursor-pointer transition-all duration-300"
    >
      <div>
        {/* Topic / Category Meta */}
        <div className="flex items-center justify-between gap-2 mb-4 text-xs font-mono text-[#1268A3]">
          <span className="bg-[#1268A3]/10 px-2.5 py-1 rounded-md font-semibold">
            {blog.topic}
          </span>
          <span className="text-[#61727A] text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-bold text-[#102A36] tracking-tight group-hover:text-[#1268A3] transition-colors leading-snug mb-3"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {blog.title}
        </h3>

        {/* Short Genuine Description */}
        <p className="text-sm text-[#61727A] leading-relaxed font-normal">
          {blog.description}
        </p>
      </div>

      {/* Read Article CTA */}
      <div className="mt-8 pt-4 border-t border-[#D9DDD7]/60">
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between w-full text-xs font-semibold text-[#102A36] group-hover:text-[#1268A3] transition-colors"
        >
          <span>Read on Hashnode</span>
          <div className="w-7 h-7 rounded-full bg-[#F7F5EE] group-hover:bg-[#F4C928] group-hover:text-[#102A36] flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </a>
      </div>
    </motion.article>
  );
};


interface BlogsProps {
  onViewAll?: () => void;
}

export const Blogs: React.FC<BlogsProps> = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  return (
    <section
      id="blogs"
      aria-label="Things I've Written"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#D9DDD7]/80"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#102A36]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            THINGS I'VE WRITTEN
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#61727A] max-w-md">
          Deep-dives exploring mental learning systems, algorithmic optimization complexities, and security concurrency edge cases.
        </p>
      </div>

      {/* Horizontal Smooth Scroll Track */}
      <div
        className="overflow-x-auto overflow-y-hidden pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-thin"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#D9DDD7 transparent" }}
      >
        <div className="flex gap-6 w-max pr-8">
          {BLOGS_DATA.map((blog, idx) => (
            <div
              key={blog.id}
              className="w-[320px] sm:w-[360px] shrink-0 flex"
            >
              <BlogCard blog={blog} index={idx} onSelect={setSelectedArticle} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint for smaller screens */}
      <p className="mt-2 text-center text-[11px] font-mono text-[#61727A]/60 lg:hidden select-none">
        ← scroll horizontally to explore all {BLOGS_DATA.length} articles →
      </p>

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
