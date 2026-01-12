import axios, { AxiosInstance, AxiosResponse } from "axios";
import { PlantDTO } from "../../models/plants/PlantDTO";
import { IPlantAPI } from "./IPlantAPI";

export class PlantAPI implements IPlantAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private getAuthHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  async getAllPlants(token: string): Promise<PlantDTO[]> {
    try {
      const response: AxiosResponse<PlantDTO[]> = await this.axiosInstance.get("/plants", {
        headers: this.getAuthHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all plants:', error);
      throw error;
    }
  }

  async getPlantById(id: number, token: string): Promise<PlantDTO> {
    try {
      const response: AxiosResponse<PlantDTO> = await this.axiosInstance.get(`/plants/${id}`, {
        headers: this.getAuthHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching plant by ID:', error);
      throw error;
    }
  }

  async createPlant(plant: PlantDTO, token: string): Promise<PlantDTO> {
    try {
      const response: AxiosResponse<PlantDTO> = await this.axiosInstance.post("/plants", plant, {
        headers: this.getAuthHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  }

  async updatePlant(id: number, plant: PlantDTO, token: string): Promise<PlantDTO> {
    try {
      const response: AxiosResponse<PlantDTO> = await this.axiosInstance.put(`/plants/${id}`, plant, {
        headers: this.getAuthHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  }

  async deletePlant(id: number, token: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/plants/${id}`, {
        headers: this.getAuthHeaders(token),
      });
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  }
}
