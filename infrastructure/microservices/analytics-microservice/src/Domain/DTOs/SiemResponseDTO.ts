export interface SiemResponseDTO {
  id: number;
  title: string;
  rationale: string;
  priority: string;        // HIGH | MEDIUM | LOW
  effort: string;          // LOW | MEDIUM | HIGH
  category: string;        // SECURITY | BUDGET | ...
  relatedMetrics: string[];
  suggestedActions: string[];
}
