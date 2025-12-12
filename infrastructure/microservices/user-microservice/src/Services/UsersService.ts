import { Not, Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { User } from "../Domain/models/User";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { UserCreationDTO } from "../Domain/DTOs/UserCreationDTO";
import bcrypt from "bcryptjs";
import { UserRole } from "../Domain/models/UserRole";
import { UserUpdateDTO } from "../Domain/DTOs/UserUpdateDTO";
import { toDTO } from "../Helpers/toUserDto";

export class UsersService implements IUsersService {
  private readonly saltRounds: number = parseInt(
    process.env.SALT_ROUNDS || "10",
    10
  );

  constructor(
    private userRepository: Repository<User>,
    private userRolesRepository: Repository<UserRole>
  ) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find({
      where: { is_deleted: false },
      relations: ["user_role"],
    });
    return users.map((u) => toDTO(u));
  }

  /**
   * Get user by ID
   */
  async getUserById(user_id: number): Promise<UserDTO> {
    const user = await this.userRepository.findOne({
      where: { user_id, is_deleted: false },
      relations: ["user_role"],
    });
    //relations omogucava da se uz ucitavanje User-a ucitaju i podaci iz povezane tabele UserRole
    //Zbog ovoga nema potrebe za dodatnim upitom da bi dobili role_name

    if (!user) throw new Error(`User with ID ${user_id} not found`);
    return toDTO(user);
  }

  /**
   * Create new user
   */

  async createUser(user: UserCreationDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }], //na ovaj nacin proveravam da li username ili email vec postoje i da li je obrisan korisnik sa tim podacima
      //kaze onda da dupliramo podatke sto je logicno, ali da li je potrebno onda da ostavim samo bez is_deleted: false u oba slucaja?
    });
    //generise: SELECT * FROM users WHERE username = 'user.username' OR email = 'user.email'

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    //posto dobijamo role_name:string onda pretrazujemo da li postoji taj role_name u bazi
    const userRole: UserRole | null = await this.userRolesRepository.findOne({
      where: { role_name: user.role_name },
    });

    if (userRole === null) {
      throw new Error("User role does not exist");
    }

    const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

    user.password = hashedPassword;

    const result = await this.userRepository.insert({
      username: user.username,
      password_hash: hashedPassword,
      user_role: userRole,
      email: user.email,
    });

    const newUser = {
      user_id: result.identifiers[0].user_id,
      username: user.username,
      password_hash: hashedPassword,
      user_role: userRole,
      email: user.email,
      is_deleted: result.generatedMaps[0].is_deleted,
      weekly_working_hour_sum: result.generatedMaps[0].weekly_working_hour_sum,
    };

    return toDTO(newUser);
  }

  /**
   * Logicaly delete user by ID
   */

  async logicalyDeleteUserById(user_id: number): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!existingUser) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    // const result = await this.userRepository.softDelete({ user_id }); ne mozemo raditi soft delete jer nam je potrebna dodatna kolona deletedAt u tabeli za to
    // a ako je dodamo nema smisla da idmamo is_deleted kolonu

    const result = await this.userRepository.update(user_id, {
      is_deleted: true,
    });
    //na ovaj nacin brisanje je manje vise azuriranje kolone is_deleted na true

    return result.affected !== undefined && result.affected > 0; //vraca true ako je obrisan bar jedan red
  }

  /**
   * Update user by ID
   */

  async updateUserById(
    user_id: number,
    updateUserData: UserUpdateDTO
  ): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id, is_deleted: false },
      relations: ["user_role"],
    });

    if (!existingUser) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const alreadyExist = await this.userRepository.count({
      where: [
        { username: updateUserData.username, user_id: Not(user_id) },
        { email: updateUserData.email, user_id: Not(user_id) },
      ], //na ovaj nacin proveravam da li username ili email vec postoje i da li je obrisan korisnik sa tim podacima
      //kaze onda da dupliramo podatke sto je logicno, ali da li je potrebno onda da ostavim samo bez is_deleted: false u oba slucaja?
    });

    if (alreadyExist > 0) {
      throw new Error(
        `User with username: ${updateUserData.username} or email: ${updateUserData.email} already exist`
      );
    }

    if (updateUserData.password) {
      existingUser.password_hash = await bcrypt.hash(
        updateUserData.password,
        this.saltRounds
      );
    }

    existingUser.email = updateUserData.email;
    existingUser.username = updateUserData.username;

    if (existingUser.user_role.role_name !== updateUserData.role_name) {
      const userRole: UserRole | null = await this.userRolesRepository.findOne({
        where: { role_name: updateUserData.role_name },
      });

      if (userRole) {
        existingUser.user_role = userRole;
      }
    }

    const updatedUser = await this.userRepository.save(existingUser);

    return toDTO(updatedUser);
  }

  /**
   * Set user's weekly_working_hour_sum by userId
   */

  async setWeeklyHours(
    user_id: number,
    weekly_working_hour: number
  ): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id },
      relations: ["user_role"],
    });

    if (!existingUser) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const weekly_working_hour_sum =
      existingUser.weekly_working_hour_sum + weekly_working_hour;

    const result = await this.userRepository.update(user_id, {
      weekly_working_hour_sum,
    });

    if (result.affected === undefined || result.affected === 0) {
      throw new Error(`User with ID ${user_id} could not be updated`);
    }

    existingUser.weekly_working_hour_sum = weekly_working_hour_sum;

    return toDTO(existingUser);
  }
}
