import React, { useState, useEffect } from "react";
import { CreateTaskModalProps } from "../../types/props";
import { CreateTaskDTO } from "../../models/task/CreateTaskDTO";
import { TaskAPI } from "../../api/task/TaskAPI";
import toast from "react-hot-toast";
import { projectAPI } from "../../api/project/ProjectAPI";
import { ProjectUserDTO } from "../../models/project/ProjectUserDTO";
import { TaskTemplateAPI } from "../../api/template/TaskTemplateAPI";
import { TaskTemplateDTO } from "../../models/task/TaskTemplateDTO";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  projectId,
  token,
  sprintId,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<ProjectUserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<TaskTemplateDTO[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");

  const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const templateApi = new TaskTemplateAPI(import.meta.env.VITE_GATEWAY_URL, token);

  const normalizeRole = (role?: string | null) =>
    role ? role.trim().toUpperCase().replace(/[\s_-]+/g, "") : "";

  const isProjectManager = (role?: string | null) =>
    normalizeRole(role) === "PROJECTMANAGER";

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const fetchedUsers = await projectAPI.getProjectUsers(Number(projectId));
          setUsers(fetchedUsers);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };
      fetchUsers();
    }
  }, [open, token]);

  useEffect(() => {
    if (!open) return;

    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await templateApi.getTemplates();
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setTemplates([]);
      }
    };

    fetchTemplates();
  }, [open, token]);

  if (!open) return null;

  const selectedTemplate =
    selectedTemplateId !== ""
      ? templates.find((template) => template.template_id === selectedTemplateId) ?? null
      : null;

  const handleTemplateChange = (value: string) => {
    if (!value) {
      setSelectedTemplateId("");
      return;
    }

    const templateId = Number(value);
    setSelectedTemplateId(templateId);
    const template = templates.find((item) => item.template_id === templateId);
    if (template) {
      setTitle(template.template_title);
      setDescription(template.template_description);
      setEstimatedCost(template.estimated_cost);
    }
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a task title!");
      return;
    }

    if (!trimmedDesc) {
      toast.error("Please enter a task description!");
      return;
    }

    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      toast.error("Estimated cost must be a valid number (>= 0).");
      return;
    }

    if (!assignedTo) {
      toast.error("Please assign the task to a worker.");
      return;
    }

    const selectedUser = users.find((u) => u.user_id === assignedTo);

    if (isProjectManager(selectedUser?.role_name)) {
      toast.error("Task can only be assigned to workers.");
      return;
    }
    
    const payload: CreateTaskDTO = {
      title: trimmedTitle,
      description: trimmedDesc,
      estimatedCost,
      projectId: Number(projectId),
      assignedTo,
    };

    try {
      setLoading(true);

      if (!sprintId || !Number.isFinite(Number(sprintId))) {
        toast.error("Sprint is not selected!");
        return;
      }

      await api.createTask(Number(sprintId), payload);
      toast.success("Task created successfully!");
      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
      toast.error((err as any)?.message ?? "Failed to create task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-[400px] shadow-xl text-white">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        {/* Template */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Template</label>
          <select
            className="w-full p-2 bg-slate-900/50 border border-white/20 rounded-lg text-white outline-none"
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="" className="bg-slate-900">
              No template
            </option>
            {templates.map((template) => (
              <option
                key={template.template_id}
                value={template.template_id}
                className="bg-slate-900"
              >
                {template.template_title}
              </option>
            ))}
          </select>
          {!templates.length && (
            <p className="text-xs text-white/50 mt-1">No templates available.</p>
          )}
        </div>

        {selectedTemplate && (
          <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/70">
            <p className="uppercase tracking-wider text-[10px] text-white/40">
              Template details
            </p>
            <div className="mt-2 flex flex-col gap-1">
              <span>
                Attachment type:{" "}
                <span className="text-white/90">{selectedTemplate.attachment_type}</span>
              </span>
              <span>
                Dependencies:{" "}
                <span className="text-white/90">
                  {selectedTemplate.dependencies.length
                    ? selectedTemplate.dependencies
                        .map((dep) => `#${dep.depends_on_template_id}`)
                        .join(", ")
                    : "None"}
                </span>
              </span>
            </div>
          </div>
        )}

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
          <label className="block text-sm mb-1">Assign To Worker</label>
          <select
            className="w-full p-2 bg-slate-900/50 border border-white/20 rounded-lg text-white outline-none"
            value={assignedTo ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setAssignedTo(undefined);
                return;
              }

              const userId = Number(value);
              const selected = users.find((user) => user.user_id === userId);
              if (isProjectManager(selected?.role_name)) {
                toast.error("Task can only be assigned to workers.");
                setAssignedTo(undefined);
                return;
              }

              setAssignedTo(userId);
            }}
          >
            <option value="" className="bg-slate-900">Unassigned</option>
            {users.map((user) => (
              <option
                key={user.user_id}
                value={user.user_id}
                className="bg-slate-900"
                disabled={isProjectManager(user.role_name)}
              >
                {user.username} ({user.role_name})
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
