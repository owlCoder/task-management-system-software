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
  const rootStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 320,
    background: "var(--bg)",
    border: `1px solid rgba(47,119,255,0.12)`,
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    cursor: "pointer",
    userSelect: "none",
    transition: "box-shadow 180ms ease, transform 140ms ease",
    boxShadow: selected ? "0 8px 24px rgba(47,119,255,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
    transform: selected ? "translateY(-4px)" : undefined,
    fontFamily: "var(--font-primary)",
  };

  const innerStyle: React.CSSProperties = {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const imageAreaStyle: React.CSSProperties = {
    width: "100%",
    height: 110,
    borderRadius: 8,
    overflow: "hidden",
    background: "var(--soft-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: "var(--font-secondary)",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--brand)",
  };

  const descStyle: React.CSSProperties = {
    margin: 0,
    color: "var(--muted)",
    fontSize: 13,
    lineHeight: 1.3,
    fontFamily: "var(--font-primary)",
  };

  const membersStyle: React.CSSProperties = {
    color: "var(--muted)",
    fontSize: 13,
    marginTop: 6,
    fontFamily: "var(--font-primary)",
  };

  const separatorStyle: React.CSSProperties = {
    height: 1,
    background: "rgba(0,0,0,0.06)",
    width: "100%",
  };

  const actionStripStyle: React.CSSProperties = {
    background: "var(--accent)",
    color: "#fff",
    textAlign: "center",
    padding: "12px 8px",
    fontFamily: "var(--font-secondary)",
    fontSize: 15,
    fontWeight: 600,
    cursor: "default", // promenicemo
    userSelect: "none",
  };

  return (
    <article
      style={rootStyle}
      onClick={() => onSelect?.(String(project.id))}
      role="button"
      tabIndex={0}
      aria-labelledby={`project-${project.id}-title`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect?.(String(project.id));
      }}
    >
      <div style={innerStyle}>
        <div style={imageAreaStyle} aria-hidden>
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={`${project.name} cover`} style={imageStyle} />
          ) : (
            <div style={{ color: "var(--muted)", fontSize: 14, fontFamily: "var(--font-primary)" }}>slika</div>
          )}
        </div>

        <div>
          <h3 id={`project-${project.id}-title`} style={titleStyle}>
            {project.name}
          </h3>

          <p style={descStyle}>{project.description ?? "No description"}</p>

          <div style={membersStyle}>{(project.members ?? []).length} members</div>
        </div>
      </div>

      <div style={separatorStyle} />
      
      {/*Otvorice se prozor za detalje*/}
      <div
        style={actionStripStyle}
        aria-label={`View ${project.name} (not implemented)`}
        role="presentation"
      >
        View Project
      </div>
    </article>
  );
};

export default ProjectCard;