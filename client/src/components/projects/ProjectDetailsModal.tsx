import React from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { getProjectStatusColor } from "../../helpers/projectStatusHelper";

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

        <div className="p-6 overflow-y-auto flex-1 styled-scrollbar">
          {project.imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
              <img
                src={project.imageUrl}
                alt={`${project.name} cover`}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Project Name
            </h3>
            <p className="text-2xl font-semibold break-words">
              {project.name}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Status
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${getProjectStatusColor(project.status!)}`}
              ></span>
              <span className="text-sm font-semibold text-white/90">
                {project.status}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Description
            </h3>
            <p className="text-sm text-white/80 leading-relaxed break-words">
              {project.description || "No description available"}
            </p>
          </div>

          {project.members && project.members.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Members
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.members.map((member, index) => (
                  <span
                    key={index}
                    className="
                      px-3 py-1 rounded-lg
                      bg-white/10
                      border border-white/20
                      text-sm
                    "
                  >
                    {typeof member === "string"
                      ? member
                      : member.user?.username || "Unknown"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {[
            ["Total arrangement", project.totalWeeklyHours],
            ["Allowed Budget", project.allowedBudget && `$${project.allowedBudget}`],
            ["Project ID", project.id],
            ["Number of Sprints", project.numberOfSprints ?? "Not set"],
            ["Sprint Duration (days)", project.sprintDuration ?? "Not set"],
            [
              "Start Date",
              project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "Not set",
            ],
          ].map(([label, value]) => (
            <div key={label as string} className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                {label}
              </h3>
              <p className="text-sm text-white font-mono break-all">
                {value as any}
              </p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => alert(`Navigate to tasks for: ${project.name}`)}
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
            Tasks
          </button>

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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
