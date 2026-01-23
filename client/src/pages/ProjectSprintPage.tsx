import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { sprintAPI } from "../api/sprint/SprintAPI";
import type { SprintDTO } from "../models/sprint/SprintDto";
import { useAuth } from "../hooks/useAuthHook";
import toast from "react-hot-toast";
import { confirmToast } from "../components/toast/toastHelper";
import CreateSprintModal from "../components/sprints/CreateSprintModal";

const canManageSprints = (role?: string): boolean => {
  return role === "Project Manager";
};

const ProjectSprintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();

  const projectIdNum = projectId ? Number(projectId) : undefined;

  const [sprints, setSprints] = useState<SprintDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const reloadSprints = async () => {
    if (
      projectIdNum === undefined ||
      projectIdNum === null ||
      Number.isNaN(projectIdNum)
    ) {
      setError("Project is not selected. Go back to Projects and select one.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await sprintAPI.getSprintsByProject(projectIdNum);
      setSprints(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load sprints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedSprintId(null);
    reloadSprints();
  }, [projectIdNum]);

  const openTasks = (sprintId: number) => {
    if (!projectIdNum) return;
    navigate(`/projects/${projectIdNum}/sprints/${sprintId}/tasks`);
  };

  const handleDeleteSprint = async () => {
    if (!selectedSprintId) return;

    const sprint = sprints.find((x) => x.sprint_id === selectedSprintId);
    const ok = await confirmToast(
      `Are you sure you want to delete "${sprint?.sprint_title ?? "this sprint"}"?`
    );
    if (!ok) return;

    try {
      await sprintAPI.deleteSprint(selectedSprintId);
      toast.success("Sprint deleted successfully!");
      setSelectedSprintId(null);
      await reloadSprints();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete sprint.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading sprints...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-red-400 text-xl text-center">{error}</div>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Back to Projects
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
          <h1 className="text-3xl md:text-4xl font-bold text-white">Sprints</h1>

          <div className="flex gap-2 flex-wrap">
            {canManageSprints(user?.role) && (
              <>
                <button
                  type="button"
                  onClick={handleDeleteSprint}
                  disabled={selectedSprintId === null}
                  className={`group w-[140px] h-[40px] rounded-[3em] flex items-center justify-center gap-[8px]
                    font-semibold transition-all duration-500
                    ${
                      selectedSprintId !== null
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
                    Delete Sprint
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
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
                    className="w-4 h-4 text-white transition-all duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="transition-colors duration-300">
                    Create Sprint
                  </span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="
                group w-[180px] h-[40px] rounded-[3em]
                flex items-center justify-center gap-[10px]
                bg-white/10 backdrop-blur-xl border border-white/15
                text-white/80 font-semibold
                transition-all duration-500
                hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)]
                hover:text-white hover:-translate-y-1
                shadow-lg cursor-pointer
              "
            >
              <svg
                className="w-4 h-4 text-white/60 group-hover:text-white transition-all duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>

              <span className="transition-colors duration-300">
                Back to Projects
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 styled-scrollbar">
          {sprints.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/60 text-lg">No sprints found.</p>
            </div>
          ) : (
            <section className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
              {sprints.map((s) => {
                const selected = selectedSprintId === s.sprint_id;

                return (
                  <button
                    key={s.sprint_id}
                    type="button"
                    onClick={() =>
                      setSelectedSprintId((prev) =>
                        prev === s.sprint_id ? null : s.sprint_id
                      )
                    }
                    onDoubleClick={() => openTasks(s.sprint_id)}
                    className={`text-left bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition shadow-lg
                      ${selected ? "ring-2 ring-white/40" : ""}
                    `}
                    title="Click to select. Double click to open tasks."
                  >
                    <div className="text-white font-semibold text-lg">
                      {s.sprint_title}
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {s.sprint_description}
                    </div>
                    <div className="text-white/50 text-xs mt-3">
                      {String(s.start_date)} — {String(s.end_date)}
                    </div>

                    <div className="mt-4">
                      <span className="text-white/70 text-xs">
                        {selected ? "Selected" : "Double click to open tasks"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </section>
          )}
        </div>
      </div>

      <CreateSprintModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectIdNum as number}
        onCreated={reloadSprints}
      />
    </div>
  );
};

export default ProjectSprintsPage;
