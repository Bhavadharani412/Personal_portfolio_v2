export interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  technologies: string[];
  links: {
    github?: string;
    live?: string;
    blog?: string;
  };
  metricsHighlight?: string;
  architecturePreview: {
    badge: string;
    modules: { name: string; type: string; status: string }[];
    executionFlow: string[];
    sampleSnippet?: string;
  };
}

export interface JourneyMilestone {
  date: string;
  rawDate: string;
  title: string;
  organization?: string;
  description: string;
  tag: "LEARNING" | "BUILDING" | "COMMUNITY" | "INDUSTRY" | "OPEN SOURCE" | "LEADERSHIP" | "STRUCTURED THINKING" | "NOW";
  isCurrent?: boolean;
  keyTakeaway: string;
}

export interface BlogPost {
  id: string;
  title: string;
  topic: string;
  readTime: string;
  date: string;
  description: string;
  content: string[];
  slug: string;
  url?: string; // External URL for articles published on Hashnode etc.
}

export interface OpenSourceWork {
  name: string;
  role: string;
  status: "active" | "ongoing" | "future";
  description: string;
  highlights: string[];
  repoUrl?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    context: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
