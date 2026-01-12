import { Router, Request, Response } from "express";
import { ISendService } from "../../Domain/services/ISendService";
import { IAliveService } from "../../Domain/services/IAliveService";
import { Mail } from "../../Domain/models/Mail";
import { MailValidator } from "../validators/MailValidator";
import { ILoggerService } from "../../Domain/services/ILoggerService";


export class MailsController {
  private router: Router;

  constructor(
    private readonly SendService: ISendService,
    private readonly AliveService: IAliveService,
    private readonly LoggerService: ILoggerService
  ) {
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
        res.status(400).json({ message :"Problem with mail parameters (sender, header od body!)"});
        this.LoggerService.warn("PARAMS_MISSING","Problem with mail parameters (sender, header od body!)");
      }
        
      res.status(200).json();
      
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async MailAlive(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.AliveService.Alive();
      if(result===true)
      res.status(200).json();
      else
      res.status(501).json({message: "cannot connect to server!"});
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
      this.LoggerService.warn("SERVER_CONNECTION","Problem with connecting mail provider");
    }
  }
  
  public getRouter() { return this.router; }
}