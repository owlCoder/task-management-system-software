import React, { useMemo, useState } from "react";
import { ReviewHistoryItemDTO } from "../../models/version/ReviewHistoryItemDTO";
import { ReviewStatusBadge } from "../version/ReviewStatusBadge";

type Props = {
  items: ReviewHistoryItemDTO[];
  loading?: boolean;
  error?: string | null;
};

export const TaskReviewHistoryDropdown: React.FC<Props> = ({
  items,
  loading = false,
  error = null,
}) => {
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => b.review.reviewId - a.review.reviewId);
  }, [items]);

  const formatDate = (value?: string | null) => {
    if (!value) return "Unknown time";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "Unknown time" : d.toLocaleString();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/50">
            Review history
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            {loading ? "Loading..." : `${sorted.length} review${sorted.length === 1 ? "" : "s"}`}
          </div>
        </div>

        <span className="text-white/60 text-sm">{open ? "^" : "v"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-200">
              {error}
            </div>
          ) : loading ? (
            <div className="text-xs text-white/50 py-2">Loading reviews...</div>
          ) : sorted.length === 0 ? (
            <div className="text-xs text-white/50 py-2">No reviews yet.</div>
          ) : (
            <ul className="mt-2 space-y-2">
              {sorted.map((item) => {
                const review = item.review;
                const showComment =
                  review.status === "REJECTED" && item.commentText;

                return (
                  <li
                    key={review.reviewId}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm text-white/80">
                        Review #{review.reviewId} • {formatDate(review.time)}
                      </div>
                      <ReviewStatusBadge status={review.status} />
                    </div>

                    <div className="text-xs text-white/40 mt-1">
                      Author: {item.authorName ?? `#${review.authorId}`}
                    </div>

                    {showComment ? (
                      <div className="mt-2 text-sm text-white/80 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        <div className="text-[11px] text-white/50 mb-1">
                          Requested changes:
                        </div>
                        {item.commentText}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
