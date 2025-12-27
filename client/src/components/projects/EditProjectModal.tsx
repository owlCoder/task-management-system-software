import React, { useState, useEffect } from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { mockUsers } from "../../mocks/UsersMock";
import { ProjectStatus } from "../../enums/ProjectStatus";
import { getProjectStatusByDate } from "../../helpers/projectStatusHelper";

type Props = {
  project: ProjectDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProjectDTO) => void;
};

export const EditProjectModal: React.FC<Props> = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProjectDTO | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
      setSelectedMembers(project.members?.map((m) => m.userId) || []);
    }
  }, [project]);

  if (!isOpen || !formData) return null;

  const updateField = (field: keyof ProjectDTO, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const toggleMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const handleSubmit = () => {
    if (!formData) return;

    const members = selectedMembers.map((userId) => {
      const user = mockUsers.find((u) => u.id === userId);
      return {
        id: 0,
        projectId: Number(project?.id) || 0,
        userId,
        hoursPerWeek: 0,
        role: user?.role,
        user: user
          ? {
              user_id: user.id,
              username: user.username,
              email: user.email,
              role_name: user.role,
              profileImage: user.profileImage,
            }
          : undefined,
      };
    });

    const newStatus = getProjectStatusByDate(formData.startDate, formData.status);

    onSave({ ...formData, members, status: newStatus });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          bg-white/10 border border-white/20 rounded-2xl shadow-2xl
          max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-white
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-secondary)" }}>
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form className="p-6 overflow-y-auto flex-1 styled-scrollbar space-y-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">Project Name</h3>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Status</h3>
            <div className="flex flex-wrap gap-4">
              {Object.values(ProjectStatus).map((status) => {
            const start = new Date(formData.startDate || "");
            start.setHours(0,0,0,0);
            const today = new Date(); today.setHours(0,0,0,0);

            let disabled = false;
            if (status === ProjectStatus.NOT_STARTED && start <= today) disabled = true;
            if ((status === ProjectStatus.ACTIVE || status === ProjectStatus.PAUSED || status === ProjectStatus.COMPLETED) && start > today) disabled = true;

            return (
              <label
                key={status}
                className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  disabled={disabled}
                  onChange={() => updateField("status", status)}
                  className="w-4 h-4 accent-white"
                />
                <span className="text-white text-sm">{status}</span>
              </label>
            );
          })}

            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">Project Image</h3>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition">
              <span className="text-white/90">{formData.imageUrl ? "File Selected" : "Choose Image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => updateField("imageUrl", reader.result as string);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </label>
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-2xl" />
            )}
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">Description</h3>
            <textarea
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 min-h-[100px] focus:outline-none"
            />
          </div>

          {[
            ["Total Weekly Hours", "totalWeeklyHours"],
            ["Allowed Budget ($)", "allowedBudget"],
            ["Number of Sprints", "numberOfSprints"],
            ["Sprint Duration (days)", "sprintDuration"],
          ].map(([label, key]) => (
            <div key={key}>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">{label}</h3>
              <input
                type="number"
                value={(formData as any)[key] || ""}
                onChange={(e) => updateField(key as keyof ProjectDTO, e.target.value)}
                onKeyDown={(e) => {
                  const value = (e.currentTarget as HTMLInputElement).value;
                  if (e.key === "+" || e.key === "-") e.preventDefault();
                  if (e.key === "." && value.length === 0) e.preventDefault();
                  if ((key === "numberOfSprints" || key === "sprintDuration") && e.key === ".") e.preventDefault();
                }}
                className="
                  w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                "
              />
            </div>
          ))}

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">Start Date</h3>
            <input
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Members</h3>
            <div className="flex flex-wrap gap-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleMember(user.id)}
                  className={`px-3 py-1 rounded-lg text-sm border transition cursor-pointer ${
                    selectedMembers.includes(user.id) ? "bg-white/20 border-white/80" : "bg-white/10 border-white/20"
                  }`}
                >
                  {user.username}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-lg bg-white/10 border border-white/20 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
