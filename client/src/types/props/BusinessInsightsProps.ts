import { BusinessLLMOutputDTO } from "../../models/analytics/BusinessInsightDto";

export type BusinessInsightsProps = {
  data: BusinessLLMOutputDTO | null;
  loading: boolean;
}