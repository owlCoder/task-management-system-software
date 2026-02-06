import React from "react";
import { hasProjectImage } from "../../helpers/image_url";
import type { Props } from "../../types/props/ProjectDetailsModalProps";
import { useNavigate } from "react-router-dom";
import { getProjectStatusStyles } from "../../helpers/projectStatusHelper";


const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const ProjectDetailsModal: React.FC<Props> = ({
    project,
    isOpen,
    onClose,
    onEdit,
}) => {
    const navigate = useNavigate();

    if (!isOpen || !project) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };
    
    const statusStyles = getProjectStatusStyles(project.status);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 bg-black/60"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="
                    bg-white/10 
                    border border-white/20
                    rounded-2xl
                    shadow-2xl
                    max-w-2xl w-full max-h-[90vh]
                    flex flex-col overflow-hidden
                    text-white
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                    <h2
                        id="modal-title"
                        className="text-2xl font-semibold"
                        style={{ fontFamily: "var(--font-secondary)" }}
                    >
                        Project Details
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition text-2xl leading-none w-8 h-8 flex items-center justify-center cursor-pointer"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 styled-scrollbar">
                    {/* Image */}
                    {hasProjectImage(project) && (
                        <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                            <img
                                src={project.image_url}
                                alt={`${project.project_name} cover`}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    {/* Project Name & Status */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                                Project Name
                            </h3>
                            <p className="text-2xl font-semibold break-words">
                                {project.project_name}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                                Status
                            </h3>
                            <span
                                className={`
                                    inline-flex items-center gap-1.5
                                    px-2.5 py-1 rounded-full
                                    text-xs font-semibold
                                    border backdrop-blur-sm
                                    ${statusStyles.container}
                                `}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                                {project.status}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Description
                        </h3>
                        <p className="text-sm text-white/80 leading-relaxed break-words">
                            {project.project_description || "No description available"}
                        </p>
                    </div>

                    {/* Project ID */}
                    <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Project ID
                        </h3>
                        <p className="text-sm text-white font-mono break-all">
                            {project.project_id}
                        </p>
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Start Date
                        </h3>
                        <p className="text-sm text-white font-mono">
                            {formatDate(project.start_date)}
                        </p>
                    </div>

                   

                    {/* Weekly Hours */}
                    <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Total Weekly Hours Required
                        </h3>
                        <p className="text-sm text-white font-mono">
                            {project.total_weekly_hours_required} hours
                        </p>
                    </div>

                    {/* Budget */}
                    <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Allowed Budget
                        </h3>
                        <p className="text-sm text-white font-mono">
                            ${project.allowed_budget.toLocaleString()}
                        </p>
                    </div>

                   
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            navigate(`/projects/${project.project_id}/sprints`);
                            onClose();
                        }}

                        className="
                            px-6 py-2 rounded-lg text-sm font-semibold
                            bg-gradient-to-t
                            from-[var(--palette-medium-blue)]
                            to-[var(--palette-deep-blue)]
                            text-white
                            transition
                            cursor-pointer
                        "
                    >
                        Sprints
                    </button>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                if (project && onEdit) {
                                    onEdit(project);
                                    onClose();
                                }
                            }}
                            className="
                                px-6 py-2 rounded-lg text-sm font-semibold
                                bg-white/10
                                border border-white/20
                                text-white
                                hover:bg-white/20
                                transition
                                cursor-pointer
                            "
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsModal;