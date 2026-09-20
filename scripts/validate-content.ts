import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const REQUIRED_CORE_FILES = ["profile.md", "journey.md", "experience.md", "skills.md", "writing.md"];

function validateContent(): void {
  console.log("🔍 Validating Portfolio Markdown Content...");

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

  // 2. Check project markdown files
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

    const projectIds = new Set<string>();

    for (const pFile of projectFiles) {
      const pPath = path.join(projectsDir, pFile);
      const content = fs.readFileSync(pPath, "utf-8");
      const id = pFile.replace(".md", "");

      if (projectIds.has(id)) {
        console.error(`❌ Duplicate project identifier found: ${id}`);
        errors++;
      }
      projectIds.add(id);

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
    console.log(`✅ Validated ${projectFiles.length} project markdown documents.`);
  }

  if (errors > 0) {
    console.error(`\n💥 Content Validation Failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log("\n✨ All Content Validation Checks Passed Successfully!");
  }
}

validateContent();
