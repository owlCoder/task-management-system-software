export interface BudgetTrackingDto {
    project_id: number;
    allowed_budget: number;
    total_spent: number;
    remaining_budget: number;
    variance: number;
}