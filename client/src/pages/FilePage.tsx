import { FileList } from "../components/files/FileList";
import { FileUpload } from "../components/files/FileUpload";
import { useState } from "react";

import { FileDTO } from "../models/file/FileDTO";
import Sidebar from "../components/dashboard/navbar/Sidebar";

export const FilePage = () => {
  const [view, setView] = useState<"upload" | "list">("upload");
  const [selectedFile, setSelectedFile] = useState<FileDTO | null>(null);

return (
    <div className="min-h-screen flex">
       <Sidebar />
    <div className="flex-1 relative flex items-center justify-center">
        {view === "upload" && (
          <FileUpload
            setIsOpen={() => setView("list")}
            fileInfo={selectedFile!}
          />
        )}

        {view === "list" && (
          <>
            <FileList
              onSelectFile={(file) => {
                setSelectedFile(file);
                setView("upload");
              }}
            />

            <button
              onClick={() => setView("upload")}
              className="absolute top-6 right-8 w-12 h-12 flex 
              items-center justify-center rounded-full
              hover:bg-red-600 
              text-white font-bold text-2xl z-50 shadow-xl transition"
            >
              ×
            </button>
          </>
        )}
      </div>
    </div>
  );
};