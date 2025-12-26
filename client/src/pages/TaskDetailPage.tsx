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
import { TaskStatus } from "../enums/TaskStatus";
import { TaskCommentList } from "../components/task/TaskCommentList";

const MOCK_TASK: TaskDTO = {
  task_id: 1,
  sprint_id: 1,   // nije project_id nego sprint_id dto ti je bacao gresku
  project_manager_id: 10,
  worker_id: 5,
  title: "Create character animation",
  task_description:
    "Design and animate the main character intro sequence. Use reference sketches and provide final render.",
  task_status: TaskStatus.COMPLETED,
  estimated_cost: 1200,
  total_hours_spent: 18,
  attachment_file_uuid: undefined,
};

interface TaskDetailPageProps {
  token: string;
  taskId: number;
  setClose: () => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({token,taskId,setClose,}) => {
  const [view, setView] = useState<"upload" | "preview">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [task, setTask] = useState<TaskDTO | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number>(0);

  const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);


  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await apiTask.uploadFile(taskId, selectedFile);
      setUploadedFileName(selectedFile.name);
      setSelectedFile(null);
      setView("upload");
    } catch {
      alert("Upload failed");
    }
  };

  const handleAddComments = async (text : string) => {
    if(!text.trim()) return;

    try {
      await apiTask.uploadComment(taskId,userId,text);
    }catch {
      alert("Failed");
    }
  }

  useEffect(() => {
    const decoded = decodeJWT(token);
    if (decoded) {
      setRole(decoded.role as UserRole);
      setUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    apiTask
      .getTask(taskId)
      .then(setTask)
      .catch(() => {
        setTask(MOCK_TASK);
        setRole(UserRole.PROJECT_MANAGER);
      });
  }, [taskId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl
                   max-w-2xl w-full max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {task && role && <TaskHeader task={task} role={role} token={token} onStatusUpdate={(newStatus) => setTask({...task, task_status: newStatus})} />}

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

              <TaskCommentList
                onSubmit={handleAddComments}
              />

              {view === "upload" && (
                <FileUpload
                  setFile={(file) => {
                    setSelectedFile(file);
                    setView("preview"); 
                  }}
                  uploadedFileName={uploadedFileName}
                />
              )}

              {view === "preview" && selectedFile && (
                <FilePreview
                  file={selectedFile}
                  isUpload={handleUpload}
                  setClose={() => {
                    setSelectedFile(null);
                    setView("upload");
                  }}
                />
              )}


            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
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
