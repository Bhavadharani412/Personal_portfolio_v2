import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, ArrowUpRight, Share2, BookOpen } from "lucide-react";
import { BlogPost } from "../types";

interface ArticleModalProps {
  article: BlogPost;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#102A36]/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#FFFDF7] border border-[#D9DDD7] rounded-3xl p-6 sm:p-10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-[#D9DDD7]/80 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1268A3]">
              <span className="bg-[#1268A3]/10 px-2.5 py-1 rounded-md font-semibold uppercase">
                {article.topic}
              </span>
              <span className="text-[#61727A] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <button
              id="close-article-modal"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F7F5EE] text-[#61727A] hover:text-[#102A36] transition-colors"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Title */}
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#102A36] tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {article.title}
          </h2>

          {/* Article Summary Lead */}
          <p className="text-base sm:text-lg text-[#102A36] font-medium leading-relaxed mb-8 pb-6 border-b border-[#D9DDD7]/80">
            {article.description}
          </p>

          {/* Article Body */}
          <div className="space-y-5 text-sm sm:text-base text-[#102A36]/85 leading-relaxed font-normal">
            {article.content.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#D9DDD7]/80 flex flex-wrap items-center justify-between gap-4 text-xs text-[#61727A]">
            <span className="font-mono">BY BHAVADHARANI // TECHNICAL ARCHIVE</span>
            <div className="flex items-center gap-2">
              <a
                href={article.url || `https://projects-explained.hashnode.dev/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F7F5EE] hover:bg-[#F4C928]/30 text-[#102A36] font-medium transition-colors"
              >
                <span>Read on Hashnode</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#102A36] text-white font-medium hover:bg-[#1268A3] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
