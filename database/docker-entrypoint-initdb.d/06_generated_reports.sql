-- Generated Reports Database Schema

USE generated_reports_db;

-- Table for generated reports
CREATE TABLE IF NOT EXISTS generated_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- e.g., 'burndown', 'burnup', 'budget', 'velocity'
    project_id INT,
    sprint_id INT,
    user_id INT NOT NULL, -- who generated the report
    file_key VARCHAR(255), -- key for the file in storage
    file_url TEXT,
    parameters JSON, -- JSON object with report parameters
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS report_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL,
    template_data JSON, -- JSON with template configuration
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);