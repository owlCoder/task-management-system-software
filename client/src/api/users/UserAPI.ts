import axios, { AxiosInstance } from "axios";
import { IUserAPI } from "./IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { UserCreationDTO } from "../../models/users/UserCreationDTO";
import { UserUpdateDTO } from "../../models/users/UserUpdateDTO";
import { UserRoleDTO } from "../../models/users/UserRoleDTO";

export class UserAPI implements IUserAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      timeout: 30000,
    });
  }

  async getAllUsers(token: string): Promise<UserDTO[]> {
    try {
      return (
        await this.axiosInstance.get<UserDTO[]>("/users", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getUserById(token: string, id: number): Promise<UserDTO> {
    try {
      return (
        await this.axiosInstance.get<UserDTO>(`/users/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async createUser(token: string, user: UserCreationDTO): Promise<UserDTO> {
    try {
      return (
        await this.axiosInstance.post<UserDTO>("/users", user, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async logicalyDeleteUserById(token: string, user_id: number): Promise<boolean> {
    try {
      return (
        await this.axiosInstance.delete<boolean>(`/users/${user_id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updateUser(token: string, user_id: number, newUserData: UserUpdateDTO): Promise<UserDTO> {
    try {
      const formData = new FormData();

      formData.append("username", newUserData.username);
      formData.append("email", newUserData.email);
      formData.append("role_name", newUserData.role_name);

      if (newUserData.password) {
        formData.append("password", newUserData.password);
      }

      if (newUserData.image_file) {
        formData.append("image_file", newUserData.image_file);
      }

      return (
        await this.axiosInstance.put<UserDTO>(`/users/${user_id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            // Content-Type se NE postavlja - axios automatski dodaje multipart/form-data sa boundary
          },
        })
      ).data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async setWeeklyHours(token: string, user_id: number, weekly_working_hours: number): Promise<UserDTO> {
    try {
      return (
        await this.axiosInstance.put<UserDTO>(`/users/${user_id}/working-hours`, { weekly_working_hours }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error setting weekly hours:', error);
      throw error;
    }
  }

  async getUserRolesForCreation(token: string, impact_level: number): Promise<UserRoleDTO[]> {
    try {
      return (
        await this.axiosInstance.get<UserRoleDTO[]>(`/user-roles/${impact_level}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      ).data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  }
}