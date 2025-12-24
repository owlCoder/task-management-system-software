import { IAnalyticsAPI } from "./IAnalyticsAPI";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";

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

  async getBudgetTracking(projectId: string): Promise<BudgetTrackingDto> {
    const res = await fetch(`${this.baseUrl}/analytics/budget/${projectId}`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error("Failed to fetch Budget Tracking data");
    return res.json();
  }

  async getProfitMargin(projectId: string): Promise<ProfitMarginDto> {
    const res = await fetch(`${this.baseUrl}/analytics/profit-margin/${projectId}`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error("Failed to fetch Profit Margin data");
    return res.json();
  }

  async getResourceCostAllocation(projectId: string): Promise<ResourceCostAllocationDto> {
    const res = await fetch(`${this.baseUrl}/analytics/resource-cost/${projectId}`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error("Failed to fetch Resource Cost Allocation data");
    return res.json();
  }
}
