import fs from "fs";
import path from "path";
import { PROJECTS_DATA } from "../src/data/portfolioData";
import { PORTFOLIO_KNOWLEDGE } from "../worker/knowledge";

const CONTENT_DIR = path.join(process.cwd(), "content");
const REQUIRED_CORE_FILES = ["profile.md", "journey.md", "experience.md", "skills.md", "writing.md"];

function validateContent(): void {
  console.log("🔍 Validating Portfolio Markdown Content & Source-of-Truth Sync...");

  let errors = 0;

  // 1. Check core markdown files
  for (const file of REQUIRED_CORE_FILES) {
    const filePath = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing core content file: content/${file}`);
      errors++;
    } else {
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        console.error(`❌ Empty content file: content/${file}`);
        errors++;
      }
    }
  }

  // 2. Check project markdown files and cross-verify against portfolioData.ts & knowledge.ts
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) {
    console.error("❌ Missing directory: content/projects/");
    errors++;
  } else {
    const projectFiles = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));
    if (projectFiles.length === 0) {
      console.error("❌ No project markdown files found in content/projects/");
      errors++;
    }

    const markdownIds = new Set<string>();

    for (const pFile of projectFiles) {
      const pPath = path.join(projectsDir, pFile);
      const content = fs.readFileSync(pPath, "utf-8");
      const id = pFile.replace(".md", "");

      if (markdownIds.has(id)) {
        console.error(`❌ Duplicate project identifier found: ${id}`);
        errors++;
      }
      markdownIds.add(id);

      // Check required sections in project markdown
      if (!content.startsWith("# ")) {
        console.error(`❌ Project ${pFile} must start with an H1 heading (# Title)`);
        errors++;
      }

      if (content.length < 100) {
        console.error(`❌ Project ${pFile} content is suspiciously short (< 100 chars)`);
        errors++;
      }
    }

    // 3. Verify sync between content/projects/*.md, src/data/portfolioData.ts, and worker/knowledge.ts
    const uiProjectIds = new Set(PROJECTS_DATA.map((p) => p.id));
    const knowledgeProjectIds = new Set(
      PORTFOLIO_KNOWLEDGE.filter((k) => k.category === "project").map((k) =>
        k.sourceFile.replace("content/projects/", "").replace(".md", "")
      )
    );

    for (const id of markdownIds) {
      if (!uiProjectIds.has(id)) {
        console.error(`❌ Source-of-truth drift: Project "${id}" in content/projects/ is missing from src/data/portfolioData.ts`);
        errors++;
      }
      if (!knowledgeProjectIds.has(id)) {
        console.error(`❌ Source-of-truth drift: Project "${id}" in content/projects/ is missing from worker/knowledge.ts`);
        errors++;
      }
    }

    for (const id of uiProjectIds) {
      if (!markdownIds.has(id)) {
        console.error(`❌ Source-of-truth drift: Project "${id}" in src/data/portfolioData.ts has no content/projects/${id}.md`);
        errors++;
      }
    }

    for (const id of knowledgeProjectIds) {
      if (!markdownIds.has(id)) {
        console.error(`❌ Source-of-truth drift: Project "${id}" in worker/knowledge.ts has no content/projects/${id}.md`);
        errors++;
      }
    }

    console.log(`✅ Validated ${projectFiles.length} project markdown documents and verified zero ID drift across UI & Worker RAG.`);
  }

  if (errors > 0) {
    console.error(`\n💥 Content Validation Failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log("\n✨ All Content Validation Checks Passed Successfully!");
  }
}

validateContent();
