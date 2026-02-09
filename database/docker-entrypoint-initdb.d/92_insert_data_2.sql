-- INSERT INTO users_db.user_roles (role_name, impact_level) VALUES
--   ('SysAdmin', 1),
--   ('Admin', 5),
--   ('Project Manager', 10),
--   ('Analytics & Development Manager', 10),
--   ('Audio & Music Stagist', 15),
--   ('Animation Worker', 15);

-- INSERT INTO users_db.users (username, password_hash, user_role_id, email, is_deleted, weekly_working_hour_sum, google_id, image_url, image_key) VALUES
--   ('sysadmin', '$2b$10$Wlk9YRIyYBspLLj8tLAVIOZYJJvg0KIZnAtjijALyPgSdM2/.Fjsq', 1, 'sa@sa.sa', 0, 0, NULL, NULL, NULL),
--   ('admin', '$2b$10$eQTYA/n05Xwl1F.cm9Ndb.QD6/NMmV4tldD9KhDMTtsCj3Ll9CC6G', 2, 'a@a.a', 0, 0, NULL, NULL, NULL),
--   ('projman', '$2b$10$C/.6CFCglMdzXcw5LHZ7v.gBYT0yHJwSGekMDBfu1qPC4TaOxDZsq', 3, 'pm@pm.pm', 0, 0, NULL, NULL, NULL),
--   ('analdevman', '$2b$10$kHxPuZYdGRQm.dbzv/G0DeKplULcBFurtz68ayk3PSoJupVTOqs4a', 4, 'anal@dev.man', 0, 0, NULL, NULL, NULL),
--   ('aumusicstrat', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio@music.strat', 0, 0, NULL, NULL, NULL),
--   ('aumusicstrat2', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio2@music.strat', 0, 0, NULL, NULL, NULL),
--   ('aumusicstrat3', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio3@music.strat', 0, 0, NULL, NULL, NULL),
--   ('aumusicstrat4', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio4@music.strat', 0, 0, NULL, NULL, NULL),
--   ('animeworker', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime@work.er', 0, 0, NULL, NULL, NULL),
--   ('animeworker2', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime2@work.er', 0, 0, NULL, NULL, NULL),
--   ('animeworker3', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime3@work.er', 0, 0, NULL, NULL, NULL),
--   ('animeworker4', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime4@work.er', 0, 0, NULL, NULL, NULL);

-- INSERT INTO service_status_db.microservices (microservice_name) VALUES
--   ('AUTH_SERVICE'),
--   ('ANALYTICS_SERVICE'),
--   ('FILE_SERVICE'),
--   ('MAIL_SERVICE'),
--   ('NOTIFICATION_SERVICE'),
--   ('PROJECT_SERVICE'),
--   ('TASK_SERVICE'),
--   ('USER_SERVICE'),
--   ('VERSION_CONTROL_SERVICE');

  
 

-- INSERT INTO task_templates (template_title, template_description, estimated_cost, attachment_type) VALUES
-- ('Visual Concept & Storyboarding', 'Creation of initial sketches, style guides, and visual narrative.', 550, '.pdf'),
-- ('Character & Environment Modeling', 'Developing low and high poly 3D assets based on concept art.', 1300, '.obj'),
-- ('Skeleton Rigging', 'Setting up the skeletal structure and controllers for animation.', 850, '.fbx'),
-- ('Motion & Character Animation', 'Creating movement cycles, facial expressions, and action sequences.', 1600, '.mp4'),
-- ('Sound Design & Foley', 'Recording and mixing environmental sounds and character effects.', 450, '.wav'),
-- ('Final Render & Composition', 'Integration of visual assets and audio into the final output.', 700, '.mp4');

-- INSERT INTO template_dependencies (template_id, depends_on_template_id) VALUES
-- (2, 1), 
-- (3, 2), 
-- (4, 3), 
-- (6, 4), 
-- (6, 5); 



