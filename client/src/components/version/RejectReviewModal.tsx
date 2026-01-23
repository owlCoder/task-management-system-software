import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (commentText: string) => Promise<void> | void;
  loading?: boolean;
  taskId?: number | null;
};

export const RejectReviewModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  taskId,
}) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open) setComment("");
  }, [open]);

  if (!open) return null;

  const canSubmit = comment.trim().length > 0 && !loading;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-[520px] shadow-2xl text-white">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold">
              Request changes {taskId ? `• Task #${taskId}` : ""}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Comment is required when rejecting a review.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
            Comment
          </h3>
          <textarea
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain what needs to be changed..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(comment.trim())}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-lg cursor-pointer
                       bg-red-500/20 border border-red-500/30 text-red-100
                       disabled:opacity-50 hover:bg-red-500/30 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
