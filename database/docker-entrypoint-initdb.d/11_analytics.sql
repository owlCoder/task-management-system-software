-- Analytics Database Schema

USE analytics_db;

-- Table for SIEM events
CREATE TABLE IF NOT EXISTS siem_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    method VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    status_code INT NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table for storing burndown chart data (if needed for caching or history)
CREATE TABLE IF NOT EXISTS burndown_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    date DATE NOT NULL,
    planned_remaining_hours DECIMAL(10,2) NOT NULL,
    actual_remaining_hours DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for burnup data
CREATE TABLE IF NOT EXISTS burnup_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    date DATE NOT NULL,
    planned_completed DECIMAL(10,2) NOT NULL,
    actual_completed DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for velocity analytics
CREATE TABLE IF NOT EXISTS velocity_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_id INT,
    velocity DECIMAL(10,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for budget tracking
CREATE TABLE IF NOT EXISTS budget_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    date DATE NOT NULL,
    budgeted_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) NOT NULL,
    remaining_budget DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for resource cost allocation
CREATE TABLE IF NOT EXISTS resource_cost_allocation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    allocation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for profit margin
CREATE TABLE IF NOT EXISTS profit_margin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    margin_percentage DECIMAL(5,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for time series data (e.g., projects or workers over time)
CREATE TABLE IF NOT EXISTS time_series_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_type VARCHAR(100) NOT NULL, -- e.g., 'projects', 'workers'
    date DATE NOT NULL,
    count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for business insights (LLM generated)
CREATE TABLE IF NOT EXISTS business_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summary TEXT,
    recommendations JSON,
    issues JSON,
    key_metrics JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);