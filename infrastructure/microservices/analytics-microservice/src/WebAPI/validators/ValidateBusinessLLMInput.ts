import { BusinessLLMInputDto } from "../../Domain/DTOs/BusinessLLMInputDto";

function isIsoDate(s: string): boolean {
  const d = new Date(s);
  return typeof s === "string" && !Number.isNaN(d.getTime());
}

export function validateBusinessLLMInput(input: BusinessLLMInputDto): void {
  if (!input) throw new Error("Business LLM input is missing");

  if (!input.timeWindow)
    throw new Error("timeWindow is required");

  if (!isIsoDate(input.timeWindow.from) || !isIsoDate(input.timeWindow.to))
    throw new Error("timeWindow.from/to must be valid ISO dates");

  if (new Date(input.timeWindow.from) > new Date(input.timeWindow.to))
    throw new Error("timeWindow.from must be before timeWindow.to");

  const projectCount =
    (input.projects_performance?.length ?? 0) +
    (input.projects_financials?.length ?? 0);

  if (projectCount === 0)
    throw new Error("No project data provided for business insights");

  if (projectCount > 50)
    throw new Error("Too many projects for LLM analysis (max 50)");
}
