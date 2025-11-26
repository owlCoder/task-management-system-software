import { Router, Request, Response } from "express";
import { ILogerService } from "../../Domain/services/ILogerService";
import { IUsersService } from "../../Domain/services/IUsersService";

export class UsersController {
  private readonly router: Router;

  constructor(
    private readonly usersService: IUsersService,
    private readonly logger: ILogerService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/users", this.getAllUsers.bind(this));
    this.router.get("/users/:id", this.getUserById.bind(this));
    this.router.post("/users", this.createUser.bind(this));
    this.router.delete("/users/:id", this.logicalyDeleteUser.bind(this));
    this.router.put("/users/:id", this.updateUser.bind(this));
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      this.logger.log("Fetching all users");
      const users = await this.usersService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      this.logger.log(`Fetching user with ID ${id}`);
      const user = await this.usersService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(404).json({ message: (err as Error).message });
    }
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      this.logger.log("Creating new user");
      const newUser = await this.usersService.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(404).json({ message: (err as Error).message });
    }
  }

  private async logicalyDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const existingUser = await this.usersService.getUserById(id);

      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      this.logger.log(`Logically deleting user with ID ${id}`);
      const result = await this.usersService.logicalyDeleteUserById(id);

      if (result === false) {
        throw new Error(`User with ID ${id} could not be logically deleted`);
      } else {
        res
          .status(200)
          .json({ message: `User with ID ${id} logically deleted` });
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(404).json({ message: (err as Error).message });
    }
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const userData = req.body;

      const existingUser = await this.usersService.getUserById(id);

      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      this.logger.log(`Updating user with ID ${id}`);
      const updatedUser = await this.usersService.updateUserById(id, userData);
      res.status(200).json(updatedUser);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(404).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
