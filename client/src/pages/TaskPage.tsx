import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import TaskListItem from "../components/task/TaskListItem";
import TaskListPreview from "../components/task/TaskListPreview";
import { TaskDTO } from "../models/task/TaskDTO";
import { ProjectUserDTO } from "../models/project/ProjectUserDTO";
import { TaskAPI } from "../api/task/TaskAPI";
import { projectAPI } from "../api/project/ProjectAPI";
import CreateTaskModal from "../components/task/CreateTaskModal";
import EditTaskModal from "../components/task/EditTaskModal";
import TaskSearchBar from "../components/task/TaskSearchBar";
import TaskStatusFilter from "../components/task/TaskStatusFilter";
import TaskSortSelect from "../components/task/TaskSortSelect";
import { SortOption } from "../types/SortOption";
import { TaskDetailPage } from "./TaskDetailPage";
import TaskBoardListPreview from "../components/task/TaskBoardListPreview";
import { UpdateTaskDTO } from "../models/task/UpdateTaskDTO";
import { TaskStatus } from "../enums/TaskStatus";
import { TaskListPageProps } from "../types/props";
import { useAuth } from "../hooks/useAuthHook";

const TaskPage: React.FC<TaskListPageProps> = ({ projectId }) => {
  const { token } = useAuth();
  if (!token) return null;

  const { projectId: projectIdParam, sprintId } = useParams();
  const effectiveProjectId = projectId && projectId.trim() !== "" ? projectId : (projectIdParam ?? "");
  const sprintIdNum = sprintId ? Number(sprintId) : null;
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [users, setUsers] = useState<ProjectUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedtaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("NEWEST");
  const [showBoard, setShowBoard] = useState(false);
  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const selectedTask = tasks.find((t) => t.task_id === selectedtaskId);

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((t) => t.task_id === taskId);
    if (!taskToUpdate) return;

    const payload: UpdateTaskDTO = {
      status: newStatus,
    };

    const originalTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.task_id === taskId ? { ...t, task_status: newStatus } : t
      )
    );

    try {
      await api.updateTask(taskId, payload);
    } catch (err) {
      console.error("Failed to update status on server", err);
      setTasks(originalTasks);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const title =
        typeof task.title === "string"
          ? task.title
          : typeof (task as any).name === "string"
          ? (task as any).name
          : "";

      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter
        ? task.task_status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "TITLE_ASC":
          return a.title.localeCompare(b.title);

        case "TITLE_DESC":
          return b.title.localeCompare(a.title);

        case "STATUS":
          return a.task_status.localeCompare(b.task_status);

        case "NEWEST":
        default:
          return (
            new Date(b.total_hours_spent ?? 0).getTime() -
            new Date(a.total_hours_spent ?? 0).getTime()
          );
      }
    });

  useEffect(() => {
    const load = async () => {
      try {
        if(!effectiveProjectId){
          setTasks([]);
          setUsers([]);
          setLoading(false);
          return;
        }
        const [tasksData, usersData] = await Promise.all([
          sprintIdNum
            ? api.getTasksBySprint(sprintIdNum)
            : api.getTasksByProject(effectiveProjectId),
          projectAPI.getProjectUsers(Number(effectiveProjectId))
        ]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setTasks(
          []
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [effectiveProjectId, sprintIdNum, token]);

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
        <div className={`w-full ${showBoard ? 'max-w-none' : 'max-w-4xl'} mx-auto flex flex-col h-full transition-all duration-300`}>
          <header className="flex flex-col gap-4 mb-6 flex-shrink-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Tasks
            </h1>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="w-full lg:flex-1">
                <TaskSearchBar value={search} onChange={setSearch} />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="
                group
                w-[48px] sm:w-[140px] h-[48px] sm:h-[50px]
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

                  <span className="hidden sm:inline font-semibold text-white/60 group-hover:text-white transition-colors duration-300 text-base">
                    Create Task
                  </span>
                </button>

                <button
                  type="button"
                  className={`
                    w-[140px] h-[50px] rounded-[3em] flex items-center justify-center 
                    transition-all duration-500 border border-white/15 shadow-lg hover:-translate-y-1
                    ${
                      showBoard
                        ? "bg-red-500/20 hover:bg-red-500/40"
                        : "bg-white/10 hover:bg-white/20"
                    }
                  `}
                  onClick={() => setShowBoard(!showBoard)}
                >
                  <span className="font-semibold text-white text-base">
                    {showBoard ? "Close Board" : "Show Board"}
                  </span>
                </button>

                <TaskStatusFilter
                  value={statusFilter}
                  onChange={setStatusFilter}
                />

                <TaskSortSelect
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                />
              </div>
            </div>
          </header>

          {selectedtaskId !== null && (
            <TaskDetailPage
              taskId={selectedtaskId}
              token={token}
              setClose={() => setSelectedTaskId(null)}
              onEdit={() => {
                setEditOpen(true);
              }}
            />
          )}

          <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 flex-1 overflow-y-auto styled-scrollbar">
            {showBoard ? (
              <TaskBoardListPreview
                tasks={filteredAndSortedTasks}
                onSelect={setSelectedTaskId}
                selectedTaskId={selectedtaskId}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <>
                {filteredAndSortedTasks.length === 0 &&
                search.trim() === "" &&
                !statusFilter ? (
                  <TaskListPreview tasks={filteredAndSortedTasks}  onSelect={setSelectedTaskId} />
                ) : filteredAndSortedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/40">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-lg">
                      {search.trim() !== ""
                        ? `No tasks found matching "${search}"`
                        : statusFilter
                        ? `No tasks with this status`
                        : "No tasks available"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredAndSortedTasks.map((task) => (
                      <TaskListItem
                        key={task.task_id}
                        task={task}
                        onSelect={() => setSelectedTaskId(task.task_id)}
                        onStatusChange={handleStatusChange}
                        users={users}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={effectiveProjectId}
        token={token}
      />

      {editOpen && selectedTask && (
        <EditTaskModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          task={selectedTask}
          token={token}
          projectId={Number(effectiveProjectId)}
        />
      )}
    </div>
  );
};

export default TaskPage;
