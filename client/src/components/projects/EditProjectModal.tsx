import React, { useState, useEffect } from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { ProjectStatus } from "../../enums/ProjectStatus";
import { hasProjectImage } from "../../helpers/image_url";
import { projectAPI } from "../../api/project/ProjectAPI";
import { ProjectUserDTO } from "../../models/project/ProjectUserDTO";
import UserAssignmentSection from "./UserAssignmentSection";

type Props = {
    project: ProjectDTO | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: ProjectDTO, imageFile?: File) => void;
};

export const EditProjectModal: React.FC<Props> = ({
    project,
    isOpen,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<ProjectDTO | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [errors, setErrors] = useState({
        project_name: "",
        total_weekly_hours_required: "",
        allowed_budget: "",
        sprint_count: "",
        sprint_duration: "",
    });

    // User assignment state
    const [assignedUsers, setAssignedUsers] = useState<ProjectUserDTO[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({ ...project });
            setImageFile(null);
            setImagePreview(hasProjectImage(project) ? project.image_url : "");
            setErrors({
                project_name: "",
                total_weekly_hours_required: "",
                allowed_budget: "",
                sprint_count: "",
                sprint_duration: "",
            });
        }
    }, [project]);

    // Load assigned users when modal opens
    useEffect(() => {
        if (project && isOpen) {
            loadAssignedUsers();
        }
    }, [project, isOpen]);

    const loadAssignedUsers = async () => {
        if (!project) return;
        setUsersLoading(true);
        try {
            const users = await projectAPI.getProjectUsers(project.project_id);
            setAssignedUsers(users);
        } catch (err) {
            console.error("Failed to load assigned users:", err);
        }
        setUsersLoading(false);
    };

    const handleAddUser = async (userId: number, weeklyHours: number): Promise<boolean> => {
        if (!project) return false;
        try {
            const newUser = await projectAPI.assignUserToProject(project.project_id, userId, weeklyHours);
            setAssignedUsers(prev => [...prev, newUser]);
            return true;
        } catch (err) {
            console.error("Failed to assign user:", err);
            return false;
        }
    };

    const handleRemoveUser = async (userId: number): Promise<boolean> => {
        if (!project) return false;
        try {
            const success = await projectAPI.removeUserFromProject(project.project_id, userId);
            if (success) {
                setAssignedUsers(prev => prev.filter(u => u.user_id !== userId));
            }
            return success;
        } catch (err) {
            console.error("Failed to remove user:", err);
            return false;
        }
    };

    if (!isOpen || !formData) return null;

    const updateField = <K extends keyof ProjectDTO>(field: K, value: ProjectDTO[K]) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    };

    const validateForm = () => {
        const newErrors = {
            project_name: "",
            total_weekly_hours_required: "",
            allowed_budget: "",
            sprint_count: "",
            sprint_duration: "",
        };

        if (!formData.project_name.trim()) {
            newErrors.project_name = "Project name is required";
        }
        if (!formData.total_weekly_hours_required || formData.total_weekly_hours_required <= 0) {
            newErrors.total_weekly_hours_required = "Hours must be a positive number";
        }
        if (!formData.allowed_budget || formData.allowed_budget <= 0) {
            newErrors.allowed_budget = "Budget must be a positive number";
        }
        if (!formData.sprint_count || formData.sprint_count <= 0) {
            newErrors.sprint_count = "Sprint count must be a positive number";
        }
        if (!formData.sprint_duration || formData.sprint_duration <= 0) {
            newErrors.sprint_duration = "Sprint duration must be a positive number";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => !e);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData || !validateForm()) return;

        onSave(
            {
                ...formData,
                project_name: formData.project_name.trim(),
                project_description: formData.project_description.trim(),
            },
            imageFile || undefined
        );
        onClose();
    };

    const getStatusColor = (status: ProjectStatus): string => {
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

    const formatDateForInput = (dateString: string | null): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="
                    bg-white/10 border border-white/20 rounded-2xl shadow-2xl
                    max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-white
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                    <h2
                        className="text-2xl font-semibold"
                        style={{ fontFamily: "var(--font-secondary)" }}
                    >
                        Edit Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <form className="p-6 overflow-y-auto flex-1 styled-scrollbar space-y-4">
                    {/* Project Name */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Project Name *
                        </h3>
                        <input
                            type="text"
                            value={formData.project_name}
                            onChange={(e) => updateField("project_name", e.target.value)}
                            required
                            className={`w-full px-4 py-2 rounded-lg bg-white/10 border focus:outline-none ${
                                errors.project_name ? "border-red-400" : "border-white/20"
                            }`}
                        />
                        {errors.project_name && (
                            <p className="text-red-400 text-sm mt-1">{errors.project_name}</p>
                        )}
                    </div>

                    {/* Project Image */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Project Image
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition">
                            <span className="text-white/90">
                                {imageFile ? imageFile.name : imagePreview ? "Change Image" : "Choose Image"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="mt-2 w-32 h-32 object-cover rounded-2xl"
                            />
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Description
                        </h3>
                        <textarea
                            value={formData.project_description}
                            onChange={(e) => updateField("project_description", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 min-h-[100px] focus:outline-none"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Start Date
                        </h3>
                        <input
                            type="date"
                            value={formatDateForInput(formData.start_date)}
                            onChange={(e) => updateField("start_date", e.target.value || null)}
                            className="
                                w-full px-4 py-2 rounded-lg
                                bg-white/10 border border-white/20
                                focus:outline-none
                                [color-scheme:dark]
                            "
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Status
                        </h3>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={(e) => updateField("status", e.target.value as ProjectStatus)}
                                className="
                                    w-full px-4 py-2 rounded-lg
                                    bg-white/10 border border-white/20
                                    focus:outline-none
                                    appearance-none cursor-pointer
                                "
                            >
                                {Object.values(ProjectStatus).map((status) => (
                                    <option key={status} value={status} className="bg-gray-800 text-white">
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${getStatusColor(formData.status)}`}></span>
                            <span className="text-sm text-white/70">{formData.status}</span>
                        </div>
                    </div>

                    {/* Sprint Count */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Number of Sprints *
                        </h3>
                        <input
                            type="number"
                            value={formData.sprint_count}
                            onChange={(e) => updateField("sprint_count", Number(e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === "+" || e.key === "-" || e.key === ".") {
                                    e.preventDefault();
                                }
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg bg-white/10 border focus:outline-none
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                                ${errors.sprint_count ? "border-red-400" : "border-white/20"}
                            `}
                        />
                        {errors.sprint_count && (
                            <p className="text-red-400 text-sm mt-1">{errors.sprint_count}</p>
                        )}
                    </div>

                    {/* Sprint Duration */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Sprint Duration (days) *
                        </h3>
                        <input
                            type="number"
                            value={formData.sprint_duration}
                            onChange={(e) => updateField("sprint_duration", Number(e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === "+" || e.key === "-" || e.key === ".") {
                                    e.preventDefault();
                                }
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg bg-white/10 border focus:outline-none
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                                ${errors.sprint_duration ? "border-red-400" : "border-white/20"}
                            `}
                        />
                        {errors.sprint_duration && (
                            <p className="text-red-400 text-sm mt-1">{errors.sprint_duration}</p>
                        )}
                    </div>

                    {/* Total Weekly Hours */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Total Weekly Hours Required *
                        </h3>
                        <input
                            type="number"
                            value={formData.total_weekly_hours_required}
                            onChange={(e) =>
                                updateField("total_weekly_hours_required", Number(e.target.value))
                            }
                            onKeyDown={(e) => {
                                if (e.key === "+" || e.key === "-" || e.key === ".") {
                                    e.preventDefault();
                                }
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg bg-white/10 border focus:outline-none
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                                ${errors.total_weekly_hours_required ? "border-red-400" : "border-white/20"}
                            `}
                        />
                        {errors.total_weekly_hours_required && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.total_weekly_hours_required}
                            </p>
                        )}
                    </div>

                    {/* Allowed Budget */}
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Allowed Budget ($) *
                        </h3>
                        <input
                            type="number"
                            value={formData.allowed_budget}
                            onChange={(e) => updateField("allowed_budget", Number(e.target.value))}
                            onKeyDown={(e) => {
                                if (e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg bg-white/10 border focus:outline-none
                                [&::-webkit-inner-spin-button]:appearance-none
                                [&::-webkit-outer-spin-button]:appearance-none
                                ${errors.allowed_budget ? "border-red-400" : "border-white/20"}
                            `}
                        />
                        {errors.allowed_budget && (
                            <p className="text-red-400 text-sm mt-1">{errors.allowed_budget}</p>
                        )}
                    </div>

                    {/* User Assignment Section */}
                    <div className="pt-4 border-t border-white/10">
                        <UserAssignmentSection
                            assignedUsers={assignedUsers}
                            onAddUser={handleAddUser}
                            onRemoveUser={handleRemoveUser}
                            isLoading={usersLoading}
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-6 py-2 rounded-lg bg-white/10 border border-white/20 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProjectModal;