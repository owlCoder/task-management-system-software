import axios, { AxiosInstance } from "axios";
import { IUserAPI } from "./IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";

export class UserAPI implements IUserAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllUsers(token: string): Promise<UserDTO[]> {
    return (
      await this.axiosInstance.get<UserDTO[]>("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async getUserById(token: string, id: number): Promise<UserDTO> {
    return (
      await this.axiosInstance.get<UserDTO>(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async createUser(token: string, user: UserCreationDTO): Promise<UserDTO> {
    return (
      await this.axiosInstance.post<UserDTO>("/users", user, {
      headers: { Authorization: `Bearer ${token}` },
    })).data;
  }

  async logicalyDeleteUserById(token: string, user_id: number): Promise<boolean> {
    return (
      await this.axiosInstance.delete<boolean>(`/users/${user_id}`, {
      headers: { Authorization: `Bearer ${token}`},
    })).data;
  }

  async updateUserById(token: string, newUserData: UserUpdateDTO): Promise<UserDTO> {
    return (
      await this.axiosInstance.put<UserDTO>(`/users/${newUserData.user_id}}`, newUserData, {
      headers: { Authorization: `Bearer ${token}`},
    })).data;
  }
}
