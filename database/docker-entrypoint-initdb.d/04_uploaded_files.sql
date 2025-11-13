DROP TABLE IF EXISTS uploaded_files.uploaded_files;

-- Table: uploaded_files (in uploaded_files)
CREATE TABLE IF NOT EXISTS uploaded_files.uploaded_files (
  file_uuid VARCHAR(300) NOT NULL PRIMARY KEY,
  original_file_name VARCHAR(100) NOT NULL,
  file_type VARCHAR(100),
  file_extension VARCHAR(100),
  authorid VARCHAR(300), -- FK to users.users.useruuid
  path_to_file VARCHAR(100)
  -- uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

