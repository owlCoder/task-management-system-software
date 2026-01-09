import React, { useEffect, useState } from "react";
import { EditTaskModalProps } from "../../types/props";
import { UpdateTaskDTO } from "../../models/task/UpdateTaskDTO";
import { TaskAPI } from "../../api/task/TaskAPI";
import { UserAPI } from "../../api/users/UserAPI";
import { UserDTO } from "../../models/users/UserDTO";
import { TaskStatus } from "../../enums/TaskStatus";
import StatusDropdown from "./StatusDropdown";
import toast from "react-hot-toast";

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  onClose,
  task,
  token,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.CREATED);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const userAPI = new UserAPI();

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.task_description);
      setEstimatedCost(task.estimated_cost ?? 0);
      setStatus(task.task_status as TaskStatus);
      setAssignedTo(task.worker_id);
    }
  }, [task, open]);

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const fetchedUsers = await userAPI.getAllUsers(token);
          setUsers(fetchedUsers);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };
      fetchUsers();
    }
  }, [open, token]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const payload: UpdateTaskDTO = {
      title,
      description,
      estimatedCost,
      status,
      assignedTo,
    };

    try {
      setLoading(true);
      await api.updateTask(task.task_id, payload);
      toast.success("Task updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl
                   max-w-2xl w-full max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 bg-white/5">
          <div className="flex flex-col gap-1 max-w-[60%]">
            <h2 className="text-xl font-bold text-white">Edit Task</h2>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
              Task ID: #{task.task_id}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mr-2">
              Status
            </label>
            <StatusDropdown currentStatus={status} onStatusChange={setStatus} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Title Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Title
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full
                bg-black/30
                border border-white/10
                rounded-lg
                p-3
                text-sm text-white
                outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
              placeholder="Enter task title..."
            />
          </div>

          {/* Description Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Description
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="
                w-full
                bg-black/30
                border border-white/10
                rounded-lg
                p-3
                text-sm text-white
                outline-none
                focus:ring-2 focus:ring-blue-500/40
                resize-none
              "
              placeholder="Enter task description..."
            />
          </div>

          {/* Estimated Cost Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Estimated Cost
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-lg">$</span>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="
                  flex-1
                  bg-black/30
                  border border-white/10
                  rounded-lg
                  p-3
                  text-lg font-bold text-white
                  outline-none
                  focus:ring-2 focus:ring-blue-500/40
                "
                placeholder="0"
              />
            </div>
          </div>

          {/* Assigned To Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Assign To
            </h3>
            <select
              value={assignedTo ?? ""}
              onChange={(e) =>
                setAssignedTo(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="
                w-full
                bg-black/30
                border border-white/10
                rounded-lg
                p-3
                text-sm text-white
                outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Task Info Display */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Task Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-white/50">Total Hours:</span>
                <span className="ml-2 text-white font-semibold">
                  {task.total_hours_spent ?? 0}h
                </span>
              </div>
              <div>
                <span className="text-white/50">Sprint ID:</span>
                <span className="ml-2 text-white font-semibold">
                  #{task.sprint_id ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold
                       bg-white/10 border border-white/20
                       hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer 
                       bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] 
                       disabled:opacity-80 hover:scale-[1.02] transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
