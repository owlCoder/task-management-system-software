import React, { useState } from "react";
import "../index.css";
import { ProjectCard } from "../components/projects/ProjectCard";
import { mockProjects } from "../mocks/ProjectsMock";

export const ProjectsPage: React.FC = () => {
  const [projects] = useState(mockProjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const btnBase: React.CSSProperties = {
    minWidth: 120,
    height: 40,
    background: "var(--soft-bg)",
    color: "var(--brand)",           
    border: "1px solid rgba(47,119,255,0.12)",
    padding: "8px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "var(--font-primary)",
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "transform 120ms ease, box-shadow 120ms ease",
  };

  const disabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  };


  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "var(--font-secondary)", fontSize: 34, color: "var(--brand)", margin: 0 }}>Projects</h1>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            style={selectedId ? btnBase : { ...btnBase, ...disabledStyle }}
            aria-disabled={!selectedId}
            onClick={() => {
              if (selectedId) alert(`Edit project ${selectedId}`);
            }}
            title={!selectedId ? "Select a project first" : "Edit selected project"}
          >
            Edit Project
          </button>

          <button
            style={selectedId ? btnBase : { ...btnBase, ...disabledStyle }}
            aria-disabled={!selectedId}
            onClick={() => {
              if (selectedId) alert(`Delete project ${selectedId}`);
            }}
            title={!selectedId ? "Select a project first" : "Delete selected project"}
          >
            Delete Project
          </button>

          <button
            style={btnBase}
            onClick={() => alert("Create Project")}
            title="Create a new project"
          >
            Create Project
          </button>
        </div>
      </header>

      <section
        aria-live="polite"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            selected={String(p.id) === selectedId}
            onSelect={(id) => setSelectedId(String(id))}
            onEdit={(proj) => alert(`Edit ${proj.name}`)}
            onDelete={(proj) => alert(`Delete ${proj.name}`)}
            canManage={true}
          />
        ))}
      </section>
    </div>
  );
};

export default ProjectsPage;