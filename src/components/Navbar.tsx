import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<"HOME" | "ABOUT" | "JOURNEY" | "WORKS" | "CONTACT">("HOME");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      const heroEl = document.getElementById("home");
      const aboutEl = document.getElementById("about");
      const journeyEl = document.getElementById("journey");
      const projectsEl = document.getElementById("projects");
      const blogsEl = document.getElementById("blogs");
      const openSourceEl = document.getElementById("open-source");
      const skillsEl = document.getElementById("skills");
      const contactEl = document.getElementById("contact");

      const threshold = window.innerHeight * 0.35;

      const getTop = (el: HTMLElement | null) => (el ? el.getBoundingClientRect().top : Infinity);

      const aboutTop = getTop(aboutEl);
      const journeyTop = getTop(journeyEl);
      const projectsTop = getTop(projectsEl);
      const blogsTop = getTop(blogsEl);
      const openSourceTop = getTop(openSourceEl);
      const skillsTop = getTop(skillsEl);
      const contactTop = getTop(contactEl);

      // Contact is active when near bottom or contact reached
      if (contactTop <= threshold || (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
        setActiveTab("CONTACT");
      } else if (
        projectsTop <= threshold ||
        blogsTop <= threshold ||
        openSourceTop <= threshold ||
        skillsTop <= threshold
      ) {
        setActiveTab("WORKS");
      } else if (journeyTop <= threshold) {
        setActiveTab("JOURNEY");
      } else if (aboutTop <= threshold) {
        setActiveTab("ABOUT");
      } else {
        setActiveTab("HOME");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems: { label: "HOME" | "ABOUT" | "JOURNEY" | "WORKS" | "CONTACT"; targetId: string }[] = [
    { label: "HOME", targetId: "home" },
    { label: "ABOUT", targetId: "about" },
    { label: "JOURNEY", targetId: "journey" },
    { label: "WORKS", targetId: "projects" },
    { label: "CONTACT", targetId: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 sm:py-5 transition-all duration-300">
      <nav
        id="desktop-navbar"
        aria-label="Main Navigation"
        className={`flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFDF7]/90 backdrop-blur-md border-[#D9DDD7] shadow-[0_4px_24px_rgba(16,42,54,0.06)]"
            : "bg-[#FFFDF7]/70 backdrop-blur-sm border-[#D9DDD7]/80"
        }`}
      >
        {/* Brand identity touch on mobile/left */}
        <button
          id="nav-brand-button"
          onClick={() => scrollTo("home")}
          className="mr-2 sm:mr-3 flex items-center gap-1.5 px-2.5 py-1 text-left group"
        >
          <span className="w-2 h-2 rounded-full bg-[#F4C928] group-hover:scale-125 transition-transform"></span>
          <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#102A36]">
            BHAVA
          </span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                id={`nav-item-${item.label.toLowerCase()}`}
                onClick={() => scrollTo(item.targetId)}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors whitespace-nowrap rounded-full ${
                  isActive ? "text-[#102A36]" : "text-[#61727A] hover:text-[#102A36]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#F4C928]/35 rounded-full border border-[#F4C928]/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chatbot trigger in navbar */}
        <button
          id="nav-chatbot-trigger"
          onClick={onOpenChat}
          className="relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] font-medium rounded-full bg-[#1268A3]/10 hover:bg-[#1268A3]/15 text-[#1268A3] border border-[#1268A3]/20 transition-all hover:border-[#1268A3]/40"
        >
          <span>chatbot</span>
          <Sparkles className="w-3.5 h-3.5 text-[#1268A3]" />
        </button>

        {/* Mobile menu toggle */}
        <button
          id="nav-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#102A36] hover:bg-[#F4C928]/20 rounded-full transition-colors ml-1"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-16 left-4 right-4 bg-[#FFFDF7] border border-[#D9DDD7] rounded-2xl shadow-xl p-4 flex flex-col gap-2 z-50"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                id={`mobile-nav-${item.label.toLowerCase()}`}
                onClick={() => scrollTo(item.targetId)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.label
                    ? "bg-[#F4C928]/30 text-[#102A36] font-semibold"
                    : "text-[#61727A] hover:bg-[#F7F5EE] hover:text-[#102A36]"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[11px] text-[#61727A]">
                  {item.label === "WORKS" ? "Projects · Blogs · Open Source · Skills" : ""}
                </span>
              </button>
            ))}
            <div className="pt-2 border-t border-[#D9DDD7]/80 flex justify-between items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#1268A3] text-white"
              >
                <Sparkles className="w-4 h-4 text-[#FFD84A]" />
                <span>Chat with Bhava 2.0</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
