
DROP TABLE IF EXISTS projects_db.project_task;
DROP TABLE IF EXISTS projects_db.project_user;
DROP TABLE IF EXISTS projects_db.projects;

CREATE TABLE IF NOT EXISTS projects_db.projects (
  projectuuid VARCHAR(300) NOT NULL PRIMARY KEY,
  image_file_uuid VARCHAR(300), -- file uuid
  project_name VARCHAR(100) NOT NULL,
  project_description VARCHAR(100), -- We should probably allow longer descriptions
  total_weekly_hours_required INT NULL,
  allowed_budget INT NULL,
  CONSTRAINT chk_total_weekly_nonneg CHECK (total_weekly_hours_required >= 0 OR total_weekly_hours_required IS NULL),
  CONSTRAINT chk_allowed_budget_nonneg CHECK (allowed_budget >= 0 OR allowed_budget IS NULL)
);

CREATE TABLE IF NOT EXISTS projects_db.project_user (
  pu_uuid VARCHAR(300) NOT NULL PRIMARY KEY,
  projectuuid VARCHAR(300) NOT NULL,
  userid VARCHAR(300) NOT NULL,
  CONSTRAINT fk_pu_project FOREIGN KEY (projectuuid) REFERENCES projects_db.projects(projectuuid) ON DELETE CASCADE,
);

CREATE TABLE IF NOT EXISTS projects_db.project_task (
  pt_uuid VARCHAR(300) NOT NULL PRIMARY KEY,
  projectuuid VARCHAR(300) NOT NULL,
  taskuuid VARCHAR(300) NOT NULL,
  CONSTRAINT fk_pt_project FOREIGN KEY (projectuuid) REFERENCES projects_db.projects(projectuuid) ON DELETE CASCADE,
);
