DROP TABLE IF EXISTS uploaded_files_db.uploaded_files;

CREATE TABLE IF NOT EXISTS uploaded_files_db.uploaded_files (
  file_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  original_file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_extension VARCHAR(50) NOT NULL,
  author_id INT NOT NULL,
  path_to_file VARCHAR(500) NOT NULL
);

