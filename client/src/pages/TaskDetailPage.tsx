import React, { useState } from "react";
import { FileUpload } from "../components/task/FileUpload";
import { FilePreview } from "../components/task/FilePreview";
import { UserRole } from "../enums/UserRole";

interface TaskDetailPageProps {
    token : string;
    taskId : string;
    role1 : UserRole;
}

export const TaskDetailPage : React.FC<TaskDetailPageProps> = ({token,taskId,role1}) => {

    const [view, setView] = useState<"previewModal" | "upload">("upload");
    const [selectedFile,setSelectedFile] = useState<File > ();
    
    return (
        <div>
            {view === "upload" && (
                <FileUpload
                    taskId={taskId}
                    token = {token}
                    setFile={(file) => {
                        setSelectedFile(file);
                        setView("previewModal");
                    }}
                />
            )}

            {view === "previewModal" && (
                <FilePreview 
                    role = {role1} 
                    file = {selectedFile}
                    isUpload={() => {
                        setView("upload")
                        }
                    }
                    setClose={() => {
                        setView("upload")
                    }}
                />
            )}
        </div>
    );
}