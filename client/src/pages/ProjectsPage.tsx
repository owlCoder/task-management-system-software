import React, { useState, useEffect } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetailsModal from "../components/projects/ProjectDetailsModal";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { mockProjects } from "../mocks/ProjectsMock";
import type { ProjectDTO } from "../models/project/ProjectDTO";
import Sidebar from "../components/dashboard/navbar/Sidebar";
import { projectAPI } from "../api/project/ProjectAPI";
import { EditProjectModal } from "../components/projects/EditProjectModal";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<ProjectDTO | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectDTO | null>(null);

  useEffect(() => {
    projectAPI.getAllProjects().then(setProjects);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
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
    if (!selectedId) return;
    const project = projects.find((p) => p.id === selectedId);
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

  const handleCreateProject = async (newProject: Omit<ProjectDTO, "id">) => {
    await projectAPI.createProject(newProject as ProjectDTO);
    const updated = await projectAPI.getAllProjects();
    setProjects(updated);
    alert(`Project "${newProject.name}" created successfully!`);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const projectToDelete = projects.find((p) => p.id === selectedId);
    if (!projectToDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectToDelete.name}"?`
    );
    if (!confirmDelete) return;

    const success = await projectAPI.deleteProject(selectedId);
    if (success) {
      const updated = await projectAPI.getAllProjects();
      setProjects(updated);
      setSelectedId(null);
      alert("Project deleted successfully!");
    }
  };

  const handleUpdateProject = async (updatedProject: ProjectDTO) => {
    await projectAPI.updateProject(updatedProject.id, updatedProject);
    const updated = await projectAPI.getAllProjects();
    setProjects(updated);
    setIsEditModalOpen(false);
    alert(`Project "${updatedProject.name}" updated successfully!`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5">
        <header className="flex items-center justify-between gap-5 mb-6 flex-wrap">
          <h1
            className="m-0 text-2xl md:text-3xl"
            style={{
              fontFamily: "var(--font-secondary)",
              color: "var(--soft-bg)",
              fontWeight: "bold",
            }}
          >
            Projects
          </h1>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-opacity duration-150"
              style={{
                background: selectedId ? "white" : "var(--soft-bg)",
                color: selectedId ? "var(--brand)" : "var(--muted)",
                opacity: !selectedId ? 0.5 : 1,
                pointerEvents: !selectedId ? "none" : "auto",
                fontFamily: "var(--font-primary)",
                margin: "3px",
                borderRadius: "4px",
                height: 30,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "140px",
              }}
              aria-disabled={!selectedId}
              onClick={handleOpenEditModalClick}
              title={
                !selectedId ? "Select a project first" : "Edit selected project"
              }
            >
              Edit Project
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-opacity duration-150"
              style={{
                background: selectedId ? "white" : "var(--soft-bg)",
                color: selectedId ? "var(--brand)" : "var(--muted)",
                opacity: !selectedId ? 0.5 : 1,
                pointerEvents: !selectedId ? "none" : "auto",
                fontFamily: "var(--font-primary)",
                margin: "3px",
                borderRadius: "4px",
                height: 30,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "140px",
              }}
              aria-disabled={!selectedId}
              onClick={handleDelete}
              title={
                !selectedId
                  ? "Select a project first"
                  : "Delete selected project"
              }
            >
              Delete Project
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              style={{
                background: "white",
                color: "var(--brand)",
                fontFamily: "var(--font-primary)",
                margin: "3px",
                borderRadius: "4px",
                height: 30,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "140px",
              }}
            >
              Create Project
            </button>
          </div>
        </header>

        <section
          aria-live="polite"
          className="grid gap-[20px] [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
        >
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              selected={String(p.id) === selectedId}
              onSelect={(id) => handleSelect(String(id))}
              onView={handleViewProject}
              onEdit={(proj) => alert(`Edit ${proj.name}`)}
              onDelete={(proj) => alert(`Delete ${proj.name}`)}
              canManage={true}
            />
          ))}
        </section>

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
