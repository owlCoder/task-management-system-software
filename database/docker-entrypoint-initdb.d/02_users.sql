DROP TABLE IF EXISTS users_db.users;
DROP TABLE IF EXISTS users_db.user_roles;
DROP TABLE IF EXISTS users_db.user_roles;

CREATE TABLE IF NOT EXISTS users_db.user_roles (
  user_role_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  impact_level INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_db.users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  user_role_id INT NOT NULL,
  email VARCHAR(100) UNIQUE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  weekly_working_hour_sum INT DEFAULT 0,
  image_url VARCHAR(255) DEFAULT NULL,
  CONSTRAINT chk_weekly_hours CHECK (weekly_working_hour_sum < 40 OR weekly_working_hour_sum IS NULL),
  CONSTRAINT fk_user_role FOREIGN KEY (user_role_id) REFERENCES users_db.user_roles(user_role_id)
);
