import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { sprintAPI } from "../api/sprint/SprintAPI";
import type { SprintDTO } from "../models/sprint/SprintDto";

const ProjectSprintsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const projectId = (location.state as any)?.projectId as number | undefined;

  const [sprints, setSprints] = useState<SprintDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (projectId === undefined || projectId === null) {
        setError("Project is not selected. Go back to Projects and select one.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await sprintAPI.getSprintsByProject(projectId);
        setSprints(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load sprints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const openTasks = (sprintId: number) => {
    navigate("/tasks", { state: { sprintId, projectId } });
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

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white/80 hover:text-white hover:bg-white/15 transition"
          >
            Back to Projects
          </button>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 styled-scrollbar">
          {sprints.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/60 text-lg">No sprints found.</p>
            </div>
          ) : (
            <section className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
              {sprints.map((s) => (
                <button
                  key={s.sprint_id}
                  type="button"
                  onClick={() => openTasks(s.sprint_id)}
                  className="text-left bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition shadow-lg"
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
                </button>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSprintsPage;
