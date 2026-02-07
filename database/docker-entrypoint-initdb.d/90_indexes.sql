CREATE INDEX idx_users_email ON users_db.users (email);
CREATE INDEX idx_users_google_id ON users_db.users (google_id);

CREATE INDEX idx_comments_task_id ON tasks_db.comments (task_id);
CREATE INDEX idx_comments_user_id ON tasks_db.comments (user_id);

CREATE INDEX idx_task_versions_task_id ON tasks_db.task_versions (task_id);

CREATE INDEX idx_project_users_project_id ON projects_db.project_users (project_id);
CREATE INDEX idx_project_users_user_id ON projects_db.project_users (user_id);

CREATE INDEX idx_sprints_project_id ON projects_db.sprints (project_id);

CREATE INDEX idx_uploaded_files_author_id ON uploaded_files_db.uploaded_files (author_id);

CREATE INDEX idx_notifications_userId ON notification_service.notifications (userId);
CREATE INDEX idx_notifications_createdAt ON notification_service.notifications (createdAt);

CREATE INDEX idx_reviews_taskId ON version_control_db.reviews (taskId);
CREATE INDEX idx_reviews_authorId ON version_control_db.reviews (authorId);

CREATE INDEX idx_review_comments_reviewId ON version_control_db.review_comments (reviewId);
CREATE INDEX idx_review_comments_taskId ON version_control_db.review_comments (taskId);

CREATE INDEX idx_template_dependencies_template_id ON version_control_db.template_dependencies (template_id);
CREATE INDEX idx_template_dependencies_depends_on ON version_control_db.template_dependencies (depends_on_template_id);

CREATE INDEX idx_measurements_ID_microservice ON service_status_db.measurements (ID_microservice);
CREATE INDEX idx_measurements_measurement_date ON service_status_db.measurements (measurement_date);