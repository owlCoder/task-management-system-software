import React, { useState } from "react";
import { TaskCommentInputProps } from "../../types/props";

export const TaskCommentInput: React.FC<TaskCommentInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await onSubmit(text);
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
        Add comment
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Write a comment..."
        className="
          w-full bg-black/30 border border-white/10 rounded-lg p-3
          text-sm text-white outline-none resize-none
          focus:ring-2 focus:ring-blue-500/40
        "
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="
            px-4 py-1.5 rounded-lg text-xs font-semibold text-white
            bg-gradient-to-t from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
              onClick={() => {
                setText("");
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
                transition
              "
            >
              Cancel
        </button>
      </div>
    </div>
  );
};
