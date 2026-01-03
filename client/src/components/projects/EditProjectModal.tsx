import React, { useState, useEffect } from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { hasProjectImage } from "../../helpers/image_url";

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
    });

    useEffect(() => {
        if (project) {
            setFormData({ ...project });
            setImageFile(null);
            setImagePreview(hasProjectImage(project) ? project.image_url : "");
            setErrors({
                project_name: "",
                total_weekly_hours_required: "",
                allowed_budget: "",
            });
        }
    }, [project]);

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