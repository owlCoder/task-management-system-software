import React from "react";
import { TaskCommentListProps } from "../../types/props";

export const TaskCommentList: React.FC<TaskCommentListProps> = ({ comments ,onDelete}) => {
  if (comments.length === 0) {
    return (
      <p className="text-xs text-white/40 italic">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((c) => (
        <div
          key={c.comment_id}
          className="bg-black/30 border border-white/10 rounded-lg p-3"
        >
          <p className="text-sm text-white/90">
            {c.comment}
          </p>
          <span className="text-[10px] text-white/40">
            {new Date(c.created_at).toLocaleString()}
          </span>
          <br></br>
          <button
            onClick={() => onDelete(c.comment_id)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
