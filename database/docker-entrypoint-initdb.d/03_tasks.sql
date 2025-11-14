DROP TABLE IF EXISTS tasks_db.tasks;

CREATE TABLE IF NOT EXISTS tasks_db.tasks (
  taskid VARCHAR(300) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  task_description VARCHAR(100), -- We should probably allow longer descriptions
  task_status VARCHAR(100) NOT NULL, /* e.g. created, waiting, in_progress, completed */
  attachment_file_uuid VARCHAR(300), /* file uuid */
  estimated_cost INT NULL,
  total_hours_spent INT DEFAULT 0,
  CONSTRAINT chk_estimated_cost_nonneg CHECK (estimated_cost >= 0 OR estimated_cost IS NULL),
  CONSTRAINT chk_hours_nonneg CHECK (total_hours_spent >= 0)
);