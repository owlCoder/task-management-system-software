import { FileList } from "../components/files/FileList";
import { useState } from "react";
import { FileDTO } from "../models/file/FileDTO";
import Sidebar from "../components/dashboard/navbar/Sidebar";
import { FileModalDelete } from "../components/files/FileModalDelete";

export const FilePage = () => {
  const [selectedFile, setSelectedFile] = useState<FileDTO | null>(null);
  const [view, setView] = useState<"deleteModal" | "list">("list");
  const [deleteCallback, setDeleteCallback] = useState<(() => void) | null>(null);

return (
    <div className="min-h-screen w-screen flex">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center px-10">

    {view === "list" && (
          <FileList
          onSelectFile={(file) => {
            setSelectedFile(file);
          }}
          openDeleteModal={(cb) => {
            setDeleteCallback(() => cb); 
            setView("deleteModal");
          }}
      />
    )} 
  </div>
    {view === "deleteModal" && (
        <FileModalDelete
          setIsClose={() => setView("list")}
          setIsDelete={() => {
          deleteCallback?.();  
          setView("list");     
        }}
      />
    )}
    </div>
  );
};