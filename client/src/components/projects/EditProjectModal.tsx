import React, { useState, useEffect } from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { mockUsers } from "../../mocks/UsersMock";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const members = selectedMembers.map((userId) => {
      const user = mockUsers.find((u) => u.id === userId);
      return {
        id: 0,
        projectId: Number(project?.id) || 0,
        userId,
        hoursPerWeek: 0,
        role: user?.role || undefined,
        user: user ? { ...user, user_id: user.id } : undefined,
      };
    });
    onSave({ ...formData, members });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <h2
            id="edit-modal-title"
            className="text-2xl font-semibold text-white m-0"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            Edit Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white text-2xl w-8 h-8 flex items-center justify-center hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto overflow-x-hidden flex-1 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Project Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-24"
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Image URL</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.imageUrl || ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Total Weekly Hours</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.totalWeeklyHours || 0}
              onChange={(e) => updateField("totalWeeklyHours", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Allowed Budget ($)</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.allowedBudget || 0}
              onChange={(e) => updateField("allowedBudget", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Number of Sprints</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.numberOfSprints || ""}
              onChange={(e) => updateField("numberOfSprints", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Sprint Duration (days)</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.sprintDuration || ""}
              onChange={(e) => updateField("sprintDuration", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Members</label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              {mockUsers.map((user) => (
                <label key={user.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: "var(--brand)" }}
                  />
                  <span className="text-sm text-gray-700">{user.username}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3 items-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--brand)", color: "white" }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--soft-bg)", color: "var(--brand)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
