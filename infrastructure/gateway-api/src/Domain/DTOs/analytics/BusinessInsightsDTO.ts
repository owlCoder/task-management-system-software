export interface BusinessLLMOutputDTO {
  summary: string;
  recommendations: any[]; 
  issues: any[];
  key_metrics?: any;
}