import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Journey } from "./components/Journey";
import { Projects } from "./components/Projects";
import { AllProjects } from "./components/AllProjects";
import { Blogs } from "./components/Blogs";
import { AllBlogs } from "./components/AllBlogs";
import { OpenSource } from "./components/OpenSource";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Chatbot } from "./components/Chatbot";
import { Footer } from "./components/Footer";
import { trackEvent, getAttributionData } from "./utils/analytics";

type View = "portfolio" | "all-projects" | "all-blogs";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [view, setView] = useState<View>("portfolio");

  useEffect(() => {
    // Initialize attribution and send page_view event on load/view change
    const attribution = getAttributionData();
    trackEvent("page_view", { view, source: attribution.source });
  }, [view]);

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

  const handleViewAllProjects = () => {
    setView("all-projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllBlogs = () => {
    setView("all-blogs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("portfolio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#102A36] selection:bg-[#F4C928]/35 selection:text-[#102A36]">
      {/* Scroll-Aware Desktop & Mobile Navbar */}
      <Navbar onOpenChat={handleOpenChat} />

      {/* Main Content */}
      <main>
        {view === "portfolio" && (
          <>
            {/* 1. HOME — Hero */}
            <Hero onOpenChat={handleOpenChat} onExploreWork={handleExploreWork} />

            {/* 2. ABOUT ME */}
            <AboutMe />

            {/* 3. JOURNEY */}
            <Journey />

            {/* 4. PROJECTS — first 3 + view all */}
            <Projects onViewAll={handleViewAllProjects} />

            {/* 5. BLOGS — first 3 + view all */}
            <Blogs onViewAll={handleViewAllBlogs} />

            {/* 6. OPEN SOURCE CONTRIBUTIONS */}
            <OpenSource />

            {/* 7. SKILLS */}
            <Skills />

            {/* 8. CONTACT + SOCIALS */}
            <Contact />
          </>
        )}

        {view === "all-projects" && (
          <AllProjects onBack={handleBack} />
        )}

        {view === "all-blogs" && (
          <AllBlogs onBack={handleBack} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* 9. CHATBOT — Fixed throughout the website (Bottom Right) */}
      <Chatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
}
