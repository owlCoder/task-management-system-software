import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sprintAPI } from "../../api/sprint/SprintAPI";
import type { SprintCreateDTO } from "../../api/sprint/ISprintAPI";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onCreated?: () => void; 
};

const CreateSprintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projectId,
  onCreated,
}) => {
  const [formData, setFormData] = useState<SprintCreateDTO>({
    sprint_title: "",
    sprint_description: "",
    start_date: "",
    end_date: "",
    story_points: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        sprint_title: "",
        sprint_description: "",
        start_date: "",
        end_date: "",
        story_points: 0,
      });
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!formData.sprint_title.trim()) {
      toast.error("Sprint title is required.");
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error("Start date and end date are required.");
      return;
    }
    if (formData.end_date < formData.start_date) {
      toast.error("End date must be after start date.");
      return;
    }

    try {
      setLoading(true);
      await sprintAPI.createSprint(projectId, {
        sprint_title: formData.sprint_title.trim(),
        sprint_description: formData.sprint_description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        story_points: formData.story_points ?? 0,
      });
      toast.success("Sprint created successfully!");
      onClose();
      onCreated?.();
    } catch (e) {
      console.error(e);
      toast.error("Failed to create sprint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-semibold">Create Sprint</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-white/80 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Sprint Title *
            </h3>
            <input
              type="text"
              value={formData.sprint_title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, sprint_title: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
              placeholder="Enter sprint title"
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
              Description
            </h3>
            <textarea
              value={formData.sprint_description}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  sprint_description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none min-h-[90px]"
              placeholder="Enter sprint description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                Start Date *
              </h3>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, start_date: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none [color-scheme:dark]"
              />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                End Date *
              </h3>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, end_date: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] cursor-pointer disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Sprint"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSprintModal;
