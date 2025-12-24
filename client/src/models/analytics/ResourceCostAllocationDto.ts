import { ResourceCostAllocationItemDto } from "../analytics/ResourceCostAllocationItemDto";

export interface ResourceCostAllocationDto {
    project_id: number;
    resources: ResourceCostAllocationItemDto[];
}