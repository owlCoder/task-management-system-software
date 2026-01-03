import React, { useState, useEffect, useCallback } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetailsModal from "../components/projects/ProjectDetailsModal";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { EditProjectModal } from "../components/projects/EditProjectModal";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { projectAPI } from "../api/project/ProjectAPI";
import { useAuth } from "../hooks/useAuthHook";
import type { ProjectDTO } from "../models/project/ProjectDTO";
import type { ProjectCreateDTO } from "../models/project/ProjectCreateDTO";

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [viewProject, setViewProject] = useState<ProjectDTO | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!user?.id) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await projectAPI.getProjectsByUserId(user.id);
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
    setSelectedId((prev) => (prev === projectId ? null : projectId));
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

  const handleCreateProject = async (newProject: ProjectCreateDTO) => {
    try {
      const projectData: ProjectCreateDTO = {
        ...newProject,
        user_id: user?.id,
      };

      const created = await projectAPI.createProject(projectData);
      if (created) {
        await fetchProjects();
        setIsCreateModalOpen(false);
        alert(`Project "${newProject.project_name}" created successfully!`);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (selectedId === null) return;

    const projectToDelete = projects.find((p) => p.project_id === selectedId);
    if (!projectToDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectToDelete.project_name}"?`
    );
    if (!confirmDelete) return;

    try {
      const success = await projectAPI.deleteProject(selectedId);
      if (success) {
        await fetchProjects();
        setSelectedId(null);
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project.");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleUpdateProject = async (updatedProject: ProjectDTO, imageFile?: File) => {
    try {
      const updated = await projectAPI.updateProject(updatedProject.project_id, {
        project_name: updatedProject.project_name,
        project_description: updatedProject.project_description,
        total_weekly_hours_required: updatedProject.total_weekly_hours_required,
        allowed_budget: updatedProject.allowed_budget,
        image_file: imageFile,
      });
      if (updated) {
        await fetchProjects();
        setIsEditModalOpen(false);
        setProjectToEdit(null);
        alert(`Project "${updatedProject.project_name}" updated successfully!`);
      }
    } catch (err) {
      console.error("Failed to update project:", err);
      alert("Failed to update project. Please try again.");
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

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className={`
                w-[140px] h-[40px] rounded-[3em]
                font-semibold transition-all duration-300
                ${
                  selectedId !== null
                    ? "bg-white text-[var(--palette-deep-blue)] hover:-translate-y-1 shadow-lg cursor-pointer"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }
              `}
              disabled={selectedId === null}
              onClick={handleOpenEditModalClick}
            >
              Edit Project
            </button>

            <button
              type="button"
              className={`
                w-[140px] h-[40px] rounded-[3em]
                font-semibold transition-all duration-300
                ${
                  selectedId !== null
                    ? "bg-white text-red-600 hover:-translate-y-1 shadow-lg cursor-pointer"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }
              `}
              disabled={selectedId === null}
              onClick={handleDelete}
            >
              Delete Project
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="
                w-[160px] h-[40px] rounded-[3em]
                font-semibold
                bg-white
                text-[var(--palette-deep-blue)]
                hover:bg-gradient-to-t
                hover:from-[var(--palette-medium-blue)]
                hover:to-[var(--palette-deep-blue)]
                hover:text-white
                transition-all duration-300
                hover:-translate-y-1
                shadow-lg
                cursor-pointer
              "
            >
              Create Project
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 styled-scrollbar">
          {projects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/60 text-lg">
                No projects found. Create your first project!
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
                  onEdit={handleOpenEditModal}
                  onDelete={(proj) => {
                    setSelectedId(proj.project_id);
                    setTimeout(handleDelete, 0);
                  }}
                  canManage={true}
                />
              ))}
            </section>
          )}
        </div>

        <ProjectDetailsModal
          project={viewProject}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onEdit={handleOpenEditModal}
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
      </div>
    </div>
  );
};

export default ProjectsPage;