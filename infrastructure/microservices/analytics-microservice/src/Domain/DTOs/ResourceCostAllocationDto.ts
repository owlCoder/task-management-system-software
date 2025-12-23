import { ResourceCostAllocationItemDto } from "../DTOs/ResourceCostAllocationItemDto";

export interface ResourceCostAllocationDto {
    project_id: number;
    resources: ResourceCostAllocationItemDto[];
}