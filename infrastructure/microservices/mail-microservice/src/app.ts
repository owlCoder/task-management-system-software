import express from 'express';
import { MailsController } from "./WebAPI/controllers/MailsController";
import { SendService } from "./Services/SendService";
import { AliveService } from "./Services/AliveService";
import cors from "cors";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

const aliveService = new AliveService();
const sendService = new SendService();
const mailsController = new MailsController(sendService,aliveService);

app.use("/api/v1/MailService", mailsController.getRouter());

export default app;