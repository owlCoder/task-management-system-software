import { Repository } from "typeorm";
import axios, { AxiosInstance } from "axios";
import { ProjectUserAssignDTO } from "../Domain/DTOs/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../Domain/DTOs/ProjectUserDTO";
import { IProjectUserService } from "../Domain/services/IProjectUserService";
import { INotifyService } from "../Domain/services/INotifyService";
import { NotificationType } from "../Domain/enums/NotificationType";
import { Project } from "../Domain/models/Project";
import { ProjectUser } from "../Domain/models/ProjectUser";
import { ProjectUserMapper } from "../Utils/Mappers/ProjectUserMapper";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";

const RESTRICTED_ROLES = ["SysAdmin", "Admin", "Analytics & Development Manager"];
export class ProjectUserService implements IProjectUserService {
    private readonly userClient: AxiosInstance;


    constructor(
        private readonly projectUserRepository: Repository<ProjectUser>,
        private readonly projectRepository: Repository<Project>,
        private readonly notifyService: INotifyService
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

    async assignUserToProject(data: ProjectUserAssignDTO): Promise<Result<ProjectUserDTO>> {
        const user = await this.getUserByUsername(data.username);
        if (!user) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `User with username "${data.username}" not found`,
            };
        }

        if (RESTRICTED_ROLES.includes(user.role_name)) {
            return {
                success: false,
                code: ErrorCode.FORBIDDEN,
                error: `Users with role "${user.role_name}" cannot be assigned to projects.`,
            };
        }

        const userId = user.user_id;

        const project = await this.projectRepository.findOne({
            where: { project_id: data.project_id }
        });
        if (!project) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Project with id ${data.project_id} not found`,
            };
        }

        const existing = await this.projectUserRepository.findOne({
            where: { project: { project_id: data.project_id }, user_id: userId },
            relations: ["project"],
        });

        if (existing) {
            return {
                success: false,
                code: ErrorCode.CONFLICT,
                error: `User "${data.username}" is already assigned to this project`,
            };
        }

        const assignments = await this.projectUserRepository.find({
            where: { user_id: userId },
        });

        const currentTotal = assignments.reduce(
            (sum, a) => sum + a.weekly_hours,
            0
        );

        const newTotal = currentTotal + data.weekly_hours;

        if (newTotal > 40) {
            return {
                success: false,
                code: ErrorCode.CONFLICT,
                error:
                    `User "${data.username}" total weekly hours (${newTotal}) would exceed allowed 40 hours. ` +
                    `Current hours: ${currentTotal}, trying to add: ${data.weekly_hours}`,
            };
        }

        const pu = this.projectUserRepository.create({
            project: project,
            user_id: userId,
            weekly_hours: data.weekly_hours,
            added_at: new Date(),
        });

        const saved = await this.projectUserRepository.save(pu);
        const dto = ProjectUserMapper.toDTO(saved);

        dto.username = user.username;
        dto.role_name = user.role_name;
        dto.image_url = user.image_url;

        this.notifyService.sendNotification(
            [userId],
            "Added to project",
            `You have been added to project "${project.project_name}".`,
            NotificationType.INFO
        );

        return { success: true, data: dto };
    }

    async removeUserFromProject(project_id: number, user_id: number): Promise<Result<boolean>> {
        const result = await this.projectUserRepository.delete({
            user_id,
            project: { project_id },
        } as any);
        if (result.affected && result.affected > 0) {
            const project = await this.projectRepository.findOne({
                where: { project_id },
            });
            const projectName = project?.project_name ?? `project ${project_id}`;

            this.notifyService.sendNotification(
                [user_id],
                "Removed from project",
                `You have been removed from project "${projectName}".`,
                NotificationType.INFO
            );
        }
        return { success: true, data: !!result.affected && result.affected > 0 };
    }

    async getUsersForProject(project_id: number): Promise<Result<ProjectUserDTO[]>> {
        const list = await this.projectUserRepository.find({
            where: { project: { project_id } },
            relations: ["project"],
        });

        if (list.length === 0) {
            return { success: true, data: [] };
        }

        const userIds = list.map(pu => pu.user_id);

        try {
            const response = await this.userClient.get<UserDTO[]>(`/users/ids`, {
                params: { ids: userIds.join(",") },
            });

            const users = response.data;

            const userMap = new Map<number, UserDTO>();
            users.forEach(u => userMap.set(u.user_id, u));

            const dtos: ProjectUserDTO[] = list.map(pu => {
                const dto = ProjectUserMapper.toDTO(pu);
                const user = userMap.get(pu.user_id);

                dto.username = user ? user.username : `User ${pu.user_id}`;
                dto.role_name = user ? user.role_name : "Unknown";
                dto.image_url = user?.image_url || undefined; //

                return dto;
            });

            return { success: true, data: dtos };
        } catch (error: any) {
            console.error("Error fetching users for project:", error.message);
            return {
                success: false,
                code: ErrorCode.INTERNAL_ERROR,
                error: "Failed to fetch users for project",
            };
        }
    }

    async getUserIdsForProject(project_id: number): Promise<Result<number[]>> {
        const list = await this.projectUserRepository.find({
            where: { project: { project_id } },
            select: ["user_id"],
        });

        const ids = list.map((pu) => pu.user_id);
        return { success: true, data: ids };
    }

    async updateWeeklyHoursForAllUsers(project_id: number, oldHours: number, newHours: number): Promise<Result<void>> {
        const projectUsers = await this.projectUserRepository.find({
            where: { project: { project_id } }
        });

        for (const pu of projectUsers) {
            if (pu.weekly_hours === oldHours && oldHours > 0) {
                pu.weekly_hours = newHours;
                await this.projectUserRepository.save(pu);
            }
        }

        return { success: true, data: undefined };
    }
}
