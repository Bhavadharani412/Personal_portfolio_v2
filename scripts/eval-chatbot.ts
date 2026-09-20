import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { retrieveRelevantKnowledge } from "../worker/knowledge";
import { callGroqLLM } from "../worker/groq";

interface TestCase {
  id: string;
  category: string;
  question: string;
  expected_information: string[];
  source: string;
  must_not_contain: string[];
}

async function runEvaluation(): Promise<void> {
  console.log("🤖 Running Chatbot Knowledge Evaluation Suite...");

  const questionsPath = path.join(process.cwd(), "chatbot", "evaluation", "questions.json");
  if (!fs.existsSync(questionsPath)) {
    console.error(`❌ Missing evaluation dataset: ${questionsPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(questionsPath, "utf-8");
  const testCases: TestCase[] = JSON.parse(rawData);

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    console.log(`\nTesting [${tc.id} - ${tc.category}]: "${tc.question}"`);

    const retrievalResult = retrieveRelevantKnowledge(tc.question);
    const evidence = retrievalResult?.evidence || null;

    const res = await callGroqLLM(process.env.GROQ_API_KEY, tc.question, evidence);
    const responseText = res.reply;

    let testFailed = false;

    // Check must_not_contain
    for (const forbidden of tc.must_not_contain) {
      if (responseText.toLowerCase().includes(forbidden.toLowerCase())) {
        console.error(`  ❌ Failed: Response contained forbidden string "${forbidden}"`);
        testFailed = true;
      }
    }

    // Check expected_information if supported category
    if (tc.category !== "unsupported" && tc.category !== "adversarial" && evidence) {
      let matchedCount = 0;
      for (const expected of tc.expected_information) {
        if (responseText.toLowerCase().includes(expected.toLowerCase())) {
          matchedCount++;
        }
      }

      if (matchedCount === 0) {
        console.error(`  ❌ Failed: None of expected information strings were present in response.`);
        testFailed = true;
      }
    }

    if (!testFailed) {
      console.log(`  ✅ Passed!`);
      console.log(`  Response: "${responseText.substring(0, 120)}..."`);
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\n==========================================`);
  console.log(`Evaluation Summary: ${passed} Passed, ${failed} Failed out of ${testCases.length} total.`);

  if (failed > 0) {
    process.exit(1);
  }
}

runEvaluation().catch((err) => {
  console.error("Evaluation error:", err);
  process.exit(1);
});
