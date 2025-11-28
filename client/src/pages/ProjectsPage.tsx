import React, { useState } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import { mockProjects } from "../mocks/ProjectsMock";

export const ProjectsPage: React.FC = () => {
  const [projects] = useState(mockProjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="px-6 sm:px-8 lg:px-12 max-w-7xl py-6 m-[15px]">
      <header className="flex items-center justify-between gap-5 mb-6 flex-wrap">
        <h1
          className="m-0 text-2xl md:text-3xl"
          style={{ fontFamily: "var(--font-secondary)" ,color: "var(--brand)"}}
        >
          Projects
        </h1>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-opacity duration-150"
            style={{
              background: selectedId ? "var(--brand)" : "var(--soft-bg)",
              color: selectedId ? "white" : "var(--muted)",
              opacity: !selectedId ? 0.5 : 1,
              pointerEvents: !selectedId ? "none" : "auto",
              fontFamily: "var(--font-primary)",
              margin: "3px",
              borderRadius: "4px",
              height: 30,
              cursor: "pointer"
          
            }}
            aria-disabled={!selectedId}
            onClick={() => selectedId && alert(`Edit project ${selectedId}`)}
          >
            Edit Project
          </button>


          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-opacity duration-150"
            style={{
              background: selectedId ? "var(--brand)" : "var(--soft-bg)",
              color: selectedId ? "white" : "var(--muted)",
              opacity: !selectedId ? 0.5 : 1,
              pointerEvents: !selectedId ? "none" : "auto",
              fontFamily: "var(--font-primary)",
              margin: "3px",
              borderRadius: "4px",
              height: 30,
              cursor: "pointer"
          
            }}
            aria-disabled={!selectedId}
            onClick={() => selectedId && alert(`Delete project ${selectedId}`)}
            title={!selectedId ? "Select a project first" : "Delete selected project"}
          >
            Delete Project
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm  focus:outline-none focus:ring-2 focus:ring-accent/30 transition-opacity duration-150"
            style={{
              background: "var(--brand)",
              color: "white",
              fontFamily: "var(--font-primary)",
              margin: "3px",
              borderRadius: "4px",
              height: 30,
              cursor: "pointer"
          
            }}
            onClick={() => {
              setSelectedId(null); 
              alert("Create Project");
            }}
            title="Create a new project"
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
            onView={(proj) => alert(`View ${proj.name}`)}
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
