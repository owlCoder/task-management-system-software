import React from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";

type Props = {
  project: ProjectDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: ProjectDTO) => void; 
};

export const ProjectDetailsModal: React.FC<Props> = ({
  project,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (! isOpen || !project) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.  currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e. stopPropagation()}
      >

        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <h2
            id="modal-title"
            className="text-2xl font-semibold text-white m-0 break-words"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            Project Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors duration-150 text-2xl leading-none w-8 h-8 flex items-center justify-center cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>


        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
          {project. imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={project. imageUrl}
                alt={`${project.name} cover`}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Project Name
            </h3>
            <p
              className="text-2xl font-semibold m-0 break-words"
              style={{ fontFamily: "var(--font-secondary)", color: "var(--brand)" }}
            >
              {project.name}
            </p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Description
            </h3>
            <p className="text-base text-gray-700 leading-relaxed break-words whitespace-normal">
              {project.description || "No description available"}
            </p>
          </div>

          {project.members && project.members. length > 0 && (
            <div className="mb-4">
                <h3
                className="text-sm font-semibold text-gray-500 uppercase mb-2"
                style={{ fontFamily: "var(--font-primary)" }}
                >
                Members List
                </h3>
                <div className="flex flex-wrap gap-2">
                {project. members.map((member, index) => (
                    <span 
                    key={index}
                    className="px-3 py-1. 5 rounded-md border border-gray-300 bg-gray-50 text-sm break-all"
                    style={{ fontFamily: "var(--font-primary)" }}
                    >
                    {typeof member === "string" ? member : member.user?.username || "Unknown"}
                    </span>
                ))}
                </div>
            </div>
            )}

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Total arrangement
            </h3>
            <p className="text-base text-gray-700 font-mono break-all" 
            style={{ fontFamily: "var(--font-primary)" }}>{project.totalWeeklyHours}</p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Allowed Budget
            </h3>
            <p className="text-base text-gray-700 font-mono break-all"
            style={{ fontFamily: "var(--font-primary)" }}>${project.allowedBudget}</p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Project ID
            </h3>
            <p className="text-base text-gray-700 font-mono break-all" style={{ fontFamily: "var(--font-primary)" }}>{project.id}</p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Number of Sprints
            </h3>
            <p
              className="text-base text-gray-700 font-mono break-all"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {project.numberOfSprints ?? "Not set"}
            </p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Sprint Duration (days)
            </h3>
            <p
              className="text-base text-gray-700 font-mono break-all"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {project.sprintDuration ?? "Not set"}
            </p>
          </div>

          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-gray-500 uppercase mb-1"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Start Date
            </h3>
            <p
              className="text-base text-gray-700 font-mono break-all"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "Not set"}
            </p>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3 flex-shrink-0 items-center">
            <button
                type="button"
                onClick={() => alert(`Navigate to tasks for: ${project.name}`)}
                className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
                style={{
                background: "var(--brand)",
                color: "white",
                fontFamily: "var(--font-primary)",
                }}
            >
                Tasks
            </button>
            <button
                type="button"
                onClick={() => {
                    if (project && onEdit) {
                      onEdit(project); 
                      onClose();
                    }}}
                className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
                style={{
                background: "var(--soft-bg)",
                color: "var(--brand)",
                fontFamily: "var(--font-primary)",
                }}
            >
                Edit
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;