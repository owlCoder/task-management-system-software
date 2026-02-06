DROP TABLE IF EXISTS version_control_db.template_dependencies;
DROP TABLE IF EXISTS version_control_db.task_templates;

CREATE TABLE IF NOT EXISTS version_control_db.task_templates (
  template_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  template_title VARCHAR(100) NOT NULL,
  template_description VARCHAR(100) NOT NULL,
  estimated_cost INT NULL DEFAULT 0,
  attachment_type VARCHAR(100) NULL
);

CREATE TABLE IF NOT EXISTS version_control_db.template_dependencies (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  template_id INT NOT NULL,
  depends_on_template_id INT NOT NULL,
  CONSTRAINT fk_template_dependencies_template FOREIGN KEY (template_id) REFERENCES version_control_db.task_templates(template_id) ON DELETE CASCADE,
  CONSTRAINT fk_template_dependencies_depends_on FOREIGN KEY (depends_on_template_id) REFERENCES version_control_db.task_templates(template_id) ON DELETE CASCADE
);