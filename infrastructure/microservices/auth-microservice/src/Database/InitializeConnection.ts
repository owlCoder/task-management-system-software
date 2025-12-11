import { Db } from "./DbConnectionPool";
import { LogerService } from "../Services/LogerService";
import { LoggingServiceEnum } from "../Domain/enums/LoggingServiceEnum";
import { SeverityEnum } from "../Domain/enums/SeverityEnum";

let initialization_attempts = 0;
let timeout = 5000;
const logger = new LogerService(LoggingServiceEnum.APP_SERVICE);

export async function initialize_database() {
  try {
    initialization_attempts++;
    await Db.initialize();
    logger.log(SeverityEnum.INFO, "Database connected");

  } catch (err) {
    logger.log(SeverityEnum.ERROR, `Error during DataSource initialization ${err}`);
    if (initialization_attempts >= 5 && timeout < 30000) {
      timeout = 30000;
    }
    
    if (initialization_attempts < 15) {
      setTimeout(() => {
      logger.log(SeverityEnum.WARN, "Retrying database connection...");
      initialize_database();
      }, timeout);
    } 
  }
}