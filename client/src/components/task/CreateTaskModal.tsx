import React, { useState, useEffect } from "react";
import { CreateTaskModalProps } from "../../types/props";
import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { TaskAPI } from "../../api/task/TaskAPI";
import { UserAPI } from "../../api/users/UserAPI";
import { UserDTO } from "../../models/users/UserDTO";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  projectId,
  token,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const userAPI = new UserAPI();

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

    const payload: CreateTaskDTO = {
      title,
      description,
      estimatedCost,
      projectId: Number(projectId),
      assignedTo: assignedTo,
    };

    try {
      setLoading(true);
      await api.createTask(payload);
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-[400px] shadow-xl text-white">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        {/* Title */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Estimated Cost */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Estimated Cost (¥)</label>
          <input
            type="number"
            className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(Number(e.target.value))}
          />
        </div>

        {/* Assigned To */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Assign To</label>
          <select
            className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
            value={assignedTo ?? ""}
            onChange={(e) =>
              setAssignedTo(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
