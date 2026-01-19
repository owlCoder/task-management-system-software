import { In, Not, Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { User } from "../Domain/models/User";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { UserCreationDTO } from "../Domain/DTOs/UserCreationDTO";
import bcrypt from "bcryptjs";
import { UserRole } from "../Domain/models/UserRole";
import { UserUpdateDTO } from "../Domain/DTOs/UserUpdateDTO";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { toUserDTO } from "../Helpers/Converter/toUserDTO";
import { IR2StorageService } from "../Storage/R2StorageService";

export class UsersService implements IUsersService {
  private readonly saltRounds: number = parseInt(
    process.env.SALT_ROUNDS || "10",
    10
  );

  constructor(
    private userRepository: Repository<User>,
    private userRolesRepository: Repository<UserRole>,
    private storageService: IR2StorageService
  ) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<Result<UserDTO[]>> {
    const users = await this.userRepository.find({
      where: { is_deleted: false },
      relations: ["user_role"],
    });
    return { success: true, data: users.map((u) => toUserDTO(u)) };
  }

  /**
   * Get user by ID
   */
  async getUserById(user_id: number): Promise<Result<UserDTO>> {
    const user = await this.userRepository.findOne({
      where: { user_id, is_deleted: false },
      relations: ["user_role"],
    });
    //relations omogucava da se uz ucitavanje User-a ucitaju i podaci iz povezane tabele UserRole
    //Zbog ovoga nema potrebe za dodatnim upitom da bi dobili role_name

    if (!user) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: `User with ID ${user_id} not found`,
      };
    }
    return { success: true, data: toUserDTO(user) };
  }

  async getUserByUsername(username: string): Promise<Result<UserDTO>> {
    const user = await this.userRepository.findOne({
      where: { username, is_deleted: false },
      relations: ["user_role"],
    });

    if (!user) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: `User with USERNAME ${username} not found`,
      };
    }
    return { success: true, data: toUserDTO(user) };
  }

  /**
   * Get users by IDs
   */

  async getUsersByIds(ids: number[]): Promise<Result<UserDTO[]>> {
    const users = await this.userRepository.find({
      where: { user_id: In(ids), is_deleted: false },
      relations: ["user_role"],
    });

    return { success: true, data: users.map((u) => toUserDTO(u)) };
  }

  /**
   * Create new user
   */

  async createUser(user: UserCreationDTO): Promise<Result<UserDTO>> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }], //na ovaj nacin proveravam da li username ili email vec postoje i da li je obrisan korisnik sa tim podacima
      //kaze onda da dupliramo podatke sto je logicno, ali da li je potrebno onda da ostavim samo bez is_deleted: false u oba slucaja?
    });
    //generise: SELECT * FROM users WHERE username = 'user.username' OR email = 'user.email'

    if (existingUser) {
      return {
        success: false,
        code: ErrorCode.CONFLICT,
        error: "Username or email already exists",
      };
    }

    //posto dobijamo role_name:string onda pretrazujemo da li postoji taj role_name u bazi
    const userRole: UserRole | null = await this.userRolesRepository.findOne({
      where: { role_name: user.role_name },
    });

    if (userRole === null) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: "User role does not exist",
      };
    }

    const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

    user.password = hashedPassword;

    const result = await this.userRepository.insert({
      username: user.username,
      password_hash: hashedPassword,
      user_role: userRole,
      email: user.email,
      image_key: "",
      image_url: "",
    });

    const newUser = {
      user_id: result.identifiers[0].user_id,
      username: user.username,
      password_hash: hashedPassword,
      user_role: userRole,
      email: user.email,
      image_key: "",
      image_url: "",
      is_deleted: result.generatedMaps[0].is_deleted,
      weekly_working_hour_sum: result.generatedMaps[0].weekly_working_hour_sum,
    };

    return { success: true, data: toUserDTO(newUser) };
  }

  /**
   * Logicaly delete user by ID
   */

  async logicalyDeleteUserById(user_id: number): Promise<Result<void>> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id },
      relations: ["user_role"],
    });

    if (!existingUser) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: `User with ID ${user_id} not found`,
      };
    }

    const role = existingUser.user_role.role_name.toUpperCase();
    if(role === "ADMIN" || role === "SYSADMIN"){
      return {
        success: false,
        code: ErrorCode.FORBIDDEN,
        error: `Cannot delete user with role ${role}`,
      };
    }

    // Briši sliku iz storage-a ako postoji
    if (existingUser.image_key) {
      await this.storageService.deleteImage(existingUser.image_key);
    }

    const result = await this.userRepository.update(user_id, {
      is_deleted: true,
    });
    //na ovaj nacin brisanje je manje vise azuriranje kolone is_deleted na true

    if (result.affected !== undefined && result.affected > 0) {
      //vraca true ako je obrisan bar jedan red
      return { success: true, data: undefined };
    } else {
      return {
        success: false,
        code: ErrorCode.INTERNAL_ERROR,
        error: `There is error with deleting user with ID ${user_id}`,
      };
    }
  }

  /**
   * Update user by ID
   */
  async updateUserById(
    user_id: number,
    updateUserData: UserUpdateDTO
  ): Promise<Result<UserDTO>> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id, is_deleted: false },
      relations: ["user_role"],
    });

    if (!existingUser) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: `User with ID ${user_id} not found`,
      };
    }

    const currentRole = existingUser.user_role.role_name.toUpperCase();

    if (currentRole === "ADMIN" || currentRole === "SYSADMIN") {
      updateUserData.role_name = existingUser.user_role.role_name;

      if (updateUserData.role_name !== existingUser.user_role.role_name) {
        return {
          success: false,
          code: ErrorCode.FORBIDDEN,
          error: `Changing role is forbidden for users with role ${currentRole}`,
        };
      }
    }

    const alreadyExist = await this.userRepository.count({
      where: [
        { username: updateUserData.username, user_id: Not(user_id) },
        { email: updateUserData.email, user_id: Not(user_id) },
      ], //na ovaj nacin proveravam da li username ili email vec postoje i da li je obrisan korisnik sa tim podacima
      //kaze onda da dupliramo podatke sto je logicno, ali da li je potrebno onda da ostavim samo bez is_deleted: false u oba slucaja?
    });

    if (alreadyExist > 0) {
      return {
        success: false,
        code: ErrorCode.CONFLICT,
        error: `User with username: ${updateUserData.username} or email: ${updateUserData.email} already exist`,
      };
    }

    if (updateUserData.image_key !== undefined && existingUser.image_key) {
      await this.storageService.deleteImage(existingUser.image_key);
    }

    if (updateUserData.password) {
      existingUser.password_hash = await bcrypt.hash(
        updateUserData.password,
        this.saltRounds
      );
    }

    existingUser.email = updateUserData.email;
    existingUser.username = updateUserData.username;

    if (updateUserData.image_key !== undefined) {
      existingUser.image_key = updateUserData.image_key;
    }
    if (updateUserData.image_url !== undefined) {
      existingUser.image_url = updateUserData.image_url;
    }

    if (existingUser.user_role.role_name !== updateUserData.role_name) {
      const userRole: UserRole | null = await this.userRolesRepository.findOne({
        where: { role_name: updateUserData.role_name },
      });

      if (userRole) {
        existingUser.user_role = userRole;
      }
    }

    const updatedUser = await this.userRepository.save(existingUser);

    return { success: true, data: toUserDTO(updatedUser) };
  }

  /**
   * Set user's weekly_working_hour_sum by userId
   */

  async setWeeklyHours(
    user_id: number,
    weekly_working_hour: number
  ): Promise<Result<UserDTO>> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id },
      relations: ["user_role"],
    });

    if (!existingUser) {
      return {
        success: false,
        code: ErrorCode.NOT_FOUND,
        error: `User with ID ${user_id} not found`,
      };
    }

    const weekly_working_hour_sum =
      existingUser.weekly_working_hour_sum + weekly_working_hour;

    const result = await this.userRepository.update(user_id, {
      weekly_working_hour_sum,
    });

    if (result.affected === undefined || result.affected === 0) {
      return {
        success: false,
        code: ErrorCode.CONFLICT,
        error: `User with ID ${user_id} could not be updated`,
      };
    }

    existingUser.weekly_working_hour_sum = weekly_working_hour_sum;

    return { success: true, data: toUserDTO(existingUser) };
  }
}