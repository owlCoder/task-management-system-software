import { Router, Request, Response } from "express";
import { ISendService } from "../../Domain/services/ISendService";
import { IAliveService } from "../../Domain/services/IAliveService";


export class MailsController {
  private readonly router: Router;

  constructor(
    private readonly SendService: ISendService,
    private readonly AliveService: IAliveService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/SendMessage", this.SendMessage.bind(this));
    this.router.get("/MailAlive", this.MailAlive.bind(this));
  }

  private async SendMessage(req: Request, res: Response): Promise<void> {
    try {
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

}