DROP TABLE IF EXISTS generated_reports_db.generated_reports;

CREATE TABLE IF NOT EXISTS generated_reports_db.generated_reports (
  reportuuid VARCHAR(300) NOT NULL PRIMARY KEY,
  useruuid VARCHAR(300) NULL,
  title VARCHAR(100) NOT NULL,
  report_description VARCHAR(100), -- We should probably allow longer descriptions
);