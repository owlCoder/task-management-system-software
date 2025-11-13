DROP TABLE IF EXISTS users.users;

-- Table: users (in users)
CREATE TABLE IF NOT EXISTS users.users (
  useruuid VARCHAR(300) NOT NULL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  user_role VARCHAR(100) NOT NULL, -- e.g. sysadmin, admin, user
  email VARCHAR(100),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  weekly_working_hour_sum INT NULL,
  -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_weekly_hours CHECK (weekly_working_hour_sum < 40 OR weekly_working_hour_sum IS NULL)
);

