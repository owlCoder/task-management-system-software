import { Repository } from "typeorm";
import axios, { AxiosInstance } from "axios";
import { ProjectUserAssignDTO } from "../Domain/DTOs/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../Domain/DTOs/ProjectUserDTO";
import { IProjectUserService } from "../Domain/services/IProjectUserService";
import { Project } from "../Domain/models/Project";
import { ProjectUser } from "../Domain/models/ProjectUser";
import { ProjectUserMapper } from "../Utils/Mappers/ProjectUserMapper";
import { UserDTO } from "../Domain/DTOs/UserDTO";

const RESTRICTED_ROLES = ["SysAdmin", "Admin", "Analytics & Development Manager"];
export class ProjectUserService implements IProjectUserService {
    private readonly userClient: AxiosInstance;
    

    constructor(
        private readonly projectUserRepository: Repository<ProjectUser>,
        private readonly projectRepository: Repository<Project>
    ) {
        const userServiceUrl = process.env.USER_SERVICE_API || "http://localhost:6754/api/v1";
        this.userClient = axios.create({
            baseURL: userServiceUrl,
            timeout: 10000,
        });
    }

    private async getUserByUsername(username: string): Promise<UserDTO | null> {
        try {
            const response = await this.userClient.get<UserDTO>(
                `/users/by-username/${encodeURIComponent(username)}`
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error("Error fetching user by username:", error.message);
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    private async getUserById(userId: number): Promise<UserDTO | null> {
        try {
            const response = await this.userClient.get<UserDTO>(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching user by ID ${userId}:`, error.message);
            return null;
        }
    }

    async assignUserToProject(data: ProjectUserAssignDTO): Promise<ProjectUserDTO> {
        const user = await this.getUserByUsername(data.username);
        
        if (!user) {
            throw new Error(`User with username "${data.username}" not found`);
        }

        if (RESTRICTED_ROLES.includes(user.role_name)) {
            throw new Error(
                `Users with role "${user.role_name}" cannot be assigned to projects.`
            );
        }

        const userId = user.user_id;

        const project = await this.projectRepository.findOne({
            where: { project_id: data.project_id }
        });
        
        if (!project) {
            throw new Error(`Project with id ${data.project_id} not found`);
        }

        const existing = await this.projectUserRepository.findOne({
            where: { project: { project_id: data. project_id }, user_id:  userId },
            relations: ["project"],
        });
        
        if (existing) {
            throw new Error(`User "${data.username}" is already assigned to this project`);
        }

        const assignments = await this.projectUserRepository. find({
            where: { user_id: userId },
        });

        const currentTotal = assignments. reduce(
            (sum, a) => sum + a.weekly_hours,
            0
        );

        const newTotal = currentTotal + data.weekly_hours;

        if (newTotal > 40) {
            throw new Error(
                `User "${data.username}" total weekly hours (${newTotal}) would exceed allowed 40 hours. ` +
                `Current hours: ${currentTotal}, trying to add: ${data.weekly_hours}`
            );
        }

        const pu = this.projectUserRepository.create({
            project: project,
            user_id: userId,
            weekly_hours: data.weekly_hours,
        });

        const saved = await this.projectUserRepository.save(pu);
        const dto = ProjectUserMapper.toDTO(saved);
        
        dto. username = user.username;
        dto.role_name = user. role_name;
        
        return dto;
    }

    async removeUserFromProject(project_id: number, user_id:  number): Promise<boolean> {
        const result = await this.projectUserRepository.delete({
            user_id,
            project: { project_id },
        } as any);
        return !!result.affected && result.affected > 0;
    }

    async getUsersForProject(project_id: number): Promise<ProjectUserDTO[]> {
        const list = await this.projectUserRepository.find({
            where: { project:  { project_id } },
            relations: ["project"],
        });
        
        const dtos = await Promise.all(
            list.map(async (pu) => {
                const dto = ProjectUserMapper.toDTO(pu);
                
                const user = await this.getUserById(pu.user_id);
                if (user) {
                    dto.username = user.username;
                    dto.role_name = user.role_name;
                } else {
                    dto.username = `User ${pu.user_id}`;
                    dto.role_name = "Unknown";
                }
                
                return dto;
            })
        );
        
        return dtos;
    }

    async updateWeeklyHoursForAllUsers(project_id: number, oldHours: number, newHours: number): Promise<void> {
        const projectUsers = await this.projectUserRepository.find({
            where: { project: { project_id } }
        });
        
        for (const pu of projectUsers) {
            if (pu.weekly_hours === oldHours && oldHours > 0) {
                pu.weekly_hours = newHours;
                await this.projectUserRepository.save(pu);
            }
        }
    }
}