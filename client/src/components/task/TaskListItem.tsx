import React from "react";
import { TaskListItemProps } from "../../types/props";
import { TaskStatus } from "../../enums/TaskStatus";
import StatusDropdown from "./StatusDropdown";
import { StatusBadge } from "./StatusBadge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthHook";
import { VersionControlAPI } from "../../api/version/VersionControlAPI";

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onSelect,
  onStatusChange,
  users = [],
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  //const api = new VersionControlAPI(import.meta.env.VITE_GATEWAY_URL, token!);

  const getWorkerName = () => {
    if (!task.worker_id) return "Unassigned";
    const worker = users.find((u) => u.user_id === task.worker_id);
    return worker ? worker.username : `User #${task.worker_id}`;
  };

  const handleSendToReview = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await VersionControlAPI.sendTaskToReview(task.task_id);
      navigate(`/reviews/${task.task_id}`);
    } catch (err) {
      console.error("Send to review failed", err);
      alert("Failed to send task to review");
    }
  };

  return (
    <div
      onClick={() => {
        if (onSelect) {
          onSelect(task.task_id);
        }
      }}
      className="bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-white text-xl">{task.title}</span>

        {onStatusChange ? (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusDropdown
              currentStatus={task.task_status as TaskStatus}
              onStatusChange={(newStatus) => {
                if (onStatusChange) {
                  onStatusChange(task.task_id, newStatus);
                }
              }}
            />
          </div>
        ) : (
          <StatusBadge status={task.task_status} />
        )}
      </div>

      <p className="text-white/70 mt-1 text-sm">{task.task_description}</p>

      <div className="flex justify-between mt-3 text-xs text-white/50">
        <div className="flex gap-4">
          <span>Cost: {task.estimated_cost}¥</span>
          <span className="text-white/50">Assigned to: {getWorkerName()}</span>
        </div>
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Time: {task.total_hours_spent}h
        </span>

        <div className="flex gap-2">
          {task.task_status === TaskStatus.COMPLETED && (
            <button
              onClick={handleSendToReview}
              className="
                px-3 py-1
                rounded-lg
                bg-purple-500/20
                text-purple-300
                hover:bg-purple-500/40
                transition
                text-xs
              "
            >
              Send to review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;
