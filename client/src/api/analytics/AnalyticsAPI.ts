import { IAnalyticsAPI } from "./IAnalyticsAPI";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";

type Id = string | number;

export class AnalyticsAPI implements IAnalyticsAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
  }

  /** omogucava da posle login/refresh samo setujes novi token */
  public setToken(token: string) {
    this.token = token;
  }

  private get headers(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // ako nema tokena ne salji header
    if (this.token && this.token.trim().length > 0) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: this.headers,
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    let details = "";
    try {
      const body = await res.json();
      details =
        body?.message ||
        body?.error ||
        body?.details ||
        (typeof body === "string" ? body : JSON.stringify(body));
    } catch {
      try {
        details = await res.text();
      } catch {
        details = "";
      }
    }

    throw new Error(
      `Analytics API error (${res.status} ${res.statusText})${
        details ? `: ${details}` : ""
      }`
    );
  }

  getBurndownAnalytics(sprintId: Id): Promise<BurndownDto> {
    return this.request(`/analytics/burndown/${sprintId}`);
  }

  getBurnupAnalytics(sprintId: Id): Promise<BurnupDto> {
    return this.request(`/analytics/burnup/${sprintId}`);
  }

  getVelocityTracking(projectId: Id): Promise<number> {
    return this.request(`/analytics/velocity/${projectId}`);
  }

  getBudgetTracking(projectId: Id): Promise<BudgetTrackingDto> {
    return this.request(`/analytics/budget/${projectId}`);
  }

  getProfitMargin(projectId: Id): Promise<ProfitMarginDto> {
    return this.request(`/analytics/profit-margin/${projectId}`);
  }

  getResourceCostAllocation(projectId: Id): Promise<ResourceCostAllocationDto> {
    return this.request(`/analytics/resource-cost/${projectId}`);
  }
}
