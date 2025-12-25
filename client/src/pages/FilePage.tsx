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
    <div className="min-h-screen w-screen flex">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center px-10">
        <FileList
          onSelectFile={setSelectedFile}
          openDeleteModal={(deleteFn) => {
            setDeleteAction(() => deleteFn);
            setShowDeleteModal(true);
          }}
        />
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
