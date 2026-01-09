import axios, { AxiosInstance } from 'axios';
import { Result } from '../../types/Result';


export interface IProjectServiceClient {
    getSprintById(sprintId: number): Promise<Result<any>>;
    getUsersForProject(projectId: number): Promise<Result<any>>;
    getProjectById(projectId: number): Promise<Result<any>>;
    projectExists(projectId: number): Promise<boolean>;
}