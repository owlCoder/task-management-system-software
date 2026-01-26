import React, { useState, useEffect, useCallback } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetailsModal from "../components/projects/ProjectDetailsModal";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { EditProjectModal } from "../components/projects/EditProjectModal";
import ManageProjectUsersModal from "../components/projects/ManageProjectUsersModal";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { projectAPI } from "../api/project/ProjectAPI";
import { useAuth } from "../hooks/useAuthHook";
import type { ProjectDTO } from "../models/project/ProjectDTO";
import type { ProjectCreateDTO } from "../models/project/ProjectCreateDTO";
import { toast } from 'react-hot-toast';
import { confirmToast } from '../components/toast/toastHelper';

const canManageProjects = (role?: string): boolean => {
    return role === "Project Manager";
};

export const ProjectsPage: React.FC = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [viewProject, setViewProject] = useState<ProjectDTO | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<ProjectDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const selectedProject = projects.find((p) => p.project_id === selectedId) || null;

    const fetchProjects = useCallback(async () => {
        if (!user?.id) {
            setError("User not authenticated");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const data = canManageProjects(user?.role)
                ? await projectAPI.getAllProjects()
                : await projectAPI.getProjectsByUserId(user.id);

            setProjects(data);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Failed to load projects. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSelect = (projectId: number) => {
        if (canManageProjects(user?.role)) {
            setSelectedId((prev) => (prev === projectId ? null : projectId));
        }
    };

    const handleViewProject = (project: ProjectDTO) => {
        setViewProject(project);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewProject(null);
        setSelectedId(null);
    };

    const handleOpenCreateModal = () => {
        setSelectedId(null);
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleOpenEditModalClick = () => {
        if (selectedId === null) return;
        const project = projects.find((p) => p.project_id === selectedId);
        if (!project) return;
        handleOpenEditModal(project);
    };

    const handleOpenEditModal = (project: ProjectDTO) => {
        setIsDetailsModalOpen(false);
        setViewProject(null);
        setProjectToEdit(project);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setProjectToEdit(null);
        setSelectedId(null);
    };

    const handleOpenManageUsersModal = () => {
        if (selectedId === null) return;
        setIsManageUsersModalOpen(true);
    };

    const handleCloseManageUsersModal = () => {
        setIsManageUsersModalOpen(false);
    };

    const handleCreateProject = async (newProject: ProjectCreateDTO) => {
        try {
            const projectData: ProjectCreateDTO = {
                ...newProject,
                creator_username: user?.username,
            };

            const created = await projectAPI.createProject(projectData);
            if (created) {
                await fetchProjects();
                setIsCreateModalOpen(false);
                toast.success(`Project "${newProject.project_name}" created successfully!`);
            }
        } catch (err) {
            console.error("Failed to create project:", err);
            toast.error("Failed to create project. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (selectedId === null) return;

        const projectToDelete = projects.find((p) => p.project_id === selectedId);
        if (!projectToDelete) return;

        const confirmDelete = await confirmToast(
            `Are you sure you want to delete "${projectToDelete.project_name}"?`
        );
        if (!confirmDelete) return;

        try {
            const success = await projectAPI.deleteProject(selectedId);
            if (success) {
                await fetchProjects();
                setSelectedId(null);
                toast.success("Project deleted successfully!");
            } else {
                toast.error("Failed to delete project.");
            }
        } catch (err) {
            console.error("Failed to delete project:", err);
            toast.error("Failed to delete project. Please try again.");
        }
    };

    const handleUpdateProject = async (updatedProject: ProjectDTO, imageFile?: File) => {
        try {
            const updated = await projectAPI.updateProject(updatedProject.project_id, {
                project_name: updatedProject.project_name,
                project_description: updatedProject.project_description,
                total_weekly_hours_required: updatedProject.total_weekly_hours_required,
                allowed_budget: updatedProject.allowed_budget,
                start_date: updatedProject.start_date,
                sprint_count: updatedProject.sprint_count,
                sprint_duration: updatedProject.sprint_duration,
                status: updatedProject.status,
                image_file: imageFile,
            });
            if (updated) {
                await fetchProjects();
                setIsEditModalOpen(false);
                setProjectToEdit(null);
                toast.success(`Project "${updatedProject.project_name}" updated successfully!`);
            }
        } catch (err) {
            console.error("Failed to update project:", err);
            toast.error("Failed to update project. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white text-xl">Loading projects...</div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="text-red-400 text-xl">{error}</div>
                    <button
                        onClick={fetchProjects}
                        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black overflow-hidden">
            <Sidebar />

            <div className="flex-1 p-6 flex flex-col h-screen">
                <header className="flex items-center justify-between gap-5 mb-6 flex-wrap flex-shrink-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Projects</h1>

                    {canManageProjects(user?.role) && (
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={handleOpenManageUsersModal}
                                disabled={selectedId === null}
                                className={`group  w-[140px] h-[40px] rounded-[3em] flex items-center justify-center gap-[8px]
                                    font-semibold transition-all duration-500
                                    ${ selectedId !== null
                                        ? `
                                        bg-white/10 backdrop-blur-xl
                                        border border-white/15
                                        text-white/60
                                        hover:bg-gradient-to-t
                                        hover:from-[var(--palette-medium-blue)]
                                        hover:to-[var(--palette-deep-blue)]
                                        hover:text-white
                                        hover:-translate-y-1
                                        shadow-lg
                                        cursor-pointer
                                        `
                                        : `
                                        bg-white/5
                                        border border-white/10
                                        text-white/30
                                        cursor-not-allowed
                                        `
                                    }
                                `}
                                >
                            <span className="transition-colors duration-300">
                                Manage Users
                            </span>
                            </button>

                            <button
                            type="button"
                            onClick={handleOpenEditModalClick}
                            disabled={selectedId === null}
                            className={`group w-[140px] h-[40px] rounded-[3em] flex items-center justify-center gap-[8px]
                                font-semibold transition-all duration-500
                                ${ selectedId !== null
                                    ? `
                                    bg-white/10 backdrop-blur-xl
                                    border border-white/15
                                    text-white/60
                                    hover:bg-gradient-to-t
                                    hover:from-[var(--palette-medium-blue)]
                                    hover:to-[var(--palette-deep-blue)]
                                    hover:text-white
                                    hover:-translate-y-1
                                    shadow-lg
                                    cursor-pointer
                                    `
                                    : `
                                    bg-white/5
                                    border border-white/10
                                    text-white/30
                                    cursor-not-allowed
                                    `
                                }
                            `}
                            >
                            <svg
                                className={`w-4 h-4 transition-all duration-300
                                ${ selectedId !== null
                                    ? "text-white/60 group-hover:text-white group-hover:scale-110"
                                    : "text-white/30"
                                }
                                `}
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="transition-colors duration-300">
                                Edit Project
                            </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={selectedId === null}
                                className={`group w-[140px] h-[40px] rounded-[3em] flex items-center justify-center gap-[8px]
                                    font-semibold transition-all duration-500
                                    ${ selectedId !== null
                                        ? `
                                        bg-white/10 backdrop-blur-xl
                                        border border-white/15
                                        text-white
                                        hover:bg-gradient-to-t
                                        hover:from-red-500 hover:to-red-700
                                        hover:text-white
                                        hover:-translate-y-1
                                        shadow-lg
                                        cursor-pointer
                                        `
                                        : `
                                        bg-white/5
                                        border border-white/10
                                        text-white/30
                                        cursor-not-allowed
                                        `
                                    }
                                `}
                                >
                                <span className="transition-colors duration-300">
                                    Delete Project
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenCreateModal}
                                className="group w-[160px] h-[40px] rounded-[3em] flex items-center justify-center gap-[10px]
                                    bg-white/10 backdrop-blur-xl border border-white/15 text-white font-semibold
                                    transition-all duration-500
                                    hover:bg-gradient-to-t
                                    hover:from-[var(--palette-medium-blue)]
                                    hover:to-[var(--palette-deep-blue)]
                                    hover:-translate-y-1
                                    shadow-lg
                                    cursor-pointer
                                "
                                >
                                <svg
                                    className="w-4 h-4 text-white group-hover:text-white transition-all duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span className="group-hover:text-white transition-colors duration-300">
                                    Create Project
                                </span>
                                </button>
                        </div>
                    )}
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 styled-scrollbar">
                    {projects.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-white/60 text-lg">
                                {canManageProjects(user?.role) 
                                    ? "No projects found. Create your first project!"
                                    : "No projects assigned to you yet."}
                            </p>
                        </div>
                    ) : (
                        <section
                            aria-live="polite"
                            className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
                        >
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.project_id}
                                    project={project}
                                    selected={project.project_id === selectedId}
                                    onSelect={handleSelect}
                                    onView={handleViewProject}
                                    onEdit={canManageProjects(user?.role) ? handleOpenEditModal : undefined}
                                    onDelete={canManageProjects(user?.role) ? (proj) => {
                                        setSelectedId(proj.project_id);
                                        setTimeout(handleDelete, 0);
                                    } : undefined}
                                    canManage={canManageProjects(user?.role)}
                                    userRole={user?.role}
                                />
                            ))}
                        </section>
                    )}
                </div>

                <ProjectDetailsModal
                    project={viewProject}
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    onEdit={canManageProjects(user?.role) ? handleOpenEditModal : undefined}
                />

                <CreateProjectModal
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseCreateModal}
                    onSave={handleCreateProject}
                />

                <EditProjectModal
                    project={projectToEdit}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleUpdateProject}
                />

                <ManageProjectUsersModal
                    projectId={selectedProject?.project_id || null}
                    projectName={selectedProject?.project_name || ""}
                    weeklyHoursPerWorker={selectedProject?.total_weekly_hours_required || 0}
                    isOpen={isManageUsersModalOpen}
                    onClose={handleCloseManageUsersModal}
                    onUsersUpdated={() => {}}
                    projectAPI={projectAPI}
                />
            </div>
        </div>
    );
};

export default ProjectsPage;