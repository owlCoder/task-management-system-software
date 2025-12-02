import { Router, Request, Response } from "express";
import { ILogerService } from "../../Domain/services/ILogerService";

export class UsersController {
  private readonly router: Router;

  constructor(private readonly logger: ILogerService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {}

  public getRouter(): Router {
    return this.router;
  }
}
