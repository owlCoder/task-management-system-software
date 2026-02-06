DROP TABLE IF EXISTS tasks_db.task_versions;
DROP TABLE IF EXISTS tasks_db.comments;
DROP TABLE IF EXISTS tasks_db.tasks;

CREATE TABLE IF NOT EXISTS tasks_db.tasks (
  task_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  sprint_id INT NOT NULL,
  worker_id INT NULL,
  project_manager_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  task_description VARCHAR(100) NOT NULL,
  task_status ENUM('CREATED','PENDING','IN_PROGRESS','COMPLETED','NOT_COMPLETED','CANCELLED') NOT NULL DEFAULT 'CREATED',
  attachment_file_uuid INT NULL,
  estimated_cost INT NULL DEFAULT 0,
  total_hours_spent INT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  INDEX idx_tasks_sprint_id (sprint_id),
  INDEX idx_tasks_status (task_status),
  INDEX idx_tasks_finished_at (finished_at)
);

CREATE TABLE IF NOT EXISTS tasks_db.comments (
  comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  task_id INT NOT NULL,
  CONSTRAINT fk_comments_task FOREIGN KEY (task_id) REFERENCES tasks_db.tasks(task_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks_db.task_versions (
  version_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  version_number INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  task_description VARCHAR(100) NOT NULL,
  task_status ENUM('CREATED','PENDING','IN_PROGRESS','COMPLETED','NOT_COMPLETED','CANCELLED') NOT NULL,
  attachment_file_uuid INT NULL,
  estimated_cost INT NULL,
  total_hours_spent INT NULL,
  worker_id INT NULL,
  due_date DATETIME NULL,
  CONSTRAINT fk_task_versions_task FOREIGN KEY (task_id) REFERENCES tasks_db.tasks(task_id) ON DELETE CASCADE
);