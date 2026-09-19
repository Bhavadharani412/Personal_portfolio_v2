import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { BLOGS_DATA } from "../data/portfolioData";
import { BlogPost } from "../types";
import { BlogCard } from "./Blogs";
import { ArticleModal } from "./ArticleModal";

interface AllBlogsProps {
  onBack: () => void;
}

export const AllBlogs: React.FC<AllBlogsProps> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  return (
    <section
      id="all-blogs"
      aria-label="All Blogs"
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
          id="all-blogs-back-btn"
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
          ALL BLOGS
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#61727A] max-w-xl">
          All technical essays, algorithmic explorations, and engineering post-mortems.
        </p>
      </div>

      {/* All blogs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOGS_DATA.map((blog, idx) => (
          <BlogCard key={blog.id} blog={blog} index={idx} onSelect={setSelectedArticle} />
        ))}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
};
