import { User } from "../models/User";

export interface IUserRepository {
  findOne(options: any): Promise<User | null>;
  create(data: any): User;
  save(user: User): Promise<User>;
}