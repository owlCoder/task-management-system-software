DROP TABLE IF EXISTS users_db.users;
DROP TABLE IF EXISTS users_db.user_roles;

CREATE TABLE IF NOT EXISTS users_db.user_roles (
  role_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users_db.users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  user_role INT,
  email VARCHAR(100),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  weekly_working_hour_sum INT NULL,
  CONSTRAINT chk_weekly_hours CHECK (weekly_working_hour_sum < 40 OR weekly_working_hour_sum IS NULL),
  -- CONSTRAINT chk_email_format CHECK (
  --   email IS NULL OR email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  -- ),
  CONSTRAINT fk_user_role FOREIGN KEY (user_role) REFERENCES users_db.user_roles(role_id)
);