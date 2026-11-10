import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, ArrowUpRight } from "lucide-react";
import { BlogPost } from "../types";

interface ArticleModalProps {
  article: BlogPost;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const articleUrl = article.url || `https://projects-explained.hashnode.dev/${article.slug}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#1F211F]/45 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl p-6 sm:p-10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#174F91]">
              <span className="bg-[#174F91]/10 px-2.5 py-1 rounded-md font-semibold uppercase">
                {article.topic}
              </span>
              <span className="text-[#5C5F5B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#EFB323]" />
                {article.readTime}
              </span>
            </div>

            <button
              id="close-article-modal"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F8F5ED] text-[#5C5F5B] hover:text-[#1F211F] transition-colors cursor-pointer"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Title */}
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#1F211F] tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {article.title}
          </h2>

          {/* Article Summary Lead */}
          <p className="text-base sm:text-lg text-[#1F211F] font-medium leading-relaxed mb-7 pb-6 border-b border-[#E4DFD3]">
            {article.description}
          </p>

          {/* Article Body */}
          <div className="space-y-4 text-sm sm:text-base text-[#5C5F5B] leading-relaxed font-normal">
            {article.content.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#E4DFD3] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5C5F5B]">
            <span className="font-mono">BY BHAVADHARANI // BLOGS PUBLICATION</span>
            <div className="flex items-center gap-2.5">
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] font-bold transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#1F211F] text-[#FFFDF8] font-semibold hover:bg-[#174F91] transition-colors cursor-pointer"
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
