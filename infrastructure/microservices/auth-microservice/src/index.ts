console.clear();
// Domain enums
import { LoggingServiceEnum } from './Domain/enums/LoggingServiceEnum';
import { SeverityEnum } from './Domain/enums/SeverityEnum';

// Services
import { LogerService } from './Services/LogerServices/LogerService';

// Local
import app from './app';

const port = process.env.PORT || 5544;
const logger = new LogerService(LoggingServiceEnum.APP_SERVICE);

app.listen(port, () => {
  logger.log(SeverityEnum.INFO, 'Logging service initialized');
  logger.log(SeverityEnum.INFO, `Auth Microservice is running on port ${port}`);
});
