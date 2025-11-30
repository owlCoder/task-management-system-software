import { Router, Request, Response } from "express";
import { ISendService } from "../../Domain/services/ISendService";
import { IAliveService } from "../../Domain/services/IAliveService";
import { Mail } from "../../Domain/models/Mail";


export class MailsController {
  private router: Router;

  constructor(
    private readonly SendService: ISendService,
    private readonly AliveService: IAliveService,
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
      
      //Validaciju dodati naknadno

      await this.SendService.SendMessage(mailData)
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async MailAlive(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }
  
  public getRouter() { return this.router; }
}