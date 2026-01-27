import { Router, Request, Response } from "express";
import { ISendService } from "../../Domain/services/ISendService";
import { IAliveService } from "../../Domain/services/IAliveService";
import { Mail } from "../../Domain/models/Mail";
import { MailValidator } from "../validators/MailValidator";
import { ILoggerService } from "../../Domain/services/ILoggerService";
import { ISIEMService } from "../../SIEM/Domen/services/ISIEMService";
import { generateEvent } from "../../SIEM/Domen/Helpers/generate/GenerateEvent";


export class MailsController {
  private router: Router;

  constructor(private readonly SendService: ISendService,private readonly AliveService: IAliveService,private readonly LoggerService: ILoggerService, private readonly siemService:ISIEMService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/SendMessage", this.SendMessage.bind(this));
    this.router.post("/MailAlive", this.MailAlive.bind(this));
  }

  private async SendMessage(req: Request, res: Response): Promise<void> {
    try {
      const mailData = req.body as Mail;
      
      const result = MailValidator.validate(mailData);
      if(result===true)
        await this.SendService.SendMessage(mailData);
      else
      {
        this.siemService.sendEvent(generateEvent("mail-microservice", req, 400, "Problem with mail parameters (sender, header od body!)",),);

        this.LoggerService.warn("PARAMS_MISSING","Problem with mail parameters (sender, header od body!)");

        res.status(400).json({ message :"Problem with mail parameters (sender, header od body!)"});
      }
      
      this.siemService.sendEvent(generateEvent("mail-microservice", req, 200, "Mail sent successfully!",),);
      
      res.status(200).json();
      
    } catch (err) {
      this.LoggerService.warn("MESSAGE NOT SENT","Problem with sending mail, most probably limit hit");

      this.siemService.sendEvent(generateEvent("mail-microservice", req, 500, "Service error while trying to send message, most probably limit hit" + ((err as Error).stack ?? (err as Error).message),),);

      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async MailAlive(req: Request, res: Response): Promise<void> {
    try {
      this.siemService.sendEvent(generateEvent("mail-microservice", req, 200, "Mail service status sent successfully!",),);

      res.status(200).json();
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });

      this.siemService.sendEvent(generateEvent("mail-microservice", req, 500, "Service error, problem with connecting to mail provider" + ((err as Error).stack ?? (err as Error).message),),);

      this.LoggerService.warn("SERVER_CONNECTION","Problem with connecting mail provider");
    }
  }
  
  public getRouter() { return this.router; }
}