import express from 'express';
import { MailsController } from "./WebAPI/controllers/MailsController";
import { SendService } from "./Services/SendService";
import { AliveService } from "./Services/AliveService";
import { corsPolicy } from './Middlewares/cors/corsPolicy';
import { LoggerService } from './Services/LoggerService';
import { logger } from './infrastructure/Logger';
import { SIEMService } from './SIEM/Services/SIEMService';
import { LogerService } from './SIEM/Services/LogerService';

const app = express();

app.use(corsPolicy);

app.use(express.json());

const aliveService = new AliveService();
const sendService = new SendService();
const loggerService = new LoggerService(logger);

//SIEM
const siemLogger = new LogerService();
const SIEMservice = new SIEMService(siemLogger);

const mailsController = new MailsController(sendService,aliveService,loggerService,SIEMservice);

app.use("/api/v1/MailService", mailsController.getRouter());

export default app;