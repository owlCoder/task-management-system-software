import axios, { AxiosInstance } from "axios";
import { IAnalyticsAPI } from "./IAnalyticsAPI";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";
import { TimeSeriesPointDto } from "../../models/analytics/TimeSeriesPointDto";
import { BusinessLLMOutputDTO } from "../../models/analytics/BusinessInsightDto";

type Id = string | number;

export class AnalyticsAPI implements IAnalyticsAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  private authHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getBurndownAnalytics(sprintId: Id, token: string): Promise<BurndownDto> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/burndown/${sprintId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching burndown analytics:", error);
      throw error;
    }
  }

  async getBurnupAnalytics(sprintId: Id, token: string): Promise<BurnupDto> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/burnup/${sprintId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching burnup analytics:", error);
      throw error;
    }
  }

  async getVelocityTracking(projectId: Id, token: string): Promise<number> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/velocity/${projectId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching velocity tracking:", error);
      throw error;
    }
  }

  async getBudgetTracking(projectId: Id, token: string): Promise<BudgetTrackingDto> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/budget/${projectId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching budget tracking:", error);
      throw error;
    }
  }

  async getProfitMargin(projectId: Id, token: string): Promise<ProfitMarginDto> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/profit-margin/${projectId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching profit margin:", error);
      throw error;
    }
  }

  async getResourceCostAllocation(projectId: Id, token: string): Promise<ResourceCostAllocationDto> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/resource-cost/${projectId}`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching resource cost allocation:", error);
      throw error;
    }
  }

  async getProjectsLast30Days(token: string): Promise<TimeSeriesPointDto[]> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/projects-last-30-days`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching projects last 30 days:", error);
      throw error;
    }
  }

  async getWorkersLast30Days(token: string): Promise<TimeSeriesPointDto[]> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/workers-last-30-days`, {
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching workers last 30 days:", error);
      throw error;
    }
  }

 async getBusinessInsights(from: string, to: string, token: string): Promise<BusinessLLMOutputDTO> {
    try {
      return (
        await this.axiosInstance.get(`/analytics/business-insights`, {
          params: { from, to },
          headers: this.authHeaders(token),
        })
      ).data;
    } catch (error) {
      console.error("Error fetching business insights:", error);
      throw error;
    }
  }

}