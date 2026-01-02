export interface ProjectUpdateDTO {
    project_name?: string;
    project_description?: string;
    image_key?: string;             // Ključ slike u R2 (interno)
    image_url?: string;             // Javni URL slike
    total_weekly_hours_required?: number;
    allowed_budget?: number;
}