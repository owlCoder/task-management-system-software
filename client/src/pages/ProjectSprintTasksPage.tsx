import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskPage from "./TaskPage";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const ProjectSprintTasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, sprintId } = useParams();
  console.log("ProjectSprintTasksPage rendered with params:", { projectId, sprintId });


  if (!projectId || !sprintId) {
    return (
      <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-red-400 text-xl text-center">
            Missing projectId or sprintId in URL.
          </div>
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

  return <TaskPage projectId={projectId} />;
};

export default ProjectSprintTasksPage;
