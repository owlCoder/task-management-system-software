SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notification_service.notifications;
TRUNCATE TABLE uploaded_files_db.uploaded_files;
TRUNCATE TABLE projects_db.sprints;
TRUNCATE TABLE projects_db.project_users;
TRUNCATE TABLE projects_db.projects;
TRUNCATE TABLE service_status_db.measurements;
TRUNCATE TABLE service_status_db.microservices;
TRUNCATE TABLE tasks_db.comments;
TRUNCATE TABLE tasks_db.task_versions;
TRUNCATE TABLE tasks_db.tasks;
TRUNCATE TABLE version_control_db.template_dependencies;
TRUNCATE TABLE version_control_db.task_templates;
TRUNCATE TABLE version_control_db.review_comments;
TRUNCATE TABLE version_control_db.reviews;
TRUNCATE TABLE users_db.users;
TRUNCATE TABLE users_db.user_roles;
SET FOREIGN_KEY_CHECKS = 1;

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
  ('aumusicstrat', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio@music.strat', 0, 0, NULL, NULL, NULL),
  ('aumusicstrat2', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio2@music.strat', 0, 0, NULL, NULL, NULL),
  ('aumusicstrat3', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio3@music.strat', 0, 0, NULL, NULL, NULL),
  ('aumusicstrat4', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio4@music.strat', 0, 0, NULL, NULL, NULL),
  ('animeworker', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime@work.er', 0, 0, NULL, NULL, NULL),
  ('animeworker2', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime2@work.er', 0, 0, NULL, NULL, NULL),
  ('animeworker3', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime3@work.er', 0, 0, NULL, NULL, NULL),
  ('animeworker4', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime4@work.er', 0, 0, NULL, NULL, NULL);

SET @projmanId      = (SELECT user_id FROM users_db.users WHERE username = 'projman');
SET @analdevmanId   = (SELECT user_id FROM users_db.users WHERE username = 'analdevman');
SET @audiomusicId   = (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat');
SET @animworkerId   = (SELECT user_id FROM users_db.users WHERE username = 'animeworker');

INSERT INTO projects_db.projects (project_name, project_description, image_key, image_url, total_weekly_hours_required, allowed_budget, start_date, status) VALUES
  ('Project X', 'Project X description.', NULL, NULL, 120, 50000, '2026-01-30', 'Completed'),
  ('Project Y', 'Project Y description.', NULL, NULL, 80, 30000, '2026-02-01', 'Not Started'),
  ('Project Z', 'Project Z description.', NULL, NULL, 90, 35000, '2026-02-01','Not Started'),
  ('Project A', 'Project A description.', NULL, NULL, 100, 40000, '2025-12-01', 'Completed');

SET @projectXId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project X');
SET @projectYId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project Y');
SET @projectZId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project Z');
SET @projectAId = (SELECT project_id FROM projects_db.projects WHERE project_name = 'Project A');

INSERT INTO projects_db.project_users (project_id, user_id, weekly_hours, added_at) VALUES
  (@projectXId, @projmanId, 0, NOW()),
  (@projectXId, @audiomusicId, 15, NOW()),
  (@projectXId, @animworkerId, 10, NOW()),
  (@projectYId, @projmanId, 0, NOW()),
  (@projectYId, @audiomusicId, 10, NOW()),
  (@projectZId, @projmanId, 0, NOW()),
  (@projectZId, @animworkerId, 15, NOW()),
  (@projectAId, @projmanId, 0, NOW()),
  (@projectAId, @audiomusicId, 20, NOW()),
  (@projectAId, @animworkerId, 15, NOW()),
  (@projectAId, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat2'), 10, NOW()),
  (@projectAId, (SELECT user_id FROM users_db.users WHERE username = 'animeworker2'), 12, NOW());

INSERT INTO projects_db.sprints (project_id, sprint_title, sprint_description, start_date, end_date, story_points) VALUES
  (@projectXId, 'ProjectX Sprint 1', 'Description of the projectx sprint 1.', '2026-01-30', '2026-02-13', 27),
  (@projectXId, 'ProjectX Sprint 2', 'Description of the projectx sprint 2.', '2026-02-14', '2026-02-28', 31),
  (@projectYId, 'ProjectY Sprint 1', 'Description of the projecty sprint 1.', '2026-02-01', '2026-02-15', 17),
  (@projectYId, 'ProjectY Sprint 2', 'Description of the projecty sprint 2.', '2026-02-16', '2026-03-02', 42),
  (@projectZId, 'ProjectZ Sprint 1', 'Description of the projectz sprint 1.', '2026-02-01', '2026-02-15', 15),
  (@projectZId, 'ProjectZ Sprint 2', 'Description of the projectz sprint 2.', '2026-02-16', '2026-03-02', 28),
  (@projectAId, 'ProjectA Sprint 1', 'Description of the projecta sprint 1.', '2025-12-01', '2025-12-15', 25),
  (@projectAId, 'ProjectA Sprint 2', 'Description of the projecta sprint 2.', '2025-12-16', '2025-12-31', 30);

SET @pxSprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectX Sprint 1');
SET @pxSprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectX Sprint 2');
SET @pySprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectY Sprint 1');
SET @pySprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectY Sprint 2');
SET @pzSprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectZ Sprint 1');
SET @pzSprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectZ Sprint 2');
SET @paSprint1 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectA Sprint 1');
SET @paSprint2 = (SELECT sprint_id FROM projects_db.sprints WHERE sprint_title = 'ProjectA Sprint 2');

INSERT INTO tasks_db.tasks (sprint_id, worker_id, project_manager_id, title, task_description, task_status, estimated_cost, total_hours_spent, finished_at) VALUES
  (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5, NULL),
  (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task2', 'Pxs1 Task2 description.', 'IN_PROGRESS', 400, 10, NULL),
  (@pxSprint1, @audiomusicId, @projmanId, 'pxs1 Task3', 'Pxs1 Task3 description.', 'CREATED', 300, 0, NULL),
  (@pxSprint1, @animworkerId, @projmanId, 'pxs1 Task4', 'Pxs1 Task4 description.', 'IN_PROGRESS', 400, 10, NULL),
  (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5, NULL),
  (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task2', 'Pxs1 Task2 description.', 'IN_PROGRESS', 400, 10, NULL),
  (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task3', 'Pxs1 Task3 description.', 'CREATED', 300, 0, NULL),
  (@pxSprint2, @animworkerId, @projmanId, 'pxs2 Task4', 'Pxs2 Task4 description.', 'IN_PROGRESS', 400, 10, NULL),
  (@paSprint1, @audiomusicId, @projmanId, 'pas1 Task1', 'Pas1 Task1 description.', 'COMPLETED', 500, 12, '2025-12-10 10:00:00'),
  (@paSprint1, @audiomusicId, @projmanId, 'pas1 Task2', 'Pas1 Task2 description.', 'COMPLETED', 600, 15, '2025-12-12 14:00:00'),
  (@paSprint1, @animworkerId, @projmanId, 'pas1 Task3', 'Pas1 Task3 description.', 'COMPLETED', 450, 10, '2025-12-11 12:00:00'),
  (@paSprint1, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat2'), @projmanId, 'pas1 Task4', 'Pas1 Task4 description.', 'COMPLETED', 550, 14, '2025-12-13 16:00:00'),
  (@paSprint2, @animworkerId, @projmanId, 'pas2 Task1', 'Pas2 Task1 description.', 'COMPLETED', 700, 18, '2025-12-25 16:00:00'),
  (@paSprint2, (SELECT user_id FROM users_db.users WHERE username = 'animeworker2'), @projmanId, 'pas2 Task2', 'Pas2 Task2 description.', 'COMPLETED', 650, 16, '2025-12-26 18:00:00'),
  (@paSprint2, @audiomusicId, @projmanId, 'pas2 Task3', 'Pas2 Task3 description.', 'COMPLETED', 500, 12, '2025-12-27 10:00:00'),
  (@paSprint2, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat2'), @projmanId, 'pas2 Task4', 'Pas2 Task4 description.', 'COMPLETED', 600, 15, '2025-12-28 12:00:00');

SET @pxs1t1 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pxs1 Task1' LIMIT 1);
SET @pxs1t2 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pxs1 Task2' LIMIT 1);
SET @pas1t1 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pas1 Task1' LIMIT 1);
SET @pas1t2 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pas1 Task2' LIMIT 1);
SET @pas2t1 = (SELECT task_id FROM tasks_db.tasks WHERE title = 'pas2 Task1' LIMIT 1);

INSERT INTO tasks_db.comments (task_id, user_id, comment) VALUES
  (@pxs1t1, @projmanId, 'Comment 1 on pxs1t1.'),
  (@pxs1t1, @projmanId, 'Comment 2 on pxs1t1.'),
  (@pxs1t2, @projmanId, 'Comment 1 on pxs1t2.'),
  (@pxs1t2, @projmanId, 'Comment 2 on pxs1t2.'),
  (@pxs1t2, @projmanId, 'Comment 3 on pxs1t2.'),
  (@pas1t1, @projmanId, 'Comment 1 on pas1t1.'),
  (@pas1t1, @audiomusicId, 'Comment 2 on pas1t1.'),
  (@pas1t2, @projmanId, 'Comment 1 on pas1t2.'),
  (@pas2t1, @animworkerId, 'Comment 1 on pas2t1.');

INSERT INTO tasks_db.task_versions (task_id, version_number, title, task_description, task_status, estimated_cost, total_hours_spent, worker_id) VALUES
  (@pxs1t1, 1, 'pxs1 Task1', 'Pxs1 Task1 description.', 'PENDING', 700, 5, @audiomusicId),
  (@pxs1t1, 2, 'pxs1 Task1 v2', 'Pxs1 Task1 description v2.', 'PENDING', 700, 5, @audiomusicId),
  (@pxs1t1, 3, 'pxs1 Task1 v3', 'Pxs1 Task1 description v3.', 'PENDING', 700, 5, @audiomusicId),
  (@pas1t1, 1, 'pas1 Task1', 'Pas1 Task1 description.', 'CREATED', 500, 0, @audiomusicId),
  (@pas1t1, 2, 'pas1 Task1 v2', 'Pas1 Task1 description v2.', 'IN_PROGRESS', 500, 6, @audiomusicId),
  (@pas1t1, 3, 'pas1 Task1 v3', 'Pas1 Task1 description v3.', 'COMPLETED', 500, 12, @audiomusicId),
  (@pas1t2, 1, 'pas1 Task2', 'Pas1 Task2 description.', 'CREATED', 600, 0, @audiomusicId),
  (@pas1t2, 2, 'pas1 Task2 v2', 'Pas1 Task2 description v2.', 'IN_PROGRESS', 600, 8, @audiomusicId),
  (@pas1t2, 3, 'pas1 Task2 v3', 'Pas1 Task2 description v3.', 'COMPLETED', 600, 15, @audiomusicId),
  (@pas2t1, 1, 'pas2 Task1', 'Pas2 Task1 description.', 'CREATED', 700, 0, @animworkerId),
  (@pas2t1, 2, 'pas2 Task1 v2', 'Pas2 Task1 description v2.', 'IN_PROGRESS', 700, 10, @animworkerId),
  (@pas2t1, 3, 'pas2 Task1 v3', 'Pas2 Task1 description v3.', 'COMPLETED', 700, 18, @animworkerId);

INSERT INTO notification_service.notifications (title, content, type, isRead, userId) VALUES
  ('Notif1', 'Notif1 content.', 'info', false, @projmanId),
  ('Notif2', 'Notif2 content.', 'warning', true, @projmanId),
  ('Notif3', 'Notif3 content.', 'error', false, @projmanId),
  ('Notif1', 'Notif1 content.', 'warning', true, @audiomusicId),
  ('Notif2', 'Notif2 content.', 'error', false, @audiomusicId),
  ('Task Completed', 'pas1 Task1 has been completed.', 'info', false, @projmanId),
  ('Task Completed', 'pas1 Task2 has been completed.', 'info', true, @projmanId),
  ('Task Completed', 'pas2 Task1 has been completed.', 'info', false, @audiomusicId),
  ('Project Completed', 'Project A has been completed.', 'info', false, @projmanId),
  ('System Update', 'System maintenance scheduled.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'sysadmin')),
  ('Security Alert', 'Password change recommended.', 'warning', true, (SELECT user_id FROM users_db.users WHERE username = 'sysadmin')),
  ('Admin Task', 'Review user permissions.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'admin')),
  ('Admin Alert', 'New user registration.', 'warning', false, (SELECT user_id FROM users_db.users WHERE username = 'admin')),
  ('Project Update', 'New project assigned.', 'info', true, (SELECT user_id FROM users_db.users WHERE username = 'analdevman')),
  ('Analytics Report', 'Monthly report ready.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'analdevman')),
  ('Task Assigned', 'New audio task.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat')),
  ('Audio Review', 'Task review pending.', 'warning', true, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat')),
  ('Task Completed', 'Audio task done.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat2')),
  ('Collaboration', 'Team meeting scheduled.', 'info', true, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat2')),
  ('Deadline', 'Task due soon.', 'warning', false, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat3')),
  ('Feedback', 'Task feedback received.', 'info', true, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat3')),
  ('Update', 'Project milestone reached.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat4')),
  ('Alert', 'Resource allocation.', 'warning', true, (SELECT user_id FROM users_db.users WHERE username = 'aumusicstrat4')),
  ('Animation Task', 'New animation assigned.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'animeworker')),
  ('Progress', 'Task in progress.', 'info', true, (SELECT user_id FROM users_db.users WHERE username = 'animeworker')),
  ('Review Needed', 'Animation review.', 'warning', false, (SELECT user_id FROM users_db.users WHERE username = 'animeworker2')),
  ('Completion', 'Task completed.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'animeworker2')),
  ('Assignment', 'New task.', 'info', true, (SELECT user_id FROM users_db.users WHERE username = 'animeworker3')),
  ('Notification', 'Team update.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'animeworker3')),
  ('Alert', 'Deadline approaching.', 'warning', true, (SELECT user_id FROM users_db.users WHERE username = 'animeworker4')),
  ('Success', 'Task approved.', 'info', false, (SELECT user_id FROM users_db.users WHERE username = 'animeworker4'));

INSERT INTO version_control_db.reviews (taskId, authorId, time, reviewedBy, reviewedAt, status, commentId) VALUES
  (@pxs1t1, @projmanId, '2026-01-01 14:30', @projmanId, '2026-01-01 14:30', 'APPROVED', NULL),
  (@pxs1t2, @projmanId, '2026-01-02 12:30', @projmanId, '2026-01-02 12:30', 'REVIEW', NULL),
  (@pxs1t2, @projmanId, '2026-01-03 18:30', @projmanId, '2026-01-03 18:30', 'REVIEW', NULL),
  (@pas1t1, @projmanId, '2025-12-10 10:00', @projmanId, '2025-12-10 10:00', 'APPROVED', NULL),
  (@pas1t2, @projmanId, '2025-12-12 14:00', @projmanId, '2025-12-12 14:00', 'APPROVED', NULL),
  (@pas2t1, @projmanId, '2025-12-25 16:00', @projmanId, '2025-12-25 16:00', 'APPROVED', NULL);

SET @pxs1t1r1 = (SELECT reviewId FROM version_control_db.reviews WHERE taskId = @pxs1t1 LIMIT 1);
SET @pas1t1r1 = (SELECT reviewId FROM version_control_db.reviews WHERE taskId = @pas1t1 LIMIT 1);
SET @pas1t2r1 = (SELECT reviewId FROM version_control_db.reviews WHERE taskId = @pas1t2 LIMIT 1);
SET @pas2t1r1 = (SELECT reviewId FROM version_control_db.reviews WHERE taskId = @pas2t1 LIMIT 1);

INSERT INTO version_control_db.review_comments (reviewId, authorId, taskId, time, commentText) VALUES
  (@pxs1t1r1, @projmanId, @pxs1t1, '2025-02-05 14:35', 'pxs1t1r1 comment.'),
  (@pas1t1r1, @projmanId, @pas1t1, '2025-12-10 10:05', 'pas1t1r1 comment.'),
  (@pas1t2r1, @projmanId, @pas1t2, '2025-12-12 14:05', 'pas1t2r1 comment.'),
  (@pas2t1r1, @projmanId, @pas2t1, '2025-12-25 16:05', 'pas2t1r1 comment.');

INSERT INTO version_control_db.task_templates (template_title, template_description, estimated_cost, attachment_type) VALUES
  ('Template Title 1', 'TT1 desc.', 1500, '/jpg'),
  ('Template Title 2', 'TT2 desc.', 1800, '/png'),
  ('Template Title 3', 'TT3 desc.', 1100, '/jpg'),
  ('Template Title 4', 'TT4 desc.', 1200, '/png');

SET @t1 = (SELECT template_id FROM version_control_db.task_templates WHERE template_title = 'Template Title 1' LIMIT 1);
SET @t2 = (SELECT template_id FROM version_control_db.task_templates WHERE template_title = 'Template Title 2' LIMIT 1);
SET @t3 = (SELECT template_id FROM version_control_db.task_templates WHERE template_title = 'Template Title 3' LIMIT 1);
SET @t4 = (SELECT template_id FROM version_control_db.task_templates WHERE template_title = 'Template Title 4' LIMIT 1);

INSERT INTO version_control_db.template_dependencies (template_id, depends_on_template_id) VALUES
  (@t1, @t2),
  (@t4, @t3);

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

SET @authId = (SELECT ID_microservice FROM service_status_db.microservices WHERE microservice_name = 'AUTH_SERVICE' LIMIT 1);
SET @projectId = (SELECT ID_microservice FROM service_status_db.microservices WHERE microservice_name = 'PROJECT_SERVICE' LIMIT 1);
