import React from "react";
import { useState } from "react";
import { TaskAPI } from "../../api/task/TaskAPI";

interface UploadFileProps{
    token : string;
    taskId : number;
    setFile : (file : File) => void;
}

export const FileUpload : React.FC<UploadFileProps> = ({token,taskId,setFile}) => {

    const [selectFile,setSelectFile] = useState<File | null>(null);
    const [error,setError] = useState<string>("");
    const [isLoading,setIsLoading] = useState(false);

    const api = new TaskAPI(import.meta.env.VITE_GATEWAY_URL, token);

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        setError("");

        if(!selectFile){
            setError("File was not picked");
            setIsLoading(false);
            return;
        }

        try{
            setIsLoading(true);
            await api.uploadFile(taskId,selectFile);
        }catch(err) {
            setError("An error occurred.Please try again");
        }finally{
            setIsLoading(false);
        }
    }

return (
    <div className=" flex flex-1  items-center justify-center mt-10">
        <form onSubmit={handleSubmit}>
        <input type="file" 
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setSelectFile(e.target.files[0]);
                    setFile(e.target.files[0]);
                } 
            }
            }
        className=" file:bg-gradient-to-br 
            file:from-blue-500 
            file:to-blue-600 file:px-6 file:py-3 
            file:m-5 file:border-none 
            file:rounded-full file:text-white 
            file:cursor-pointer file:shadow-lg 
            file:shadow-600/50 bg-gradient-to-br 
            from-gray-600 to-gray-700 
            text-white/80 rounded-full cursor-pointer shadow-xl shadow-blue-700/60 
            transition-transform transform group-hover:scale-105
            group-hover:from-blue-400 group-hover:to-blue-500
            hover:shadow-l hover:shadow-blue-600/60 "
        />

            {isLoading && (
                <div className="flex flex-col items-center gap-3 pb-8">
                <div className="spinner"></div>
                <p className="text-white">Uploading files...</p>
            </div> )}

            {error && (
                <div className="mt-4 px-4 py-3 rounded-md bg-red-500/20 border border-red-500">
                <div className="flex items-center gap-2 text-red-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 110 10A5 5 0 018 3zm0 2a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3A.5.5 0 018 5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                    </svg>
                    <span className="text-sm">{error}</span>
                </div>
            </div> )}
        </form>
    </div>
    );
};