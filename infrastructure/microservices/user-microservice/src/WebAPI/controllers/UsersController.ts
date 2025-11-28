import { Router, Request, Response } from "express";
import { ILogerService } from "../../Domain/services/ILogerService";
import { IUsersService } from "../../Domain/services/IUsersService";
import { IUserRoleService } from "../../Domain/services/IUserRoleService";
import {
  UserDataUpdateValidation,
  UserDataValidation,
} from "../validation/UserDataValidation";

export class UsersController {
  private readonly router: Router;

  constructor(
    private readonly usersService: IUsersService,
    private readonly userRoleService: IUserRoleService,
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
    this.router.get("/user-roles", this.getAllUserRoles.bind(this));
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

      if (isNaN(id)) {
        res.status(400).json({ message: "Prosledjeni id nije broj" });
        return;
      }

      this.logger.log(`Fetching user with ID ${id}`);
      const user = await this.usersService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      
      const rezultat = UserDataValidation(userData);

      if (rezultat.uspesno === false) {
        res.status(400).json({ message: rezultat.poruka });
        return;
      }

      this.logger.log("Creating new user");
      const newUser = await this.usersService.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async logicalyDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "Prosledjeni id nije broj" });
        return;
      }

      this.logger.log(`Logically deleting user with ID ${id}`);
      const result = await this.usersService.logicalyDeleteUserById(id);

      if (result === false) {
        res.status(500).json({ message: "Logicko brisanje nije uspelo" });
      } else {
        res
          .status(200)
          .json({ message: `User with ID ${id} logically deleted` });
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "Prosledjeni id nije broj" });
        return;
      }

      const userData = req.body;

      const rezultat = UserDataUpdateValidation(userData);

      if (rezultat.uspesno === false) {
        res.status(400).json({ message: rezultat.poruka });
        return;
      }

      this.logger.log(`Updating user with ID ${id}`);
      const updatedUser = await this.usersService.updateUserById(id, userData);
      res.status(200).json(updatedUser);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getAllUserRoles(req: Request, res: Response): Promise<void> {
    try {
      this.logger.log("Fetching all user roles");

      const roles = await this.userRoleService.getAllUserRoles();
      res.status(200).json(roles);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
