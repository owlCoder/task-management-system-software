import React, { useMemo, useState } from "react";
import { TaskVersionDTO } from "../../models/task/TaskVersionDTO";

type Props = {
  versions: TaskVersionDTO[];
  loading?: boolean;
  error?: string | null;
};

export const TaskVersionHistoryDropdown: React.FC<Props> = ({
  versions,
  loading = false,
  error = null,
}) => {
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...versions].sort((a, b) => b.version_number - a.version_number);
  }, [versions]);

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "Unknown time";

    const d = value instanceof Date ? value : new Date(value);

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
            Version history
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            {loading ? "Loading..." : `${sorted.length} version${sorted.length === 1 ? "" : "s"}`}
          </div>
        </div>

        <span className="text-white/60 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-200">
              {error}
            </div>
          ) : loading ? (
            <div className="text-xs text-white/50 py-2">Loading versions…</div>
          ) : sorted.length === 0 ? (
            <div className="text-xs text-white/50 py-2">No versions yet.</div>
          ) : (
            <ul className="mt-2 space-y-2">
              {sorted.map((v) => (
                <li
                  key={v.version_id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="text-sm text-white/80">
                    v{v.version_number} • {formatDate(v.created_at)}
                  </div>
                  <div className="text-[11px] text-white/40">#{v.version_id}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
