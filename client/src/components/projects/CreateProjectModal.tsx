import React, { useState } from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { mockUsers } from "../../mocks/UsersMock";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<ProjectDTO, "id">) => void;
};

export const CreateProjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    totalWeeklyHours: 0,
    allowedBudget: 0,
  });
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const [errors, setErrors] = useState({
    name: "",
    totalWeeklyHours: "",
    allowedBudget: "",
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e. currentTarget) {
      handleClose(); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose(); 
    }
  };

  const toggleMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev. filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      totalWeeklyHours: "",
      allowedBudget: "",
    };

    if (!formData.name.  trim()) {
      newErrors.  name = "Project name is required";
    }

    if (formData.totalWeeklyHours <= 0) {
      newErrors.totalWeeklyHours = "Hours must be positive";
    }

    if (formData.allowedBudget <= 0) {
      newErrors. allowedBudget = "Budget must be positive";
    }

    setErrors(newErrors);
    return ! newErrors.name && !newErrors.totalWeeklyHours && !newErrors.allowedBudget;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const members = selectedMembers.map((userId) => {
        const user = mockUsers. find((u) => u.id === userId);
        return {
          id: 0,
          projectId: 0,
          userId: userId,
          hoursPerWeek: 0,
          role: user?.role || null,
          user: user || null,
        };
      });
      
      onSave({
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        totalWeeklyHours: formData.totalWeeklyHours,
        allowedBudget: formData. allowedBudget,
        members: members as any, 
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      totalWeeklyHours: 0,
      allowedBudget: 0,
    });
    setSelectedMembers([]);
    setErrors({
      name: "",
      totalWeeklyHours: "",
      allowedBudget: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e. stopPropagation()}
      >
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <h2
            id="create-modal-title"
            className="text-2xl font-semibold text-white m-0 break-words"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            Create New Project
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors duration-150 text-2xl leading-none w-8 h-8 flex items-center justify-center cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
          
          <div className="mb-4">
            <label
              htmlFor="project-name"
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ... formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              style={{ fontFamily: "var(--font-primary)" }}
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="project-description"
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={formData. description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 min-h-[100px] resize-y"
              style={{ fontFamily: "var(--font-primary)" }}
              placeholder="Enter project description"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="project-image"
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Image URL
            </label>
            <input
              id="project-image"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              style={{ fontFamily: "var(--font-primary)" }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="project-hours"
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Total arrangement (Hours) *
            </label>
            <input
              id="project-hours"
              type="number"
              min="0"
              value={formData.totalWeeklyHours}
              onChange={(e) => setFormData({ ...formData, totalWeeklyHours: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              style={{ fontFamily: "var(--font-primary)" }}
              placeholder="0"
            />
            {errors.totalWeeklyHours && (
              <p className="mt-1 text-sm text-red-600">{errors.totalWeeklyHours}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="project-budget"
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Allowed Budget ($) *
            </label>
            <input
              id="project-budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.allowedBudget}
              onChange={(e) => setFormData({ ...formData, allowedBudget: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              style={{ fontFamily: "var(--font-primary)" }}
              placeholder="0. 00"
            />
            {errors.allowedBudget && (
              <p className="mt-1 text-sm text-red-600">{errors.allowedBudget}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-gray-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-primary)" }}
            >
              Add Members
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              {mockUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers. includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: "var(--brand)" }}
                  />
                  <span
                    className="text-sm text-gray-700"
                    style={{ fontFamily: "var(--font-primary)" }}
                  >
                    {user. username}
                  </span>
                </label>
              ))}
            </div>
            {selectedMembers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedMembers.map((userId) => {
                  const user = mockUsers.find((u) => u. id === userId);
                  return (
                    <span
                      key={userId}
                      className="px-3 py-1 rounded-md border border-gray-300 bg-gray-50 text-sm"
                      style={{ fontFamily: "var(--font-primary)" }}
                    >
                      {user?.username}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3 flex-shrink-0 items-center">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--soft-bg)",
              color: "var(--brand)",
              fontFamily: "var(--font-primary)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--brand)",
              color: "white",
              fontFamily: "var(--font-primary)",
            }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;