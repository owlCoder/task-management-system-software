INSERT INTO users_db.user_roles (role_name, impact_level) VALUES
  ('SysAdmin', 1),
  ('Admin', 5),
  ('Project Manager', 10),
  ('Analytics & Development Manager', 10),
  ('Audio & Music Stagist', 15),
  ('Animation Worker', 15);

INSERT INTO users_db.users (username, password_hash, user_role_id, email, is_deleted, weekly_working_hour_sum, google_id, image_url, image_key) VALUES
  ('sysadmin', '$2b$10$Wlk9YRIyYBspLLj8tLAVIOZYJJvg0KIZnAtjijALyPgSdM2/.Fjsq', 1, 'sa@sa.sa', 0, 0, NULL, NULL, NULL),
  ('admin', '$2b$10$eQTYA/n05Xwl1F.cm9Ndb.QD6/NMmV4tldD9KhDMTtsCj3Ll9CC6G', 2, 'a@a.a', 0, 0, NULL, NULL, NULL),
  ('projman', '$2b$10$C/.6CFCglMdzXcw5LHZ7v.gBYT0yHJwSGekMDBfu1qPC4TaOxDZsq', 3, 'pm@pm.pm', 0, 0, NULL, NULL, NULL),
  ('analdevman', '$2b$10$kHxPuZYdGRQm.dbzv/G0DeKplULcBFurtz68ayk3PSoJupVTOqs4a', 4, 'anal@dev.man', 0, 0, NULL, NULL, NULL),
  ('audiomusicstrat', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio@music.strat', 0, 0, NULL, NULL, NULL),
  ('animeworker', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime@work.er', 0, 0, NULL, NULL, NULL);

INSERT INTO service_status_db.microservices (microservice_name) VALUES
  ('AUTH_SERVICE'),
  ('ANALYTICS_SERVICE'),
  ('FILE_SERVICE'),
  ('MAIL_SERVICE'),
  ('NOTIFICATION_SERVICE'),
  ('PROJECT_SERVICE'),
  ('TASK_SERVICE'),
  ('USER_SERVICE'),
  ('VERSION_CONTROL_SERVICE');

INSERT INTO projects_db.projects (project_name, project_description, total_weekly_hours_required, allowed_budget, start_date, status) VALUES
  ('Sample Project 1', 'A sample project for demonstration.', 40, 10000, '2026-01-01', 'Active'),
  ('Sample Project 2', 'Another sample project.', 30, 5000, '2026-02-01', 'Not Started');

INSERT INTO projects_db.project_users (project_id, user_id, weekly_hours, added_at) VALUES
  (1, 3, 20, NOW()),
  (1, 5, 10, NOW()),
  (1, 6, 10, NOW()),
  (2, 4, 15, NOW());

INSERT INTO projects_db.sprints (project_id, sprint_title, sprint_description, start_date, end_date, story_points) VALUES
  (1, 'Sprint 1', 'First sprint for sample project.', '2026-01-01', '2026-01-15', 20),
  (1, 'Sprint 2', 'Second sprint.', '2026-01-16', '2026-01-31', 15);

INSERT INTO tasks_db.tasks (sprint_id, worker_id, project_manager_id, title, task_description, task_status, estimated_cost, total_hours_spent) VALUES
  (1, 5, 3, 'Task 1', 'Description for task 1.', 'IN_PROGRESS', 100, 5),
  (1, 6, 3, 'Task 2', 'Description for task 2.', 'COMPLETED', 200, 10),
  (2, 5, 3, 'Task 3', 'Description for task 3.', 'CREATED', 150, 0);

INSERT INTO tasks_db.comments (user_id, comment, task_id) VALUES
  (3, 'This is a comment on task 1.', 1),
  (5, 'Another comment.', 1);

INSERT INTO tasks_db.task_versions (task_id, version_number, title, task_description, task_status, estimated_cost, total_hours_spent, worker_id) VALUES
  (1, 1, 'Task 1 v1', 'Initial version.', 'CREATED', 100, 0, 5),
  (2, 1, 'Task 2 v1', 'Initial version.', 'COMPLETED', 200, 10, 6);

INSERT INTO uploaded_files_db.uploaded_files (original_file_name, file_type, file_extension, author_id, path_to_file) VALUES
  ('sample.pdf', 'application/pdf', 'pdf', 3, '/uploads/sample.pdf'),
  ('image.png', 'image/png', 'png', 5, '/uploads/image.png');

INSERT INTO notification_service.notifications (title, content, type, userId) VALUES
  ('Welcome', 'Welcome to the system!', 'info', 3),
  ('Task Assigned', 'You have been assigned a new task.', 'warning', 5);

INSERT INTO version_control_db.task_templates (template_title, template_description, estimated_cost) VALUES
  ('Template 1', 'A basic task template.', 50),
  ('Template 2', 'Another template.', 75);

INSERT INTO version_control_db.template_dependencies (template_id, depends_on_template_id) VALUES
  (2, 1);

INSERT INTO version_control_db.reviews (taskId, authorId, time, status) VALUES
  (1, 3, '2026-02-06 10:00:00', 'APPROVED'),
  (2, 4, '2026-02-06 11:00:00', 'REVIEW');

INSERT INTO version_control_db.review_comments (reviewId, authorId, taskId, time, commentText) VALUES
  (1, 3, 1, '2026-02-06 10:30:00', 'Looks good.'),
  (2, 4, 2, '2026-02-06 11:30:00', 'Needs revision.');

INSERT INTO service_status_db.measurements (ID_microservice, status, response_time) VALUES
  (1, 'Operational', 150),
  (2, 'Operational', 200),
  (3, 'PartialOutage', 300),
  (4, 'Operational', 120),
  (5, 'Operational', 180),
  (6, 'Operational', 160),
  (7, 'Operational', 140),
  (8, 'Operational', 170),
  (9, 'Operational', 190);

INSERT INTO users_db.users (username, password_hash, user_role_id, email, is_deleted, weekly_working_hour_sum, google_id, image_url, image_key) VALUES
  ('user7', '$2b$10$examplehash7', 5, 'user7@example.com', 0, 15, NULL, NULL, NULL),
  ('user8', '$2b$10$examplehash8', 6, 'user8@example.com', 0, 20, NULL, NULL, NULL),
  ('user9', '$2b$10$examplehash9', 3, 'user9@example.com', 0, 10, NULL, NULL, NULL);

INSERT INTO projects_db.projects (project_name, project_description, total_weekly_hours_required, allowed_budget, start_date, status) VALUES
  ('Project Alpha', 'An advanced project.', 50, 15000, '2026-03-01', 'Active'),
  ('Project Beta', 'Beta testing project.', 25, 8000, '2026-04-01', 'Paused');

INSERT INTO projects_db.sprints (project_id, sprint_title, sprint_description, start_date, end_date, story_points) VALUES
  (3, 'Alpha Sprint 1', 'First sprint for Alpha.', '2026-03-01', '2026-03-15', 25),
  (4, 'Beta Sprint 1', 'Sprint for Beta.', '2026-04-01', '2026-04-15', 15);

INSERT INTO tasks_db.tasks (sprint_id, worker_id, project_manager_id, title, task_description, task_status, estimated_cost, total_hours_spent, finished_at) VALUES
  (3, 7, 3, 'Alpha Task 1', 'Task in Alpha project.', 'IN_PROGRESS', 300, 8, NULL),
  (3, 8, 3, 'Alpha Task 2', 'Another task in Alpha.', 'COMPLETED', 250, 12, '2026-02-10 14:00:00'),
  (4, 9, 9, 'Beta Task 1', 'Task in Beta.', 'CREATED', 100, 0, NULL);

INSERT INTO tasks_db.comments (user_id, comment, task_id) VALUES
  (7, 'Starting work on Alpha Task 1.', 4),
  (8, 'Completed Alpha Task 2.', 5),
  (9, 'Planning Beta Task 1.', 6);

INSERT INTO tasks_db.task_versions (task_id, version_number, title, task_description, task_status, estimated_cost, total_hours_spent, worker_id, due_date) VALUES
  (4, 1, 'Alpha Task 1 v1', 'Initial.', 'IN_PROGRESS', 300, 8, 7, '2026-03-10 00:00:00'),
  (5, 1, 'Alpha Task 2 v1', 'Initial.', 'COMPLETED', 250, 12, 8, '2026-03-12 00:00:00'),
  (6, 1, 'Beta Task 1 v1', 'Initial.', 'CREATED', 100, 0, 9, '2026-04-10 00:00:00');

INSERT INTO uploaded_files_db.uploaded_files (original_file_name, file_type, file_extension, author_id, path_to_file) VALUES
  ('document.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx', 7, '/uploads/document.docx'),
  ('video.mp4', 'video/mp4', 'mp4', 8, '/uploads/video.mp4');

UPDATE tasks_db.tasks SET attachment_file_uuid = 3 WHERE task_id = 4;
UPDATE tasks_db.tasks SET attachment_file_uuid = 4 WHERE task_id = 5;

INSERT INTO notification_service.notifications (title, content, type, userId) VALUES
  ('Project Update', 'Project Alpha is progressing.', 'info', 7),
  ('Task Completed', 'Alpha Task 2 is done.', 'warning', 8),
  ('New Assignment', 'Assigned to Beta Task 1.', 'error', 9);

INSERT INTO version_control_db.task_templates (template_title, template_description, estimated_cost, attachment_type) VALUES
  ('Template 3', 'Advanced template.', 100, 'document'),
  ('Template 4', 'Simple template.', 30, NULL);

INSERT INTO version_control_db.template_dependencies (template_id, depends_on_template_id) VALUES
  (3, 1),
  (4, 2);

INSERT INTO version_control_db.reviews (taskId, authorId, time, reviewedBy, reviewedAt, status, commentId) VALUES
  (4, 3, '2026-02-07 09:00:00', 7, '2026-02-07 10:00:00', 'APPROVED', NULL),
  (5, 9, '2026-02-08 11:00:00', NULL, NULL, 'REVIEW', NULL);

INSERT INTO version_control_db.review_comments (reviewId, authorId, taskId, time, commentText) VALUES
  (3, 7, 4, '2026-02-07 09:30:00', 'Good work.'),
  (4, 9, 5, '2026-02-08 11:30:00', 'Please check details.');