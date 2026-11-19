import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Journey } from "./components/Journey";
import { Projects } from "./components/Projects";
import { Blogs } from "./components/Blogs";
import { OpenSource } from "./components/OpenSource";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Chatbot } from "./components/Chatbot";
import { Footer } from "./components/Footer";
import { EngineeringPage } from "./components/EngineeringPage";
import { trackEvent, getAttributionData } from "./utils/analytics";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const attribution = getAttributionData();
    trackEvent("page_view", { view: currentPath === "/engineering" ? "engineering" : "portfolio", source: attribution.source });

    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
    trackEvent("page_view", { view: path === "/engineering" ? "engineering" : "portfolio" });
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleExploreWork = () => {
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (currentPath === "/engineering") {
    return (
      <div className="min-h-screen bg-[#F8F5ED] text-[#1F211F] selection:bg-[#EFB323]/35 selection:text-[#1F211F]">
        <EngineeringPage onBack={() => navigateTo("/")} />
        <Footer onNavigateEngineering={() => navigateTo("/engineering")} />
        <Chatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#1F211F] selection:bg-[#EFB323]/35 selection:text-[#1F211F]">
      {/* Scroll-Aware Desktop & Mobile Navbar */}
      <Navbar onOpenChat={handleOpenChat} />

      {/* Single-Page Portfolio Experience */}
      <main>
        {/* Home — Hero */}
        <Hero onOpenChat={handleOpenChat} onExploreWork={handleExploreWork} />

        {/* About */}
        <AboutMe />

        {/* Journey — Horizontal Interactive Timeline */}
        <Journey />

        {/* Works — 3 Featured + View All Works inline */}
        <Projects />

        {/* Blogs — 3 Featured + Read All Blogs inline */}
        <Blogs />

        {/* Open Source Contributions */}
        <OpenSource />

        {/* Skills */}
        <Skills />

        {/* Contact & Quick Links */}
        <Contact onOpenChat={handleOpenChat} />
      </main>

      {/* Footer */}
      <Footer onNavigateEngineering={() => navigateTo("/engineering")} />

      {/* Floating Personal Chatbot — Bhava 2.0 */}
      <Chatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
}
