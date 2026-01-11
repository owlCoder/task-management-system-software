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

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({token,taskId,setClose,onEdit,
  }) => {
  const [view, setView] = useState<"upload" | "preview">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [task, setTask] = useState<TaskDTO | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [isTaskDone,setIsTaskDone] = useState(false);
  const [comments, setComments] = useState<CommentDTO[]>([]);

  const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);
  const fileApi = new FileAPI();

const handleUpload = async () => {
  if (!selectedFile) return;

  try {
    await fileApi.uploadFile(token,selectedFile,userId);

    setIsTaskDone(true);
    setUploadedFileName(selectedFile.name);
    setView("upload");
  } catch (e) {
    console.error(e);
    alert("Upload failed");
  }
};

  useEffect(() => {
    if(!task) return;

    if(isTaskDone && task.task_status !== TaskStatus.COMPLETED) {
      setTask({...task,task_status : TaskStatus.COMPLETED});
    }
    apiTask.updateTaskStatus(taskId,TaskStatus.COMPLETED);
    
  },[task,isTaskDone])


  const handleAddComments = async (text: string) => {
    if (!text.trim()) return;
    
    const newComment = await apiTask.uploadComment(taskId, userId, text);
    setComments((prev) => [...prev,newComment]);
  };

 
 const handleDeleteComments = async (commentId: number) => {
  await apiTask.deleteComment(commentId, userId);

  setTask(prev => {
    if (!prev) return prev;

    return {
      ...prev,
      comments: prev.comments.filter(
        c => c.comment_id !== commentId
      ),
    };
  });
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
        setComments(t.comments ?? []);
    }).catch(() => {
      setTask(null);
    });
}, [taskId]);


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
            onStatusUpdate={(newStatus) =>
              setTask({ ...task, task_status: newStatus })
            }
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
              
              <TaskCommentList comments={task.comments} onDelete={handleDeleteComments}/>
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
