import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenChat: () => void;
}

type NavTab = "HOME" | "ABOUT" | "JOURNEY" | "WORKS" | "BLOGS" | "OPEN SOURCE" | "SKILLS" | "CONTACT";

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<NavTab>("HOME");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 36);

      const aboutEl = document.getElementById("about");
      const journeyEl = document.getElementById("journey");
      const projectsEl = document.getElementById("projects");
      const blogsEl = document.getElementById("blogs");
      const openSourceEl = document.getElementById("open-source");
      const skillsEl = document.getElementById("skills");
      const contactEl = document.getElementById("contact");

      const threshold = window.innerHeight * 0.36;
      const getTop = (el: HTMLElement | null) => (el ? el.getBoundingClientRect().top : Infinity);

      const aboutTop = getTop(aboutEl);
      const journeyTop = getTop(journeyEl);
      const projectsTop = getTop(projectsEl);
      const blogsTop = getTop(blogsEl);
      const openSourceTop = getTop(openSourceEl);
      const skillsTop = getTop(skillsEl);
      const contactTop = getTop(contactEl);

      if (contactTop <= threshold || window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        setActiveTab("CONTACT");
      } else if (skillsTop <= threshold) {
        setActiveTab("SKILLS");
      } else if (openSourceTop <= threshold) {
        setActiveTab("OPEN SOURCE");
      } else if (blogsTop <= threshold) {
        setActiveTab("BLOGS");
      } else if (projectsTop <= threshold) {
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
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navItems: { label: NavTab; targetId: string }[] = [
    { label: "HOME", targetId: "home" },
    { label: "ABOUT", targetId: "about" },
    { label: "JOURNEY", targetId: "journey" },
    { label: "WORKS", targetId: "projects" },
    { label: "BLOGS", targetId: "blogs" },
    { label: "OPEN SOURCE", targetId: "open-source" },
    { label: "SKILLS", targetId: "skills" },
    { label: "CONTACT", targetId: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300 pointer-events-none">
      <nav
        id="desktop-navbar"
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border transition-all duration-300 max-w-6xl w-full lg:w-auto ${
          isScrolled
            ? "bg-[#FFFDF8]/92 backdrop-blur-md border-[#E4DFD3] shadow-[0_10px_32px_rgba(31,33,31,0.07)]"
            : "bg-[#FFFDF8]/80 backdrop-blur-sm border-[#E4DFD3]/90 shadow-[0_4px_20px_rgba(31,33,31,0.03)]"
        }`}
      >
        {/* Brand identity */}
        <button
          id="nav-brand-button"
          onClick={() => scrollTo("home")}
          className="mr-1 sm:mr-3 flex items-center gap-2 px-2 py-1 text-left group cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-[#EFB323] text-[#1F211F] font-bold text-[11px] grid place-items-center shadow-[inset_0_-2px_0_rgba(31,33,31,0.15)] group-hover:bg-[#FFD66B] transition-colors">
            BK
          </span>
          <span
            className="text-[14px] sm:text-[15px] font-bold tracking-tight text-[#1F211F]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            bhavadharani<span className="text-[#EFB323]">.</span>
          </span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => scrollTo(item.targetId)}
                className={`relative px-3 py-1.5 text-[12px] font-semibold tracking-wide transition-colors whitespace-nowrap rounded-full cursor-pointer ${
                  isActive ? "text-[#1F211F]" : "text-[#5C5F5B] hover:text-[#1F211F]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#FFD66B]/65 rounded-full border border-[#EFB323]/80"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Bhava 2.0 Chatbot + Connect */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2">
          <button
            id="nav-chatbot-trigger"
            onClick={onOpenChat}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-full bg-[#174F91]/10 hover:bg-[#174F91] text-[#174F91] hover:text-[#FFFDF8] border border-[#174F91]/25 transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EFB323] group-hover:text-[#FFD66B] transition-colors" />
            <span>Bhava 2.0</span>
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 text-[12px] font-semibold rounded-full bg-[#1F211F] hover:bg-[#EFB323] text-[#FFFDF8] hover:text-[#1F211F] transition-all cursor-pointer"
          >
            <span>Let's connect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1F211F] hover:bg-[#FFD66B]/30 rounded-full transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto lg:hidden fixed top-16 left-3 right-3 bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl shadow-[0_20px_50px_rgba(31,33,31,0.12)] p-4 flex flex-col gap-1.5 z-50"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => scrollTo(item.targetId)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === item.label
                      ? "bg-[#FFD66B]/60 text-[#1F211F] border border-[#EFB323]"
                      : "text-[#5C5F5B] hover:bg-[#F8F5ED] hover:text-[#1F211F] border border-transparent"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
            <div className="pt-3 mt-1 border-t border-[#E4DFD3] flex justify-between items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#174F91] text-[#FFFDF8]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD66B]" />
                <span>Chat with Bhava 2.0</span>
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-[#EFB323] text-[#1F211F]"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
