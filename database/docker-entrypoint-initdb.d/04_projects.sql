DROP TABLE IF EXISTS projects_db.sprints;
DROP TABLE IF EXISTS projects_db.project_users;
DROP TABLE IF EXISTS projects_db.projects;

CREATE TABLE IF NOT EXISTS projects_db.projects (
  project_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(100) NOT NULL UNIQUE,
  project_description LONGTEXT NOT NULL,
  image_key VARCHAR(255) NULL,
  image_url VARCHAR(500) NULL,
  total_weekly_hours_required INT NOT NULL,
  allowed_budget INT NOT NULL,
  start_date DATE NULL,
  status ENUM('Active','Paused','Completed','Not Started') DEFAULT 'Not Started',
  CONSTRAINT chk_total_weekly_nonneg CHECK (total_weekly_hours_required >= 0),
  CONSTRAINT chk_allowed_budget_nonneg CHECK (allowed_budget >= 0)
);

CREATE TABLE IF NOT EXISTS projects_db.project_users (
  pu_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  weekly_hours INT NOT NULL,
  added_at DATETIME NOT NULL,
  CONSTRAINT fk_project_users_project FOREIGN KEY (project_id) REFERENCES projects_db.projects(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_db.sprints (
  sprint_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  sprint_title VARCHAR(100) NOT NULL,
  sprint_description VARCHAR(500) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  story_points INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_sprints_project FOREIGN KEY (project_id) REFERENCES projects_db.projects(project_id) ON DELETE CASCADE
);
