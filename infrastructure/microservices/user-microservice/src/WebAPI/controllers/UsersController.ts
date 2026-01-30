import { Router, Request, Response } from "express";
import multer from "multer";
import { ILogerService } from "../../Domain/services/ILogerService";
import { IUsersService } from "../../Domain/services/IUsersService";
import { IUserRoleService } from "../../Domain/services/IUserRoleService";
import { UserDataValidation } from "../validation/UserDataValidation";
import { parseIds } from "../../Helpers/parseIds";
import { UserDataUpdateValidation } from "../validation/UserDataUpdateValidation";
import { UsernameValidation } from "../validation/UsernameValidation";
import { IR2StorageService } from "../../Storage/R2StorageService";
import { UserUpdateDTO } from "../../Domain/DTOs/UserUpdateDTO";
import { ISIEMService } from "../../siem/Domen/services/ISIEMService";
import { generateEvent } from "../../siem/Domen/Helpers/generate/GenerateEvent";
import { UserCreationDTO } from "../../Domain/DTOs/UserCreationDTO";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export class UsersController {
  private readonly router: Router;

  constructor(
    private readonly usersService: IUsersService,
    private readonly userRoleService: IUserRoleService,
    private readonly logger: ILogerService,
    private readonly storageService: IR2StorageService,
    private readonly siemService: ISIEMService,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/users", this.getAllUsers.bind(this));
    this.router.get("/users/ids", this.getUsersByIds.bind(this));
    this.router.get(
      "/users/by-username/:username",
      this.getUserByUsername.bind(this),
    );
    this.router.get("/users/:id", this.getUserById.bind(this));
    this.router.post("/users", upload.single("image_file"), this.createUser.bind(this));
    this.router.delete("/users/:id", this.logicalyDeleteUser.bind(this));
    this.router.put(
      "/users/:id",
      upload.single("image_file"),
      this.updateUser.bind(this),
    );
    this.router.put("/users/:id/working-hours", this.setWeeklyHours.bind(this));
    this.router.get("/user-roles", this.getAllUserRoles.bind(this));
    this.router.get(
      "/user-roles/:impact_level",
      this.getUserRoleByImpactLevel.bind(this),
    );
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
      const result = await this.usersService.getAllUsers();

      if (result.success) {
        this.siemService.sendEvent(
          generateEvent(
            "user-microservice",
            req,
            200,
            "Request successful | All users fetched",
          ),
        );
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        this.siemService.sendEvent(
          generateEvent("user-microservice", req, result.code, result.error),
        );
        res.status(result.code).json(result.error);
      }
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
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number." });
        return;
      }

      this.logger.log(`Fetching user with ID ${id}`);
      const result = await this.usersService.getUserById(id);

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        res.status(result.code).json(result.error);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  /**
   * GET /api/v1/users/:username
   * @param {username} req.body - User username
   * @returns {UserDTO} JSON response with success status, session/token, and message
   * @see {@link UserDTO} for input structure
   */

  private async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username as string;

      const rezultat = UsernameValidation(username);

      if (rezultat.uspesno === false) {
        res.status(400).json({ message: rezultat.poruka });
        return;
      }

      this.logger.log(`Fetching user with USERNAME ${username}`);
      const result = await this.usersService.getUserByUsername(username);

      if (result.success) {
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        res.status(result.code).json(result.error);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  /**
   * GET /api/v1/users/ids?ids=1,2,3
   * @param {ids[]} req.body - Array of user ids that work on one project
   * @returns {UserDTO[]} JSON response with success status, session/token, and message
   * @see {@link UserDTO} for input structure
   */

  private async getUsersByIds(req: Request, res: Response): Promise<void> {
    try {
      const idArray: number[] = parseIds(req.query.ids?.toString());

      idArray.forEach((element: any) => {
        if (isNaN(element)) {
          res
            .status(400)
            .json({ message: "The passed id is not a number." + element });
          return;
        }
      });

      this.logger.log(`Fetching users with IDs ${idArray}`);
      const result = await this.usersService.getUsersByIds(idArray);
      if (result.success) {
        this.siemService.sendEvent(
          generateEvent("user-microservice", req, 200, "Request successful"),
        );
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);

        this.siemService.sendEvent(
          generateEvent("user-microservice", req, result.code, result.error),
        );

        res.status(result.code).json(result.error);
      }
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
      const userData: UserCreationDTO = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role_name: req.body.role_name,
      };

      if (req.file) {
        try {
          const uploadResult = await this.storageService.uploadImage(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
          );
          userData.image_key = uploadResult.key;
          userData.image_url = uploadResult.url;
        } catch (uploadError) {
          this.siemService.sendEvent(
            generateEvent(
              "user-microservice",
              req,
              500,
              "User creation failed | Failed to upload image",
            ),
          );
          this.logger.log(`Image upload failed: ${(uploadError as Error).message}`);
          res.status(500).json({ message: "Failed to upload image" });
          return;
        }
      }

      const rezultat = UserDataValidation(userData);

      if (rezultat.uspesno === false) {
        if (userData.image_key) {
          await this.storageService.deleteImage(userData.image_key);
        }
        res.status(400).json({ message: rezultat.poruka });
        return;
      }

      this.logger.log("Creating new user");
      const result = await this.usersService.createUser(userData);

      if (result.success) {
        this.siemService.sendEvent(
          generateEvent(
            "user-microservice",
            req,
            201,
            "Request successful | New user created",
          ),
        );

        res.status(201).json(result.data);
      } else {
        if (userData.image_key) {
          await this.storageService.deleteImage(userData.image_key);
        }
        
        this.logger.log(result.error);
        this.siemService.sendEvent(
          generateEvent("user-microservice", req, result.code, result.error),
        );
        res.status(result.code).json(result.error);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      this.siemService.sendEvent(
        generateEvent("user-microservice", req, 500, (err as Error).message),
      );
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
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number." });
        return;
      }

      this.logger.log(`Logically deleting user with ID ${id}`);
      const result = await this.usersService.logicalyDeleteUserById(id);

      if (result.success === false) {
        this.logger.log(result.error);

        this.siemService.sendEvent(
          generateEvent("user-microservice", req, result.code, result.error),
        );

        res.status(result.code).json(result.error);
      } else {
        this.siemService.sendEvent(
          generateEvent(
            "user-microservice",
            req,
            204,
            `Request successful | Logically deleting user with ID ${id}`,
          ),
        );
        res.status(204).send();
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      this.siemService.sendEvent(
        generateEvent("user-microservice", req, 500, (err as Error).message),
      );
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
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "The passed id is not a number" });
        return;
      }

      const updateData: UserUpdateDTO = {
        username: req.body.username,
        email: req.body.email,
        role_name: req.body.role_name,
        password: req.body.password || undefined,
      };

      // Handle image upload
      if (req.file) {
        try {
          const uploadResult = await this.storageService.uploadImage(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
          );
          updateData.image_key = uploadResult.key;
          updateData.image_url = uploadResult.url;
        } catch (uploadError) {
          this.siemService.sendEvent(
            generateEvent(
              "user-microservice",
              req,
              500,
              "User update faild | Failed to upload image",
            ),
          );
          this.logger.log(
            `Image upload failed: ${(uploadError as Error).message}`,
          );
          res.status(500).json({ message: "Failed to upload image" });
          return;
        }
      }

      const rezultat = UserDataUpdateValidation(updateData);

      if (rezultat.uspesno === false) {
        if (updateData.image_key) {
          await this.storageService.deleteImage(updateData.image_key);
        }

        this.siemService.sendEvent(
          generateEvent("user-microservice", req, 400, rezultat.poruka!),
        );

        res.status(400).json({ message: rezultat.poruka });
        return;
      }

      this.logger.log(`Updating user with ID ${id}`);
      const result = await this.usersService.updateUserById(id, updateData);

      if (result.success) {
        this.siemService.sendEvent(
          generateEvent(
            "user-microservice",
            req,
            200,
            "Request successful | User updated successfully",
          ),
        );
        res.status(200).json(result.data);
      } else {
        if (updateData.image_key) {
          await this.storageService.deleteImage(updateData.image_key);
        }
        this.logger.log(result.error);

        this.siemService.sendEvent(
          generateEvent("user-microservice", req, result.code, result.error),
        );

        res.status(result.code).json(result.error);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      this.siemService.sendEvent(
        generateEvent("user-microservice", req, 500, (err as Error).message),
      );
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
      const id = parseInt(req.params.id as string, 10);

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
      const result = await this.usersService.setWeeklyHours(
        id,
        weekly_working_hours,
      );
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        this.logger.log(result.error);
        res.status(result.code).json(result.error);
      }
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

      const result = await this.userRoleService.getAllUserRoles();
      if (result.success) {
        res.status(200).json(result.data);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  /**
   * GET /api/v1/user-roles/:impact_level
   * Get user roles with higher impact level then they has. Example: Admin has imp_lvl: 5, he will get all roles with more then 5 imp_lvl.
   * Impact levels: SysAdmin - 1, Admin - 5, Analytics & Development Manager - 10, Project Manager - 10, Animation Worker - 15, Audio & Music Stagist - 15
   * @returns {UserRoleDTO[]} JSON response with success status, session/token, and message
   * @see {@link ImpactLevels} for input strucutre
   * */

  private async getUserRoleByImpactLevel(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const impact_level = parseInt(req.params.impact_level as string, 10);
      if (isNaN(impact_level)) {
        res
          .status(400)
          .json({ message: "The passed impact_level is not a number" });
        return;
      }

      this.logger.log(
        `Fetching all user roles with impact level ${impact_level}`,
      );

      const result =
        await this.userRoleService.getUserRoleByImpactLevel(impact_level);
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res.status(result.code).json(result.error);
      }
    } catch (err) {
      this.logger.log((err as Error).message);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
