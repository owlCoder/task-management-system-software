import React, { useState } from "react";
import { TaskCommentListProps } from "../../types/props";

export const TaskCommentList: React.FC<TaskCommentListProps> = ({
  onSubmit,
}) => {
  const [comment, setComment] = useState("");

  <textarea
    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
    value={comment}
    placeholder="Put in comment"
    onChange={(e) => setComment(e.target.value)}
  />;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-1">
        Comment
      </h3>

      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="
                w-full
                bg-black/30
                border border-white/10
                rounded-lg
                p-3
                text-sm text-white
                outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={async () => {
            await onSubmit(comment);
          }}
          className="
          px-4 py-1.5
          rounded-lg
          text-xs font-semibold
          text-white
          bg-gradient-to-t
          from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          hover:scale-[1.02]
          transition-all duration-200
          shadow-lg shadow-blue-500/20
        "
        >
          Save
        </button>

        <button
          onClick={() => {
            setComment("");
          }}
          className="
          px-4 py-1.5
          rounded-lg
          text-xs
          text-white/70
          bg-white/5
          border border-white/10
          hover:bg-white/10
          hover:text-white
          transition-all duration-200
        "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
