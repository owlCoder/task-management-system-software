import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/navbar/Sidebar";
import TaskListItem from "../components/task/TaskListItem";
import TaskListPreview from "../components/task/TaskListPreview";
import { TaskDTO } from "../models/task/TaskDTO";
import { TaskAPI } from "../api/task/TaskAPI";
import CreateTaskModal from "../components/task/CreateTaskModal";

interface TaskListPageProps {
  projectId: string;
  token: string;
}

const TaskPage: React.FC<TaskListPageProps> = ({ projectId, token }) => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getTasksByProject(projectId);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  if (loading) {
    return <div className="text-white p-6">Loading tasks...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <header className="flex items-center justify-between mb-6 flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Tasks</h1>

            <div className="flex gap-2">
              <button
                type="button"
                className="
                group
                w-[140px] h-[50px]
                rounded-[3em]
                flex items-center justify-center gap-[12px]
                bg-white
                transition-all duration-500
                hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)]
                border border-white/15 shadow-lg
                hover:-translate-y-1
                cursor-pointer
              "
                onClick={() => setOpen(true)}
              >
                <svg
                  className="w-5 h-5 text-[var(--palette-deep-blue)] group-hover:text-white transform transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                </svg>

                <span className="font-semibold bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] bg-clip-text text-transparent group-hover:text-white transition-colors duration-300 text-base">
                  Create Task
                </span>
              </button>

              <CreateTaskModal
                open={open}
                onClose={() => setOpen(false)}
                projectId={projectId}
                token={token}
              />
            </div>
          </header>

          <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex-1 overflow-y-auto styled-scrollbar">
            {tasks.length === 0 ? (
              <TaskListPreview />
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <TaskListItem key={task.task_id} task={task} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default TaskPage;
