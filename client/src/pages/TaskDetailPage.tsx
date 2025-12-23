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

interface TaskDetailPageProps {
    token : string;
    taskId : number;
    setClose : () => void;
}

export const TaskDetailPage : React.FC<TaskDetailPageProps> = ({token,taskId,setClose}) => {

    const [view, setView] = useState<"previewModal" | "upload">("upload");
    const [selectedFile,setSelectedFile] = useState<File | null> (null);
    const [task,setTask] = useState<TaskDTO | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const apiTask = new TaskAPI(import.meta.env.VITE_GATEWAY_URL,token);

    useEffect(() => {
    const decoded = decodeJWT(token);
        if (decoded) {
        setRole(decoded.role as UserRole);
  }
}, [token]);

     useEffect(() => {
  apiTask.getTask(taskId)
    .then(data => {
      console.log(import.meta.env.VITE_GATEWAY_URL)
      setTask(data);
    })
    .catch(err => {
      console.error("GET TASK ERROR:", err);
    });
}, [taskId]);

    
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">

    {task && (
      <div className="border-b px-6 py-4">
        <TaskHeader task={task} />
      </div>
    )}

    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {task && role && (
        <TaskDescription token={token} taskId={taskId} role={role} task={task} />
      )}

      {task && role && (
        <TaskTimeTracking token={token} taskId={taskId} role={role} task={task} />
      )}

      {task && <TaskCostInfo task={task} />}

      {view === "upload" && (
        <FileUpload
          taskId={taskId}
          token={token}
          setFile={(file) => {
            setSelectedFile(file);
            setView("previewModal");
          }}
        />
      )}

      {view === "previewModal" && selectedFile && (
        <FilePreview
          file={selectedFile}
          isUpload={() => setView("upload")}
          setClose={() => setView("upload")}
        />
      )}
    </div>

    <div className="border-t px-6 py-3 flex justify-end">
      <button
        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        onClick={setClose}
      >
        Back
      </button>
    </div>

  </div>
</div>

    );
}