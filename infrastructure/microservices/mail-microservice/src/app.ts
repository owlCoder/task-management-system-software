import express from 'express';
import { MailsController } from "./WebAPI/contollers/MailsController";
import { SendService } from "./Services/SendService";
import { AliveService } from "./Services/AliveService";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const aliveService = new AliveService();
const sendService = new SendService();
const mailsController = new MailsController(sendService,aliveService);

app.use("/api/v1/MailService", mailsController.getRouter());

export default app;