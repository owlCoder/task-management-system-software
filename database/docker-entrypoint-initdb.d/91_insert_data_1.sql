-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE notification_service.notifications;
-- TRUNCATE TABLE uploaded_files_db.uploaded_files;
-- TRUNCATE TABLE projects_db.sprints;
-- TRUNCATE TABLE projects_db.project_users;
-- TRUNCATE TABLE projects_db.projects;
-- TRUNCATE TABLE service_status_db.measurements;
-- TRUNCATE TABLE service_status_db.microservices;
-- TRUNCATE TABLE tasks_db.comments;
-- TRUNCATE TABLE tasks_db.task_versions;
-- TRUNCATE TABLE tasks_db.tasks;
-- TRUNCATE TABLE version_control_db.templatedependencies;
-- TRUNCATE TABLE version_control_db.tasktemplates;
-- TRUNCATE TABLE version_control_db.reviewcomments;
-- TRUNCATE TABLE version_control_db.reviews;
-- TRUNCATE TABLE users_db.users;
-- TRUNCATE TABLE users_db.user_roles;
-- SET FOREIGN_KEY_CHECKS = 1;

-- INSERT INTO users_db.user_roles (role_name, impact_level) VALUES
--   ('SysAdmin', 1),
--   ('Admin', 5),
--   ('Project Manager', 10),
--   ('Analytics & Development Manager', 10),
--   ('Audio & Music Stagist', 15),
--   ('Animation Worker', 15);

-- INSERT INTO users_db.users (username, password_hash, user_role_id, email, is_deleted, weekly_working_hour_sum, google_id, image_url, image_key) VALUES
--   ('sysadmin', '$2b$10$Wlk9YRIyYBspLLj8tLAVIOZYJJvg0KIZnAtjijALyPgSdM2/.Fjsq', 1, 'sysadmin@example.oib', 0, 0, NULL, NULL, NULL),
--   ('admin', '$2b$10$eQTYA/n05Xwl1F.cm9Ndb.QD6/NMmV4tldD9KhDMTtsCj3Ll9CC6G', 2, 'admin@example.oib', 0, 0, NULL, NULL, NULL),
--   ('manager', '$2b$10$C/.6CFCglMdzXcw5LHZ7v.gBYT0yHJwSGekMDBfu1qPC4TaOxDZsq', 3, 'manager@example.oib', 0, 0, NULL, NULL, NULL),
--   ('analytics', '$2b$10$kHxPuZYdGRQm.dbzv/G0DeKplULcBFurtz68ayk3PSoJupVTOqs4a', 4, 'analytics@example.oib', 0, 0, NULL, NULL, NULL),
--   ('amstagist', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'amstagist@example.oib', 0, 0, NULL, NULL, NULL),
--   ('aworker', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'aworker@example.oib', 0, 0, NULL, NULL, NULL);

-- SET @projmanId      = (SELECT user_id FROM users_db.users WHERE username = 'manager');
-- SET @analdevmanId   = (SELECT user_id FROM users_db.users WHERE username = 'analytics');
-- SET @audiomusicId   = (SELECT user_id FROM users_db.users WHERE username = 'amstagist');
-- SET @animworkerId   = (SELECT user_id FROM users_db.users WHERE username = 'aworker');

-- INSERT INTO projects_db.projects (project_name, project_description, image_key, image_url, total_weekly_hours_required, allowed_budget, start_date, status) VALUES
--   ('Project X', 'Project X description.', NULL, NULL, 120, 50000, '2026-01-30', 'Active'),
--   ('Project Y', 'Project Y description.', NULL, NULL, 80, 30000, '2026-02-01', 'Not Started'),
--   ('Project Z', 'Project Z description.', NULL, NULL, 90, 35000, '2026-02-01','Not Started');

-- SET @projectXId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project X');
-- SET @projectYId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project Y');
-- SET @projectZId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project Z');

-- INSERT INTO projects_db.project_users (project_id, user_id, weekly_hours, added_at) VALUES
--   (@projectXId, @projmanId, 0, NOW()),
--   (@projectXId, @audiomusicId, 15, NOW()),
--   (@projectXId, @animworkerId, 10, NOW()),
--   (@projectYId, @projmanId, 0, NOW()),
--   (@projectYId, @audiomusicId, 10, NOW()),
--   (@projectZId, @projmanId, 0, NOW()),
--   (@projectZId, @animworkerId, 15, NOW());

-- INSERT INTO projects_db.sprints (project_id, sprint_title, sprint_description, start_date, end_date, story_points) VALUES
--   (@projectXId, 'ProjectX Sprint 1', 'Description of the projectx sprint 1.', '2026-01-30', '2026-02-13', 27),
--   (@projectXId, 'ProjectX Sprint 2', 'Description of the projectx sprint 2.', '2026-02-14', '2026-02-28', 31),
--   (@projectYId, 'ProjectY Sprint 1', 'Description of the projecty sprint 1.', '2026-02-01', '2026-02-15', 17),
--   (@projectYId, 'ProjectY Sprint 2', 'Description of the projecty sprint 2.', '2026-02-16', '2026-03-02', 42),
--   (@projectZId, 'ProjectZ Sprint 1', 'Description of the projectz sprint 1.', '2026-02-01', '2026-02-15', 15),
--   (@projectZId, 'ProjectZ Sprint 2', 'Description of the projectz sprint 2.', '2026-02-16', '2026-03-02', 28);

-- SET @pxSprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectX Sprint 1');
-- SET @pxSprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectX Sprint 2');
-- SET @pySprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectY Sprint 1');
-- SET @pySprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectY Sprint 2');
-- SET @pzSprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectZ Sprint 1');
-- SET @pzSprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectZ Sprint 2');

-- INSERT INTO tasks_db.tasks (sprint_id, worker_id, project_manager_id, title, task_description, task_status, estimated_cost, total_hours_spent) VALUES
--   (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5),
--   (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task2', 'Pxs1 Task2 description.', 'IN_PROGRESS', 400, 10),
--   (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task3', 'Pxs1 Task3 description.', 'CREATED', 300, 0),
--   (@pxSprint1, @animworkerId, @projmanId, 'pxs1 Task4', 'Pxs1 Task4 description.', 'IN_PROGRESS', 400, 10),
--   (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5),
--   (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task2', 'Pxs1 Task2 description.', 'IN_PROGRESS', 400, 10),
--   (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task3', 'Pxs1 Task3 description.', 'CREATED', 300, 0),
--   (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task4', 'Pxs2 Task4 description.', 'IN_PROGRESS', 400, 10);

-- SET @pxs1t1 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pxs1 Task1' LIMIT 1);
-- SET @pxs1t2 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pxs1 Task2' LIMIT 1);

-- INSERT INTO tasks_db.comments (task_id, user_id, comment) VALUES
--   (@pxs1t1, @projmanId, 'Comment 1 on pxs1t1.'),
--   (@pxs1t1, @projmanId, 'Comment 2 on pxs1t1.'),
--   (@pxs1t2, @projmanId, 'Comment 1 on pxs1t2.'),
--   (@pxs1t2, @projmanId, 'Comment 2 on pxs1t2.'),
--   (@pxs1t2, @projmanId, 'Comment 3 on pxs1t2.');

-- INSERT INTO tasks_db.task_versions (task_id, version_number, title, task_description, task_status, estimated_cost, total_hours_spent, worker_id) VALUES
--   (@pxs1t1, 1, 'pxs1 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5, @audiomusicId),
--   (@pxs1t1, 2, 'pxs1 Task1 v2', 'Pxs1 Task1 description v2.', 'PENDING', 700, 5, @audiomusicId),
--   (@pxs1t1, 3, 'pxs1 Task1 v3', 'Pxs1 Task1 description v3.', 'PENDING', 700, 5, @audiomusicId);

-- INSERT INTO notification_service.notifications (title, content, type, isRead, userId) VALUES
--   ('Notif1', 'Notif1 content.', 'info', false, @projmanId),
--   ('Notif2', 'Notif2 content.', 'warning', true, @projmanId),
--   ('Notif3', 'Notif3 content.', 'error', false, @projmanId),
--   ('Notif1', 'Notif1 content.', 'warning', true, @audiomusicId),
--   ('Notif2', 'Notif2 content.', 'error', false, @audiomusicId);

-- INSERT INTO reviews_db.reviews (taskId, authorId, time, reviewedBy, reviewedAt, status, commentId) VALUES
--   (@pxs1t1, @projmanId, '2026-01-01 14:30', @projmanId, '2026-01-01 14:30', 'APPROVED', NULL),
--   (@pxs1t2, @projmanId, '2026-01-02 12:30', @projmanId, '2026-01-02 12:30', 'REVIEW', NULL),
--   (@pxs1t2, @projmanId, '2026-01-03 18:30', @projmanId, '2026-01-03 18:30', 'REVIEW', NULL);

-- SET @pxs1t1r1 = (SELECT reviewId FROM reviews_db.reviews WHERE taskId = @pxs1t1 LIMIT 1);

-- INSERT INTO reviews_db.reviewComments (reviewId, authorId, taskId, time, commentText) VALUES
--   (@pxs1t1r1, @projmanId, @pxs1t1, '2025-02-05 14:35', 'pxs1t1r1 comment.');

-- INSERT INTO reviews_db.TaskTemplates (template_title, template_description, estimated_cost, attachment_type) VALUES
--   ('Template Title 1', 'TT1 desc.', 1500, '/jpg'),
--   ('Template Title 2', 'TT2 desc.', 1800, '/png'),
--   ('Template Title 3', 'TT3 desc.', 1100, '/jpg'),
--   ('Template Title 4', 'TT4 desc.', 1200, '/png');

-- SET @t1 = (SELECT template_id FROM reviews_db.TaskTemplates WHERE template_title = 'Template Title 1' LIMIT 1);
-- SET @t2 = (SELECT template_id FROM reviews_db.TaskTemplates WHERE template_title = 'Template Title 2' LIMIT 1);
-- SET @t3 = (SELECT template_id FROM reviews_db.TaskTemplates WHERE template_title = 'Template Title 3' LIMIT 1);
-- SET @t4 = (SELECT template_id FROM reviews_db.TaskTemplates WHERE template_title = 'Template Title 4' LIMIT 1);

-- INSERT INTO reviews_db.TemplateDependencies (template_id, depends_on_template_id) VALUES
--   (@t1, @t2),
--   (@t4, @t3);

-- INSERT INTO service_status_db.Microservices (microservice_name) VALUES
--   ('AUTH_SERVICE'),
--   ('ANALYTICS_SERVICE'),
--   ('FILE_SERVICE'),
--   ('MAIL_SERVICE'),
--   ('NOTIFICATION_SERVICE'),
--   ('PROJECT_SERVICE'),
--   ('TASK_SERVICE'),
--   ('USER_SERVICE'),
--   ('VERSION_CONTROL_SERVICE');

-- SET @authId = (SELECT ID_microservice FROM service_status_db.Microservices WHERE microservice_name = 'AUTH_SERVICE' LIMIT 1);
-- SET @projectId = (SELECT ID_microservice FROM service_status_db.Microservices WHERE microservice_name = 'PROJECT_SERVICE' LIMIT 1);

-- INSERT INTO service_status_db.Measurements (ID_microservice, status, response_time) VALUES
--   (@authId, 'OPERATIONAL', 120),
--   (@authId, 'DOWN', 500),
--   (@authId, 'PARTIALOUTAGE', 380),
--   (@projectId, 'OPERATIONAL', 80),
--   (@projectId, 'DOWN', 430),
--   (@projectId, 'PARTIALOUTAGE', 310);