DROP TABLE IF EXISTS version_control_db.review_comments;
DROP TABLE IF EXISTS version_control_db.reviews;

CREATE TABLE IF NOT EXISTS version_control_db.reviews (
  reviewId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  taskId INT NOT NULL,
  authorId INT NOT NULL,
  time VARCHAR(100) NOT NULL,
  reviewedBy INT NULL,
  reviewedAt VARCHAR(100) NULL,
  status ENUM('DRAFT','REVIEW','APPROVED','REJECTED') NOT NULL,
  commentId INT NULL
);

CREATE TABLE IF NOT EXISTS version_control_db.review_comments (
  commentId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  reviewId INT NOT NULL,
  authorId INT NOT NULL,
  taskId INT NOT NULL,
  time VARCHAR(100) NOT NULL,
  commentText TEXT NOT NULL,
  CONSTRAINT fk_review_comments_review FOREIGN KEY (reviewId) REFERENCES version_control_db.reviews(reviewId) ON DELETE CASCADE
);