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

-- CREATE TABLE IF NOT EXISTS projects_db.project_users (
--     pu_id INT NOT NULL AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     weekly_hours INT NOT NULL,
--     project_id INT NOT NULL,
--     added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (pu_id),
--     KEY project_id_fk_idx (project_id),
--     CONSTRAINT project_id_fk FOREIGN KEY (project_id) REFERENCES projects(project_id)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE
-- );


-- CREATE TABLE IF NOT EXISTS projects_db.project_task (
--   pt_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   project_id INT NOT NULL,
--   task_id INT NOT NULL,
--   CONSTRAINT fk_pt_project FOREIGN KEY (project_id) REFERENCES projects_db.projects(project_id) ON DELETE CASCADE,
--   CONSTRAINT fk_pt_task FOREIGN KEY (task_id) REFERENCES tasks_db.tasks(task_id) ON DELETE CASCADE
-- );
