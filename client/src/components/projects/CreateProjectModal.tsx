import React, { useState , useEffect} from "react";
import type { ProjectDTO } from "../../models/project/ProjectDTO";
import { mockUsers } from "../../mocks/UsersMock";
import { getProjectStatusByDate } from "../../helpers/projectStatusHelper";

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
    totalWeeklyHours: "" as any,
    allowedBudget: "" as any,
    numberOfSprints: "" as any,
    sprintDuration: "" as any,
    startDate: "",
  });

  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [errors, setErrors] = useState({
    name: "",
    totalWeeklyHours: "",
    allowedBudget: "",
    numberOfSprints: "",
    sprintDuration: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      totalWeeklyHours: "" as any,
      allowedBudget: "" as any,
      numberOfSprints: "" as any,
      sprintDuration: "" as any,
      startDate: "",
    });
    setSelectedMembers([]);
    setErrors({
      name: "",
      totalWeeklyHours: "",
      allowedBudget: "",
      numberOfSprints: "",
      sprintDuration: "",
    });
  };
  
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  const toggleMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      totalWeeklyHours: "",
      allowedBudget: "",
      numberOfSprints: "",
      sprintDuration: "",
    };

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.totalWeeklyHours || Number(formData.totalWeeklyHours) <= 0)
      newErrors.totalWeeklyHours = "Hours must be positive";
    if (!formData.allowedBudget || Number(formData.allowedBudget) <= 0)
      newErrors.allowedBudget = "Budget must be positive";
    if (!formData.numberOfSprints || Number(formData.numberOfSprints) <= 0)
      newErrors.numberOfSprints = "Number of sprints must be positive";
    if (!formData.sprintDuration || Number(formData.sprintDuration) <= 0)
      newErrors.sprintDuration = "Sprint duration must be positive";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const members = selectedMembers.map((userId) => {
      const user = mockUsers.find((u) => u.id === userId);
      return {
        id: 0,
        projectId: 0,
        userId,
        hoursPerWeek: 0,
        role: user?.role || null,
        user: user || null,
      };
    });

    const status = getProjectStatusByDate(formData.startDate);

    onSave({
      name: formData.name,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      totalWeeklyHours: Number(formData.totalWeeklyHours),
      allowedBudget: Number(formData.allowedBudget),
      members: members as any,
      numberOfSprints: Number(formData.numberOfSprints),
      sprintDuration: Number(formData.sprintDuration),
      startDate: formData.startDate,
      status,
    });

    handleClose();
  };

  const handleClose = () => {
    resetForm();
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
          bg-white/10
          border border-white/20 
          rounded-2xl
          shadow-2xl
          max-w-2xl w-full max-h-[90vh]
          flex flex-col overflow-hidden
          text-white
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            Create Project
          </h2>
          <button
            onClick={handleClose}
            className="cursor-pointer text-white/80 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 styled-scrollbar space-y-4">
        
          {[["Project Name *", "name", "text"]].map(([label, key, type]) => (
            <div key={key}>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                {label}
              </h3>
              <input
                type={type}
                required
                value={(formData as any)[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${
                  (errors as any)[key] ? "border-red-400" : "border-white/20"
                } focus:outline-none`}
              />
              {(errors as any)[key] && (
                <p className="text-red-400 text-sm mt-1">{(errors as any)[key]}</p>
              )}
            </div>
          ))}

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Project Image
            </h3>

            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition">
              <span className="text-white/90">
                {formData.imageUrl ? "File Selected" : "Choose Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setFormData({ ...formData, imageUrl: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded-2xl "
              />
            )}
          </div>


          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Description
            </h3>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="
                w-full px-4 py-2 rounded-lg
                bg-white/10 border border-white/20
                min-h-[100px] focus:outline-none
              "
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">
              Members
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleMember(user.id)}
                  className={`
                    px-3 py-1 rounded-lg text-sm
                    border transition cursor-pointer
                    ${
                      selectedMembers.includes(user.id)
                        ? "bg-white/20 border-white/80"
                        : "bg-white/10 border-white/20"
                    }
                  `}
                >
                  {user.username}
                </button>
              ))}
            </div>
          </div>

          {/* obavezna polja*/}
          {[
            ["Total Weekly Hours *", "totalWeeklyHours"],
            ["Allowed Budget ($) *", "allowedBudget"],
            ["Number of Sprints *", "numberOfSprints"],
            ["Sprint Duration (days) *", "sprintDuration"],
          ].map(([label, key]) => (
            <div key={key}>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                {label}
              </h3>
              <input
                type="number"
                required
                value={(formData as any)[key]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    [key]: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "+" || e.key === "-") {
                    e.preventDefault();
                  }
                  if (
                    (key === "numberOfSprints" || key === "sprintDuration") &&
                    e.key === "."
                  ) {
                    e.preventDefault();
                  }
                }}
                className={`
                  w-full px-4 py-2 rounded-lg
                  bg-white/10
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                  border focus:outline-none
                  ${
                    (errors as any)[key]
                      ? "border-red-400"
                      : "border-white/20"
                  }
                `}
              />
              {(errors as any)[key] && (
                <p className="text-red-400 text-sm mt-1">
                  {(errors as any)[key]}
                </p>
              )}
            </div>
          ))}

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Start Date
            </h3>
            <input
              type="date"
              value={formData.startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="
                w-full px-4 py-2 rounded-lg
                bg-white/10 border border-white/20 
              "
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-3">
          <button
            onClick={handleClose}
            className="
              px-6 py-2 rounded-lg
              bg-white/10 border border-white/20 cursor-pointer
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="
              px-6 py-2 rounded-lg font-semibold
              bg-gradient-to-t
              from-[var(--palette-medium-blue)]
              to-[var(--palette-deep-blue)] cursor-pointer
            "
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
