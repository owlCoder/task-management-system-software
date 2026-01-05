import { useState } from "react";
import { FileDTO } from "../models/file/FileDTO";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { FileList } from "../components/files/FileList";
import { FileModalDelete } from "../components/files/FileModalDelete";

export const FilePage = () => {
  
  const [selectedFile, setSelectedFile] = useState<FileDTO | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);

  return (
    <div className="min-h-screen flex overflow-hidden">
      
      <div className="w-[260px] min-w-[260px] shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto p-6">
  <div className="w-full max-w-4xl mx-auto">
    <FileList
      onSelectFile={setSelectedFile}
      openDeleteModal={(deleteFn) => {
        setDeleteAction(() => deleteFn);
        setShowDeleteModal(true);
      }}
    />
  </div>
</div>


      {showDeleteModal && selectedFile && (
        <FileModalDelete
          fileName={selectedFile.originalFileName}
          onConfirm={async () => {
            await deleteAction?.();
            setShowDeleteModal(false);
            setSelectedFile(null);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};