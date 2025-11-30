import dotenv from "dotenv"
import express from 'express';
import { MailsController } from "./WebAPI/contollers/MailsController";
import { SendService } from "./Services/SendService";
import { AliveService } from "./Services/AliveService";

dotenv.config();
const app = express();

const aliveService = new AliveService();
const sendService = new SendService();
const mailsController = new MailsController(sendService,aliveService);

app.use("/api/v1/MailService/", mailsController.getRouther());

export default app;