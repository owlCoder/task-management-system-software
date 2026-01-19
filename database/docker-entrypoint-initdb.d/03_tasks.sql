-- DROP TABLE IF EXISTS tasks_db.tasks;

-- CREATE TABLE Tasks (
--   task_id INT AUTO_INCREMENT PRIMARY KEY,
--   sprint_id INT NULL,

--   title VARCHAR(100) NOT NULL,
--   task_description VARCHAR(100) NOT NULL,

--   task_status ENUM(
--     'CREATED',
--     'PENDING',
--     'IN_PROGRESS',
--     'COMPLETED',
--     'CANCELLED'
--   ) NOT NULL DEFAULT 'CREATED',

--   attachment_file_uuid INT NULL,

--   estimated_cost INT NOT NULL DEFAULT 0,
--   total_hours_spent INT NOT NULL DEFAULT 0,

--   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   finished_at DATETIME NULL,

--   INDEX idx_tasks_sprint_id (sprint_id),
--   INDEX idx_tasks_status (task_status),
--   INDEX idx_tasks_finished_at (finished_at)
-- );