import { ProjectStatus } from "../enums/ProjectStatus";

export const getProjectStatusStyles = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.ACTIVE:
            return {
                container: "bg-black/40 text-[#4ade80] border-[#4ade80]/50",
                dot: "bg-[#4ade80] shadow-[0_0_10px_#4ade80]",
            };
        case ProjectStatus.PAUSED:
            return {
                container: "bg-black/40 text-[#fbbf24] border-[#fbbf24]/50",
                dot: "bg-[#fbbf24] shadow-[0_0_10px_#fbbf24]",
            };
        case ProjectStatus.COMPLETED:
            return {
                container: "bg-black/40 text-[#60a5fa] border-[#60a5fa]/50",
                dot: "bg-[#60a5fa] shadow-[0_0_10px_#60a5fa]",
            };
        case ProjectStatus.NOT_STARTED:
            return {
                container: "bg-black/40 text-[#9ca3af] border-[#9ca3af]/50",
                dot: "bg-[#9ca3af] shadow-[0_0_10px_#9ca3af]",
            };
        default:
            return {
                container: "bg-black/40 text-[#9ca3af] border-[#9ca3af]/50",
                dot: "bg-[#9ca3af] shadow-[0_0_10px_#9ca3af]",
            };
    }
};

export const getProjectStatusColor = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.ACTIVE:
            return "bg-green-500";
        case ProjectStatus.PAUSED:
            return "bg-yellow-500";
        case ProjectStatus.COMPLETED:
            return "bg-blue-500";
        case ProjectStatus.NOT_STARTED:
            return "bg-gray-500";
        default:
            return "bg-gray-500";
    }
};

export const getProjectStatusTextColor = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.ACTIVE:
            return "text-green-500";
        case ProjectStatus.PAUSED:
            return "text-yellow-500";
        case ProjectStatus.COMPLETED:
            return "text-blue-500";
        case ProjectStatus.NOT_STARTED:
            return "text-gray-500";
        default:
            return "text-gray-500";
    }
};

export const getProjectStatusByDate = (
    startDate?: string | null,
    currentStatus?: ProjectStatus
): ProjectStatus => {
    if (!startDate) return ProjectStatus.NOT_STARTED;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    if (start > today) return ProjectStatus.NOT_STARTED;

    if (
        currentStatus === ProjectStatus.PAUSED ||
        currentStatus === ProjectStatus.COMPLETED
    ) {
        return currentStatus;
    }
    return ProjectStatus.ACTIVE;
};

export const formatProjectDate = (dateString: string | null): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const calculateProjectDuration = (sprintCount: number, sprintDuration: number): {
    days: number;
    weeks: number;
} => {
    const days = sprintCount * sprintDuration;
    const weeks = Math.round(days / 7);
    return { days, weeks };
};