import React, { useEffect, useState } from "react";
import { FileUpload } from "../components/task/FileUpload";
import { FilePreview } from "../components/task/FilePreview";
import { UserRole } from "../enums/UserRole";
import { TaskAPI } from "../api/task/TaskAPI";
import { TaskDTO } from "../models/task/TaskDTO";
import { TaskHeader } from "../components/task/TaskHeader";
import { TaskDescription } from "../components/task/TaskDescription";
import { TaskTimeTracking } from "../components/task/TaskTimeTracking";
import { TaskCostInfo } from "../components/task/TaskCostInfo";
import { decodeJWT } from "../helpers/decode_jwt";
import { TaskCommentList } from "../components/task/TaskCommentList";
import { TaskDetailPageProps } from "../types/props";
import { FileAPI } from "../api/file/FileAPI";
import { TaskStatus } from "../enums/TaskStatus";
import { CommentDTO } from "../models/task/CommentDTO";
import { TaskCommentInput } from "../components/task/TaskCommentInput";
import { TaskVersionDiff } from "../components/task/TaskVersionDiff";
import { TaskVersionDTO } from "../models/task/TaskVersionDTO";
import { TaskVersionHistoryDropdown } from "../components/task/TaskVersionHistoryDropdown";
import { TaskReviewHistoryDropdown } from "../components/task/TaskReviewHistoryDropdown";
import { VersionControlAPI } from "../api/version/VersionControlAPI";
import { ReviewHistoryItemDTO } from "../models/version/ReviewHistoryItemDTO";

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  token,
  taskId,
  setClose,
  onEdit,
  onStatusUpdate,
}) => {
  const [view, setView] = useState<"upload" | "preview">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [task, setTask] = useState<TaskDTO | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [versions, setVersions] = useState<TaskVersionDTO[]>([]);
  const [versionsError, setVersionsError] = useState<string | null>(null);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItemDTO[]>([]);
  const [reviewHistoryLoading, setReviewHistoryLoading] = useState(false);
  const [reviewHistoryError, setReviewHistoryError] = useState<string | null>(null);
  //const [historyOpen, setHistoryOpen] = useState(false);

  const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const fileApi = new FileAPI();

  const canViewReviewHistory =
    role === UserRole.PROJECT_MANAGER ||
    role === UserRole.ANIMATION_WORKER ||
    role === UserRole.AUDIO_MUSIC_STAGIST;

  const dedupeComments = (arr: CommentDTO[]) => {
    const map = new Map<number, CommentDTO>();
    for (const c of arr) {
      if (c?.comment_id != null) map.set(c.comment_id, c);
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  };

  const handleUpload = async () => {
    if (!selectedFile || !task) return;

    try {
      const file_id=await fileApi.uploadFile(token,selectedFile,userId);

      apiTask.updateTaskStatus(taskId, TaskStatus.COMPLETED,file_id)
      .then(() => {
        setTask(prev => prev ? {...prev, task_status: TaskStatus.COMPLETED} : null);
        onStatusUpdate?.(taskId, TaskStatus.COMPLETED);
      })
      .catch(err => {
        console.error("Failed to update task status:", err);
      });

      setUploadedFileName(selectedFile.name);
      setView("upload");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    }
  };

  const handleAddComments = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newComment = await apiTask.uploadComment(taskId, userId, trimmed);

    setComments((prev) => dedupeComments([...(prev ?? []), newComment]));

    setTask((prev) =>
      prev
        ? { ...prev, comments: dedupeComments([...(prev.comments ?? []), newComment]) }
        : prev
    );
  };

 
 const handleDeleteComments = async (commentId: number) => {
    await apiTask.deleteComment(commentId, userId);

    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    setTask((prev) =>
      prev
        ? { ...prev, comments: (prev.comments ?? []).filter((c) => c.comment_id !== commentId) }
        : prev
    );
  };

  useEffect(() => {
    const decoded = decodeJWT(token);
    if (decoded) {
      setRole(decoded.role as UserRole);
      setUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
      apiTask.getTask(taskId)
      .then((t) => {
        setTask(t);
        setComments(dedupeComments((t.comments ?? []) as CommentDTO[]));
    }).catch(() => {
      setTask(null);
    });
}, [taskId]);

  useEffect(() => {
    apiTask
      .getTaskVersions(taskId)
      .then((data) => {
        setVersions(data);
        setVersionsError(null);
      })
      .catch(() => {
        setVersions([]);
        setVersionsError("Failed to load version history.");
      });
  }, [taskId]);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      if (!canViewReviewHistory) {
        if (active) {
          setReviewHistory([]);
          setReviewHistoryLoading(false);
          setReviewHistoryError(null);
        }
        return;
      }

      setReviewHistoryLoading(true);
      setReviewHistoryError(null);
      try {
        const data = await VersionControlAPI.getReviewHistoryByTaskId(taskId);
        if (active) {
          setReviewHistory(data ?? []);
        }
      } catch {
        if (active) {
          setReviewHistory([]);
          setReviewHistoryError("Failed to load review history.");
        }
      } finally {
        if (active) {
          setReviewHistoryLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [taskId, role, canViewReviewHistory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl
                   max-w-2xl w-full max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {task && role && (
          <TaskHeader
            task={task}
            role={role}
            token={token}
            onStatusUpdate={(newStatus) => {
              setTask({ ...task, task_status: newStatus });
              onStatusUpdate?.(task.task_id, newStatus);
            }}
          />
        )}

        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
          {task && role && (
            <>
              <TaskDescription
                token={token}
                taskId={taskId}
                role={role}
                task={task}
              />

              <TaskTimeTracking task={task} />

              <TaskCostInfo
                token={token}
                taskId={taskId}
                role={role}
                task={task}
              />

              {canViewReviewHistory && (
                <TaskReviewHistoryDropdown
                  items={reviewHistory}
                  loading={reviewHistoryLoading}
                  error={reviewHistoryError}
                />
              )}

              <TaskVersionHistoryDropdown
                versions={versions}
                error={versionsError}
              />

              {versionsError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-200">
                  {versionsError}
                </div>
              ) : (
                <TaskVersionDiff versions={versions} />
              )}
              
              <TaskCommentList comments={comments} onDelete={handleDeleteComments} />
              {task.task_status!== TaskStatus.COMPLETED &&  <TaskCommentInput onSubmit={handleAddComments} />}

              {task.task_status!== TaskStatus.COMPLETED &&  view === "upload" && (
                <FileUpload
                  setFile={(file) => {
                    setSelectedFile(file);
                    setView("preview");
                  }}
                  uploadedFileName={uploadedFileName}
                />
              )}

              {view === "preview" && selectedFile &&  (
                <FilePreview
                  file={selectedFile}
                  isUpload={handleUpload}
                  role = {role}
                  setClose={() => {
                    setSelectedFile(null);
                    setView("upload");
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-6 py-2 rounded-lg text-sm font-semibold
                         bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)]
                         hover:scale-[1.02] transition-all duration-200"
            >
              Edit Task
            </button>
          )}

          <button
            onClick={setClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold
                       bg-white/10 border border-white/20
                       hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
