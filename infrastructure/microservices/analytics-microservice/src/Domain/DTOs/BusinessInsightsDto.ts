
export interface BusinessInsightsDto {
    time_window_from : string;
    time_window_to : string;
    generated_at : string;
    summary : string;
    recommendations : string[];
    issues : string[];
}