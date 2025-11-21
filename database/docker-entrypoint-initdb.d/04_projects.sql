-- DROP TABLE IF EXISTS projects_db.project_task;
-- DROP TABLE IF EXISTS projects_db.project_user;
-- DROP TABLE IF EXISTS projects_db.projects;

-- CREATE TABLE IF NOT EXISTS projects_db.projects (
--   project_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   image_file_id INT, -- reference to uploaded_files_db.uploaded_files.id
--   project_name VARCHAR(100) NOT NULL,
--   project_description VARCHAR(100), -- We should probably allow longer descriptions
--   total_weekly_hours_required INT NULL,
--   allowed_budget INT NULL,
--   CONSTRAINT chk_total_weekly_nonneg CHECK (total_weekly_hours_required >= 0 OR total_weekly_hours_required IS NULL),
--   CONSTRAINT chk_allowed_budget_nonneg CHECK (allowed_budget >= 0 OR allowed_budget IS NULL)
-- );

-- CREATE TABLE IF NOT EXISTS projects_db.project_user (
--   pu_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   project_id INT NOT NULL,
--   user_id INT NOT NULL,
--   CONSTRAINT fk_pu_project FOREIGN KEY (project_id) REFERENCES projects_db.projects(project_id) ON DELETE CASCADE,
--   CONSTRAINT fk_pu_user FOREIGN KEY (user_id) REFERENCES users_db.users(user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS projects_db.project_task (
--   pt_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   project_id INT NOT NULL,
--   task_id INT NOT NULL,
--   CONSTRAINT fk_pt_project FOREIGN KEY (project_id) REFERENCES projects_db.projects(project_id) ON DELETE CASCADE,
--   CONSTRAINT fk_pt_task FOREIGN KEY (task_id) REFERENCES tasks_db.tasks(task_id) ON DELETE CASCADE
-- );
