import { ResourceCostAllocationItemDTO } from "./ResourceCostAllocationItemDTO";

export interface ResourceCostAllocationDTO {
    project_id: number;
    resources: ResourceCostAllocationItemDTO[];
}