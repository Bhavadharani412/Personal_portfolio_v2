import { retrieveRelevantKnowledge } from "../../worker/knowledge";

export function testKnowledgeRetriever() {
  const empty = retrieveRelevantKnowledge("");
  if (empty !== null) throw new Error("Expected null for empty query");

  const devExp = retrieveRelevantKnowledge("How does Dev Explain AI work?");
  if (!devExp || !devExp.evidence.includes("Dev Explain AI")) throw new Error("Expected Dev Explain AI evidence");

  const colab = retrieveRelevantKnowledge("collaborative editor yjs crdt");
  if (!colab || !colab.evidence.includes("Yjs")) throw new Error("Expected Yjs evidence");

  const unrelated = retrieveRelevantKnowledge("what is the recipes for chocolate cake xyz987");
  if (unrelated !== null) throw new Error("Expected null for unrelated query");
}
