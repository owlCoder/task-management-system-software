import { BusinessLLMOutputDTO } from "../../Domain/DTOs/BusinessLLMOutputDto";

const PRIORITIES = ["high", "medium", "low"];
const CATEGORIES = ["budget", "staffing", "timeline", "security", "general"];

export function validateBusinessLLMOutput(output: BusinessLLMOutputDTO): void {
  if (!output || typeof output.summary !== "string")
    throw new Error("Invalid LLM output: summary missing");

  if (!Array.isArray(output.recommendations))
    throw new Error("Invalid LLM output: recommendations must be array");

  for (const r of output.recommendations) {
    if (!PRIORITIES.includes(r.priority))
      throw new Error(`Invalid recommendation priority: ${r.priority}`);

    if (!CATEGORIES.includes(r.category))
      throw new Error(`Invalid recommendation category: ${r.category}`);

    if (!r.title || !r.description)
      throw new Error("Recommendation title/description missing");
  }

  if (!Array.isArray(output.issues))
    throw new Error("Invalid LLM output: issues must be array");
}
