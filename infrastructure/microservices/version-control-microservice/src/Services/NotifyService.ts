import axios, { AxiosInstance } from "axios";
import { NotificationType } from "../Domain/enums/NotificationType";
import { INotifyService } from "../Domain/services/INotifyService";

export class NotifyService implements INotifyService {
    private readonly notificationClient: AxiosInstance;

    constructor() {
        const baseUrl = (process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5003").replace(/\/+$/, "");
        this.notificationClient = axios.create({
            baseURL: baseUrl,
            timeout: 5000,
        });
    }

    sendNotification(
        userIds: number[],
        title: string,
        content: string,
        type: NotificationType = NotificationType.INFO
    ): void {
        if (!Array.isArray(userIds) || userIds.length === 0) return;

        void this.notificationClient
            .post("/api/v1/notifications", {
                userIds,
                title,
                content,
                type,
            })
            .catch((error) => {
                console.error("Failed to send notification:", error?.message || error);
            });
    }
}
