DROP TABLE IF EXISTS service_status_db.measurements;
DROP TABLE IF EXISTS service_status_db.microservices;

CREATE TABLE IF NOT EXISTS service_status_db.microservices (
  ID_microservice INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  microservice_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS service_status_db.measurements (
  measurement_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ID_microservice INT NOT NULL,
  status ENUM('Operational','PartialOutage','Down') NOT NULL,
  response_time INT NOT NULL,
  measurement_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_measurements_microservice FOREIGN KEY (ID_microservice) REFERENCES service_status_db.microservices(ID_microservice)
);