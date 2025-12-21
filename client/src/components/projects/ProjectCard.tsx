import React from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";

type Props = {
  project: ProjectDTO;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onView?: (p: ProjectDTO) => void;
  onEdit?: (p: ProjectDTO) => void;
  onDelete?: (p: ProjectDTO) => void;
  canManage?: boolean;
};

export const ProjectCard: React.FC<Props> = ({
  project,
  selected = false,
  onSelect,
  onView,
}) => {
  const handleRootKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(String(project.id));
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
          selected
            ? "ring-2 ring-[var(--accent)]/50 shadow-2xl -translate-y-1"
            : "hover:-translate-y-1 hover:shadow-xl"
        }
      `}
      onClick={() => onSelect?.(String(project.id))}
      role="button"
      tabIndex={0}
      onKeyDown={handleRootKeyDown}
    >
      <div className="p-4 pb-0">
        <div className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center bg-white/5">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`${project.name} cover`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-muted text-sm">No image</span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          id={`project-${project.id}-title`}
          className="text-white text-lg md:text-xl font-semibold tracking-wide"
        >
          {project.name}
        </h3>

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
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 1 0-16 0" />
          </svg>
          {(project.members ?? []).length}{" "}
          {(project.members ?? []).length === 1 ? "member" : "members"}
        </p>

        <p className="text-white text-muted text-sm leading-snug line-clamp-3">
          {project.description ?? "No description"}
        </p>
      </div>
      
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
        aria-label={`View ${project.name}`}
        onClick={handleViewClick}
        onKeyDown={handleViewKeyDown}
      >
        View Project
      </div>
    </article>
  );
};

export default ProjectCard;
