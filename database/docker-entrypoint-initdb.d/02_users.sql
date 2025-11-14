DROP TABLE IF EXISTS users_db.users;

-- Table: users (in users_db)
CREATE TABLE IF NOT EXISTS users_db.users (
  useruuid VARCHAR(300) NOT NULL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  user_role VARCHAR(100) NOT NULL, 
  -- SysAdmin, Admin, Analytics & Development Manager, Animation Worker, 
  -- Audio & Music Stagist, Project Manager
  email VARCHAR(100),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  weekly_working_hour_sum INT NULL,
  -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Add this check later, when enums have been defined
  -- CONSTRAINT chk_user_role CHECK (
  -- user_role IN (
  --   'SysAdmin',
  --   'Admin',
  --   'Analytics & Development Manager',
  --   'Animation Worker',
  --   'Audio & Music Stagist',
  --   'Project Manager'
  -- )
  -- ),
  CONSTRAINT chk_weekly_hours CHECK (weekly_working_hour_sum < 40 OR weekly_working_hour_sum IS NULL)
);

