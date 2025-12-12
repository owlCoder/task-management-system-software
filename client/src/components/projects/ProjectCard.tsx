import React from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";

type Props = {
  project: ProjectDTO;
  selected?:  boolean;
  onSelect?: (id: string) => void;
  onView?: (p: ProjectDTO) => void;
  onEdit?: (p: ProjectDTO) => void;
  onDelete?:  (p: ProjectDTO) => void;
  canManage?: boolean;
};

export const ProjectCard: React.FC<Props> = ({
  project,
  selected = false,
  onSelect,
  onView,
}) => {
  const handleRootKeyDown = (e: React. KeyboardEvent) => {
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

  const selectedBoxShadow = selected ?  "0 11px 11px var(--brand)" : undefined;

  return (
    <article
      className={
        `w-full max-w-xs bg-white overflow-hidden flex flex-col box-border select-none transform transition-all duration-200 ease-out
         cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-xl
         ${selected ?  "-translate-y-1 shadow-2xl ring-2 ring-accent/30" : "hover:-translate-y-1 hover:shadow-xl"}`
      }
      onClick={() => onSelect?.(String(project.id))}
      role="button"
      tabIndex={0}
      onKeyDown={handleRootKeyDown}
      style={{ boxShadow:  selectedBoxShadow }}
    >

      <div className="p-3 flex flex-col gap-3 flex-1 min-h-0">
        <div
          className="w-full h-28 rounded-lg overflow-hidden flex items-center justify-center"
          aria-hidden
        >
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`${project.name} cover`}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          ) : (
            <div className="text-muted text-sm">Photo</div>
          )}
        </div>

        <div className="m-[15px]">
          <h3
            id={`project-${project.id}-title`}
            className="m-0 text-brand text-base md:text-lg"
          >
            {project.name}
          </h3>

          <p className="mt-2 text-muted text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="8" r="4"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
            </svg> 
            {(project.members ??  []).length} {(project.members ?? []).length === 1 ? "member" : "members"}
          </p>
          
          <p className="mt-1 text-muted text-sm leading-tight break-words whitespace-normal">
            {project.description ?? "No description"}
          </p>
          
        </div>
      </div>

      <div
        className="text-center text-base font-semibold select-none cursor-pointer flex items-center justify-center rounded-b-xl"
        role="button"
        tabIndex={0}
        aria-label={`View ${project.name}`}
        onClick={handleViewClick}
        onKeyDown={handleViewKeyDown}
        style={{height: 40, background: "var(--accent)", fontFamily: "var(--font-secondary)", color: "white"}}
      >
        View Project
      </div>
    </article>
  );
};

export default ProjectCard;