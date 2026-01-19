import React, { useEffect, useMemo, useState } from "react";
import { TaskVersionDTO } from "../../models/task/TaskVersionDTO";
import { TaskVersionDiffProps } from "../../types/props";

const formatDateValue = (value?: Date | string | null): string => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString();
};

const formatMoney = (value?: number | null): string => {
  if (value === null || value === undefined) return "N/A";
  return `$${value}`;
};

const formatWorker = (value?: number | null): string => {
  if (!value) return "Unassigned";
  return `User #${value}`;
};

const buildVersionLabel = (version: TaskVersionDTO): string => {
  const createdAt = new Date(version.created_at);
  const createdLabel = Number.isNaN(createdAt.getTime())
    ? "Unknown time"
    : createdAt.toLocaleString();
  return `v${version.version_number} • ${createdLabel}`;
};

export const TaskVersionDiff: React.FC<TaskVersionDiffProps> = ({ versions }) => {
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);

  useEffect(() => {
    if (versions.length === 0) {
      setLeftId(null);
      setRightId(null);
      return;
    }

    if (versions.length === 1) {
      setLeftId(versions[0].version_id);
      setRightId(versions[0].version_id);
      return;
    }

    setLeftId(versions[versions.length - 2].version_id);
    setRightId(versions[versions.length - 1].version_id);
  }, [versions]);

  const leftVersion = useMemo(
    () => versions.find((v) => v.version_id === leftId) ?? null,
    [versions, leftId]
  );
  const rightVersion = useMemo(
    () => versions.find((v) => v.version_id === rightId) ?? null,
    [versions, rightId]
  );

  const renderRow = (
    label: string,
    leftValue: string,
    rightValue: string
  ) => {
    const isChanged = leftValue !== rightValue;
    const leftClass = isChanged ? "text-red-200" : "text-white/80";
    const rightClass = isChanged ? "text-green-200" : "text-white/80";

    return (
      <div className="grid grid-cols-[130px_1fr_1fr] gap-3 py-2 border-t border-white/10">
        <span className="text-xs uppercase tracking-wider text-white/50">
          {label}
        </span>
        <div className={`text-sm leading-relaxed ${leftClass}`}>
          {leftValue}
        </div>
        <div className={`text-sm leading-relaxed ${rightClass}`}>
          {rightValue}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[11px] uppercase tracking-wider text-white/50">
            Version Diff
          </h3>
          <p className="text-xs text-white/60 mt-1">
            Compare two versions of the task.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={leftId ?? ""}
            onChange={(e) =>
              setLeftId(e.target.value ? Number(e.target.value) : null)
            }
            className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-white text-xs"
          >
            <option value="" className="bg-slate-900">
              Select version
            </option>
            {versions.map((version) => (
              <option
                key={version.version_id}
                value={version.version_id}
                className="bg-slate-900"
              >
                {buildVersionLabel(version)}
              </option>
            ))}
          </select>

          <span className="text-white/40 text-sm">→</span>

          <select
            value={rightId ?? ""}
            onChange={(e) =>
              setRightId(e.target.value ? Number(e.target.value) : null)
            }
            className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/15 text-white text-xs"
          >
            <option value="" className="bg-slate-900">
              Select version
            </option>
            {versions.map((version) => (
              <option
                key={version.version_id}
                value={version.version_id}
                className="bg-slate-900"
              >
                {buildVersionLabel(version)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {versions.length < 2 ? (
        <p className="text-xs text-white/50 mt-3">
          Not enough versions to compare yet.
        </p>
      ) : leftVersion && rightVersion ? (
        <div className="mt-3">
          {renderRow(
            "Description",
            leftVersion.task_description || "N/A",
            rightVersion.task_description || "N/A"
          )}
          {renderRow(
            "Budget",
            formatMoney(leftVersion.estimated_cost),
            formatMoney(rightVersion.estimated_cost)
          )}
          {renderRow(
            "Due Date",
            formatDateValue(leftVersion.due_date ?? null),
            formatDateValue(rightVersion.due_date ?? null)
          )}
          {renderRow(
            "Assigned",
            formatWorker(leftVersion.worker_id),
            formatWorker(rightVersion.worker_id)
          )}
        </div>
      ) : (
        <p className="text-xs text-white/50 mt-3">
          Select two versions to see the diff.
        </p>
      )}
    </div>
  );
};
