import React from "react";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

type TaskReviewDTO = {
  reviewId: number;
  taskId: number;
  authorId: number;
  time: string;
  status: "REVIEW" | "APPROVED" | "REJECTED";
};

type Props = {
  items: TaskReviewDTO[];
  onApprove: (taskId: number) => void;
  onReject: (taskId: number) => void;
  disabled?: boolean;
};

export const ReviewInboxList: React.FC<Props> = ({ items, onApprove, onReject, disabled }) => {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
          />
        </svg>
        <p className="text-lg">No tasks currently in review.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((r) => (
        <div
          key={r.reviewId}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-white font-semibold">Task #{r.taskId}</div>
              <ReviewStatusBadge status={r.status} />
            </div>

            <div className="text-xs text-white/50">
              Author: #{r.authorId} • Created: {r.time}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={disabled}
              onClick={() => onApprove(r.taskId)}
              className="
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)]
                hover:scale-[1.02] transition-all duration-200
                disabled:opacity-50 disabled:hover:scale-100
              "
            >
              Approve
            </button>

            <button
              disabled={disabled}
              onClick={() => onReject(r.taskId)}
              className="
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-red-500/20 border border-red-500/30 text-red-100
                hover:bg-red-500/30 transition
                disabled:opacity-50
              "
            >
              Request changes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
