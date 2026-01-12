import { IAnalyticsAPI } from "./IAnalyticsAPI";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";

export class AnalyticsAPI implements IAnalyticsAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getBurndownAnalytics(sprintId: string): Promise<BurndownDto> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/burndown/${sprintId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Burndown Analytics data");
      return res.json();
    } catch (error) {
      console.error('Error fetching burndown analytics:', error);
      throw error;
    }
  }

  async getBurnupAnalytics(sprintId: string): Promise<BurnupDto> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/burnup/${sprintId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Burnup Analytics data");
      return res.json();
    } catch (error) {
      console.error('Error fetching burnup analytics:', error);
      throw error;
    }
  }

  async getVelocityTracking(projectId: string): Promise<number> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/velocity/${projectId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Velocity tracking data");
      return res.json();
    } catch (error) {
      console.error('Error fetching velocity tracking:', error);
      throw error;
    }
  }

  async getBudgetTracking(projectId: string): Promise<BudgetTrackingDto> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/budget/${projectId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Budget Tracking data");
      return res.json();
    } catch (error) {
      console.error('Error fetching budget tracking:', error);
      throw error;
    }
  }

  async getProfitMargin(projectId: string): Promise<ProfitMarginDto> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/profit-margin/${projectId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Profit Margin data");
      return res.json();
    } catch (error) {
      console.error('Error fetching profit margin:', error);
      throw error;
    }
  }

  async getResourceCostAllocation(projectId: string): Promise<ResourceCostAllocationDto> {
    try {
      const res = await fetch(`${this.baseUrl}/analytics/resource-cost/${projectId}`, {
        headers: this.headers,
      });
      if (!res.ok) throw new Error("Failed to fetch Resource Cost Allocation data");
      return res.json();
    } catch (error) {
      console.error('Error fetching resource cost allocation:', error);
      throw error;
    }
  }
}
