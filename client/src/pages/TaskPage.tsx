import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import TaskListItem from "../components/task/TaskListItem";
import TaskListPreview from "../components/task/TaskListPreview";
import { TaskDTO } from "../models/task/TaskDTO";
import { TaskAPI } from "../api/task/TaskAPI";
import CreateTaskModal from "../components/task/CreateTaskModal";
import EditTaskModal from "../components/task/EditTaskModal";
import { mockTasks } from "../mocks/TaskMock";
import TaskSearchBar from "../components/task/TaskSearchBar";
// import { TaskDetailPage } from "./TaskDetailPage";
// import EditTaskModal from "../components/task/EditTaskModal";

interface TaskListPageProps {
  projectId: string;
  token: string;
}

const TaskPage: React.FC<TaskListPageProps> = ({ projectId, token }) => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedtaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);

  const filteredTasks = (tasks.length > 0 ? tasks : mockTasks).filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getTasksByProject(projectId);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setTasks(mockTasks);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  // useEffect(() => {
  //   console.log("SELECTED TASK ID STATE:", selectedtaskId);
  // }, [selectedtaskId]);

  if (loading) {
    return <div className="text-white p-6">Loading tasks...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main
        className="flex-1 p-6 flex flex-col overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedTaskId(null);
          }
        }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <header className="flex items-center justify-between gap-4 mb-6 flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
              Tasks
            </h1>

            <TaskSearchBar value={search} onChange={setSearch} />

            <div className="flex gap-2">
              <button
                type="button"
                className="
                group
                w-[140px] h-[50px]
                rounded-[3em]
                flex items-center justify-center gap-[12px]
                bg-white/10 backdrop-blur-xl
                transition-all duration-500
                hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)]
                border border-white/15 shadow-lg
                hover:-translate-y-1
                cursor-pointer
              "
                onClick={() => setOpen(true)}
              >
                <svg
                  className="w-5 h-5 text-white/60 group-hover:text-white transform transition-transform duration-300 group-hover:scale-110"
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

                <span className="font-semibold text-white/60 hover:text-white transition-colors duration-300 text-base">
                  Create Task
                </span>
              </button>

              <button
                type="button"
                className="
                  group
                  w-[140px] h-[50px]
                  rounded-[3em]
                  flex items-center justify-center gap-[12px]
                  bg-white/10 backdrop-blur-xl
                  transition-all duration-500
                  hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)]
                  border border-white/15 shadow-lg
                  hover:-translate-y-1
                  cursor-pointer
                  disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:bg-white/5 disabled:border-white/5 disabled:shadow-none
                "
                onClick={() => setEditOpen(true)}
                disabled={selectedtaskId === null}
              >
                <svg
                  className="w-5 h-5 text-white/60 group-hover:text-white transform transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>

                <span className="font-semibold text-white/60 hover:text-white transition-colors duration-300 text-base">
                  Edit Task
                </span>
              </button>
            </div>
          </header>

          <section
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex-1 overflow-y-auto styled-scrollbar"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedTaskId(null);
              }
            }}
          >
            {search && filteredTasks.length === 0 ? (
              <div className="text-center text-white/50 py-12">
                <p>No tasks found matching "{search}"</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <TaskListPreview onSelect={setSelectedTaskId} />
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTasks.map((task) => (
                  <TaskListItem
                    onSelect={setSelectedTaskId}
                    key={task.task_id}
                    task={task}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        token={token}
      />

      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={(() => {
          if (selectedtaskId !== null) {
            const real = tasks.find((t) => t.task_id === selectedtaskId);
            if (real) return real;
            const mock = mockTasks.find((t) => t.task_id === selectedtaskId);
            if (mock) return mock;
          }
          return tasks[0] ?? mockTasks[0];
        })()}
        token={token}
      />
    </div>
  );
};

export default TaskPage;
