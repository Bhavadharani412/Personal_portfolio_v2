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
import { trackEvent, getAttributionData } from "./utils/analytics";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const attribution = getAttributionData();
    trackEvent("page_view", { view: "portfolio", source: attribution.source });
  }, []);

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
      <Footer />

      {/* Floating Personal Chatbot — Bhava 2.0 */}
      <Chatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
}
