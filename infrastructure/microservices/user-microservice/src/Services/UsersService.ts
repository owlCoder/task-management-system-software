import { Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { User } from "../Domain/models/User";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { UserRole } from "../Domain/models/UserRole";
import { UserRoleDTO } from "../Domain/DTOs/UserRoleDTO";

export class UsersService implements IUsersService {
  constructor(private userRepository: Repository<User>) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find({
      where: { is_deleted: false },
      relations: ["user_role"],
    });
    return users.map((u) => this.toDTO(u));
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
    return this.toDTO(user);
  }

  /**
   * Create new user
   */

  async createUser(user: User): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }], //na ovaj nacin proveravam da li username ili email vec postoje i da li je obrisan korisnik sa tim podacima
      //kaze onda da dupliramo podatke sto je logicno, ali da li je potrebno onda da ostavim samo bez is_deleted: false u oba slucaja?
    });
    //generise: SELECT * FROM users WHERE username = 'user.username' OR email = 'user.email'

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const result = this.userRepository.insert(user);

    const newUser = {
      ...user,
      user_id: (await result).identifiers[0].user_id,
      is_deleted: (await result).generatedMaps[0].is_deleted,
      weekly_working_hour_sum: (await result).generatedMaps[0]
        .weekly_working_hour_sum,
    };

    return this.toDTO(newUser);
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
    userData: Partial<User>
  ): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: { user_id, is_deleted: false },
      relations: ["user_role"],
    });

    if (!existingUser) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const updatedUser = { ...existingUser, ...userData };
    //Spaja postojece podatke user-a sa novim podacima
    const result = await this.userRepository.update(user_id, updatedUser);

    if (result.affected === undefined || result.affected === 0) {
      throw new Error(`User with ID ${user_id} could not be updated`);
    }

    return this.toDTO(updatedUser);
  }

  /**
   * Convert User entity to UserDTO
   */
  private toDTO(user: User): UserDTO {
    return {
      user_id: user.user_id,
      username: user.username,
      role_name: user.user_role.role_name, //uzimamo role_name jer ucitavaju objekat get funkcije
      email: user.email,
      weekly_working_hour_sum: user.weekly_working_hour_sum,
    };
  }
}
