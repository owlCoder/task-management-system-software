import express from 'express';
import { MailsController } from "./WebAPI/controllers/MailsController";
import { SendService } from "./Services/SendService";
import { AliveService } from "./Services/AliveService";
import { corsPolicy } from './Middlewares/cors/corsPolicy';
import { LoggerService } from './Services/LoggerService';
import { logger } from './infrastructure/Logger';

const app = express();

app.use(corsPolicy);

app.use(express.json());

const aliveService = new AliveService();
const sendService = new SendService();
const loggerService = new LoggerService(logger);
const mailsController = new MailsController(sendService,aliveService,loggerService);

app.use("/api/v1/MailService", mailsController.getRouter());

export default app;