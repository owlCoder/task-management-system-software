import React from "react";
import { ProjectStatus } from "../../enums/ProjectStatus";
import { hasProjectImage } from "../../helpers/image_url";
import type { Props } from "../../types/props/ProjectCardProps";
import { UserRole } from "../../enums/UserRole";

const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.ACTIVE:
            return "bg-green-700";
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

const canViewProjectDetails = (role?: string): boolean => {
    return role !== UserRole.ANALYTICS_DEVELOPMENT_MANAGER;
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const ProjectCard: React.FC<Props> = ({
    project,
    selected = false,
    onSelect,
    onView,
    canManage = false,
    userRole,
}) => {
    const handleRootKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(project.project_id);
        }
    };

    const handleViewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onView?.(project);
    };

    const handleViewKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onView?.(project);
        }
    };

    return (
        <article
            className={`
                w-full max-w-xs flex flex-col select-none cursor-pointer
                bg-white/5 backdrop-blur-xl
                border border-white/10
                rounded-2xl
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40
                ${
                    selected && canManage
                        ? "ring-2 ring-[var(--accent)]/50 shadow-2xl -translate-y-1"
                        : "hover:-translate-y-1 hover:shadow-xl"
                }
            `}
            onClick={() => canManage && onSelect?.(project.project_id)}
            role="button"
            tabIndex={0}
            onKeyDown={handleRootKeyDown}
        >
            {/* Image */}
            <div className="p-4 pb-0">
                <div className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 relative">
                    {hasProjectImage(project) ? (
                        <img
                            src={project.image_url}
                            alt={`${project.project_name} cover`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-muted text-sm">No image</span>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                        <span
                            className={`
                                px-2 py-1 rounded-full text-xs font-semibold
                                ${getStatusColor(project.status)} text-white
                            `}
                        >
                            {project.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    id={`project-${project.project_id}-title`}
                    className="text-white text-lg md:text-xl font-semibold tracking-wide"
                >
                    {project.project_name}
                </h3>

                {/* Start Date */}
                <p className="text-white text-muted text-sm flex items-center gap-2">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 opacity-80"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatDate(project.start_date)}
                </p>

                {/* Sprints Info */}
                <p className="text-white text-muted text-sm flex items-center gap-2">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 opacity-80"
                    >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </p>

                {/* Weekly Hours */}
                <p className="text-white text-muted text-sm flex items-center gap-2">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 opacity-80"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {project.total_weekly_hours_required} hrs/week
                </p>

                {/* Budget */}
                <p className="text-white text-muted text-sm flex items-center gap-2">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 opacity-80"
                    >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {project.allowed_budget.toLocaleString()}
                </p>

                <p className="text-white text-muted text-sm leading-snug line-clamp-2">
                    {project.project_description || "No description"}
                </p>
            </div>

            {/* View Button - Conditional Rendering based on userRole */}
            {canViewProjectDetails(userRole) ? (
                <div
                    className="
                        h-11
                        flex items-center justify-center
                        text-sm font-semibold
                        text-white
                        bg-white/10
                        hover:bg-gradient-to-t
                        hover:from-[var(--palette-medium-blue)]
                        hover:to-[var(--palette-deep-blue)]
                        transition-all duration-300
                        rounded-b-2xl
                    "
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${project.project_name}`}
                    onClick={handleViewClick}
                    onKeyDown={handleViewKeyDown}
                >
                    View Project
                </div>
            ) : (
                <div className="pb-4" /> // Spacing at the bottom if button is hidden
            )}
        </article>
    );
};

export default ProjectCard;