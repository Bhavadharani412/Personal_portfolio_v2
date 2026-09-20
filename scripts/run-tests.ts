import { testKnowledgeRetriever } from "../tests/unit/knowledge.test";
import { testAnalyticsValidation } from "../tests/unit/analytics.test";
import { testRateLimiter } from "../tests/unit/rateLimiter.test";
import { testWorkerAPI } from "../tests/api/worker.test";

async function runAllTests(): Promise<void> {
  console.log("🧪 Running Test Suite...");
  let passed = 0;
  let failed = 0;

  function runTestBlock(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ ${name}: ${err.message}`);
      failed++;
    }
  }

  async function runAsyncTestBlock(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n[1] Knowledge Retriever Unit Tests");
  runTestBlock("Structured retrieval and keyword matching", testKnowledgeRetriever);

  console.log("\n[2] Analytics Validation Unit Tests");
  runTestBlock("Event validation and payload size limits", testAnalyticsValidation);

  console.log("\n[3] Rate Limiter Unit Tests");
  runTestBlock("Sliding window rate limiter logic", testRateLimiter);

  console.log("\n[4] Cloudflare Worker API Tests");
  await runAsyncTestBlock("Health, events, chat & 429 rate limit endpoints", testWorkerAPI);

  console.log(`\n==========================================`);
  console.log(`Test Suite Summary: ${passed} Passed, ${failed} Failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
