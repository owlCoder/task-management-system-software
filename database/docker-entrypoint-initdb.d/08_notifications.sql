DROP TABLE IF EXISTS notification_service.notifications;

CREATE TABLE IF NOT EXISTS notification_service.notifications (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('info','warning','error') NOT NULL DEFAULT 'info',
  isRead BOOLEAN NOT NULL DEFAULT FALSE,
  userId INT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);