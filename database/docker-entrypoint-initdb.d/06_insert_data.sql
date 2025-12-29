INSERT INTO users_db.user_roles (role_name, impact_level) VALUES
  ('SysAdmin', 15),
  ('Admin', 10),
  ('Project Manager', 5),
  ('Analytics & Development Manager', 5),
  ('Audio & Music Stagist', 1),
  ('Animation Worker', 1);

INSERT INTO users_db.users (username, password_hash, user_role_id, email, is_deleted, weekly_working_hour_sum) 
  VALUES 
    ('sysadmin', '$2b$10$Wlk9YRIyYBspLLj8tLAVIOZYJJvg0KIZnAtjijALyPgSdM2/.Fjsq', 1, 'sa@sa.sa', 0, 0),
    ('admin', '$2b$10$eQTYA/n05Xwl1F.cm9Ndb.QD6/NMmV4tldD9KhDMTtsCj3Ll9CC6G', 2, 'a@a.a', 0, 0),
    ('projman', '$2b$10$C/.6CFCglMdzXcw5LHZ7v.gBYT0yHJwSGekMDBfu1qPC4TaOxDZsq', 3, 'pm@pm.pm', 0, 0),
    ('analdevman', '$2b$10$kHxPuZYdGRQm.dbzv/G0DeKplULcBFurtz68ayk3PSoJupVTOqs4a', 4, 'anal@dev.man', 0, 0),
    ('audiomusicstrat', '$2b$10$gPCdq..V00zJUzs.N.cxPu3UnpyEKmwGZX2b8Ewas32eei0z4hC/.', 5, 'audio@music.strat', 0, 0),
    ('animeworker', '$2b$10$q7ZdCC8AVEaHxmaYNdMZge1Q/LCspAAi23ep5S3ayNV23r5thyaJW', 6, 'anime@work.er', 0, 0);