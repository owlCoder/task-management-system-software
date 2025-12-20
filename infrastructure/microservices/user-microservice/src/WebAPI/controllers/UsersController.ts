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
    this.router.get("/users/oneProject", this.getUsersByIds.bind(this));
    this.router.get("/users/:id", this.getUserById.bind(this));
    this.router.post("/users", this.createUser.bind(this));
    this.router.delete("/users/:id", this.logicalyDeleteUser.bind(this));
    this.router.put("/users/:id", this.updateUser.bind(this));
    this.router.put("/users/:id/working-hours", this.setWeeklyHours.bind(this));
    this.router.get("/user-roles", this.getAllUserRoles.bind(this));
  }

  /**
   * GET /api/v1/users
   * Get all users
   * @returns {UserDTO[]} JSON response with success status, session/token, and message
   * @see {@link UserDTO} for input structure
   */
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

  /**
   * GET /api/v1/users/:id
   * @param {id} req.body - User id
   * @returns {UserDTO} JSON response with success status, session/token, and message
   * @see {@link UserDTO} for input structure
   */

  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number." });
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

  /**
   * GET /api/v1/users/oneProject
   * @param {ids[]} req.body - Array of user ids that work on one project
   * @returns {UserDTO[]} JSON response with success status, session/token, and message
   * @see {@link UserDTO} for input structure
   */

  private async getUsersByIds(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      ids.forEach((element: any) => {
        if (isNaN(element)) {
          res
            .status(400)
            .json({ message: "The passed id is not a number." + element });
          return;
        }
      });

      this.logger.log(`Fetching users with IDs ${ids}`);
      const users = await this.usersService.getUsersByIds(ids);
      res.status(200).json(users);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  /**
   * POST /api/v1/users
   * @param {UserCreationDTO} req.body - Data for user creation
   * @returns {UserDTO} JSON response with success status, session/token, and message
   * @see {@link UserDTO  and UserCreationDTO} for input structure
   */

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

  /**
   * DELETE /api/v1/users/:id
   * @param {id} req.body - ID of user that you want to delete
   * @returns {message}
   * @see {@link UserDTO  and UserCreationDTO} for input structure
   */

  private async logicalyDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number." });
        return;
      }

      this.logger.log(`Logically deleting user with ID ${id}`);
      const result = await this.usersService.logicalyDeleteUserById(id);

      if (result === false) {
        res.status(500).json({ message: "Logical delete failed." });
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

  /**
   * PUT /api/v1/users/:id
   * @param {id and User} req.body - ID of user that you want to update, and User with new data
   * @returns {UserDTO} - JSON format return
   * @see {@link UserDTO  and UserCreationDTO} for input structure
   */

  private async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number" });
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

  /**
   * PUT /api/v1/users/:id/working-hours
   * @param {id and weekly_working_hours} req.body - ID of user that you want to update, and weekly_working_hours
   * @returns {UserDTO} - JSON format return
   * @see {@link UserDTO} for input structure
   */

  private async setWeeklyHours(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number" });
        return;
      }

      const { weekly_working_hours } = req.body;

      if (isNaN(weekly_working_hours)) {
        res
          .status(400)
          .json({ message: "The passed weekly_working_hours is not a number" });
        return;
      }

      this.logger.log("Update user's weekly_working_hours_sum");
      const updatedUser = await this.usersService.setWeeklyHours(
        id,
        weekly_working_hours
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  /**
   * GET /api/v1/user-roles
   * Get all roles
   * @returns {UserRoleDTO[]} JSON response with success status, session/token, and message
   * @see {@link UserRoleDTO} for input structure
   * */

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
