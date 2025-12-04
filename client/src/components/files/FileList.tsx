import { useEffect, useState} from "react";
import { IFileAPI } from "../../api/file/IFileAPI";
import { FileAPI } from "../../api/file/FileAPI";
import { FileDTO } from "../../models/file/FileDTO";

type FileListProps = {
  onSelectFile: (file: FileDTO) => void;
};

export const FileList = ({onSelectFile} : FileListProps)=> {

    const fileApi : IFileAPI = new FileAPI();
    const [error,setError] = useState<string>("");
    const [files,setFiles] = useState<FileDTO[]>([]);
    const [selectedFileId,SetSelectedFileId] = useState<number | null>(null);


    const fetchFiles = async () => {
      try{
        const token = localStorage.getItem("token");
        const userId = parseInt(localStorage.getItem("userId")!);
        const data = await fileApi.getFileList(token!,userId);
        
        if (Array.isArray(data)) {
            setFiles(data);
        } else {
            setFiles([]);
        }
      }
      catch(err) {
        setError("An error occurred.Please try again.")
      }
    };

    const handleDownload = async () => {
      const token = localStorage.getItem("token");
      const file = files.find(f => f.fileId === selectedFileId);
            if (file) onSelectFile(file);

      const blob= await fileApi.downloadFile(token!,selectedFileId!);
      const url = window.URL.createObjectURL(blob);

      const a=document.createElement("a");
      a.href=url;
      a.download="fajl.pdf";
      a.click();
    };

    useEffect( () => {
        fetchFiles();
    },[]);

    const handleDelete = async () => {
      const token = localStorage.getItem("token");
       const file = files.find(f => f.fileId === selectedFileId);
            if (file) onSelectFile(file);
       fileApi.deleteFile(token!,selectedFileId!);
      await fetchFiles();
    }

return (
  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[520px] max-h-[360px] flex flex-col border border-gray-300">

    <div className="px-6 py-3 border-b font-bold text-base text-blue-700">
      File List
    </div>

    <div className="flex-1 overflow-y-auto p-4">
      <table
        style={{ fontFamily: "Questrial" }}
        className="w-full text-left border-collapse rounded-xl overflow-hidden"
      >
        <thead className="bg-blue-100 sticky top-0">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Extension</th>
            <th className="px-4 py-2">User</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {files.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                No files found
              </td>
            </tr>
          )}

          {files.map((file) => (
            <tr
              key={file.fileId}
              onClick={() => SetSelectedFileId(file.fileId!)}
              className={`cursor-pointer transition-all duration-200 hover:bg-blue-100 ${
                selectedFileId === file.fileId ? "bg-blue-200" : ""
              }`}
            >
              <td className="px-4 py-2 truncate">{file.originalFileName}</td>
              <td className="px-4 py-2">{file.fileType}</td>
              <td className="px-4 py-2">{file.fileExtension}</td>
              <td className="px-4 py-2">{file.authorId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ fontFamily: "Questrial" }} className="flex justify-between px-4 py-3 border-t">
      <button
        disabled={!selectedFileId}
        onClick={() => selectedFileId && handleDownload()}
        className={`px-5 py-2 rounded-xl font-bold text-white text-sm transition
          ${selectedFileId
            ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
            : "bg-gray-400 cursor-not-allowed"}`}
      >
        Download
      </button>

      <button
        disabled={!selectedFileId}
        onClick={() => selectedFileId && handleDelete()}
        className={`px-5 py-2 rounded-xl font-bold text-white text-sm transition
          ${selectedFileId
            ? "bg-red-500 hover:bg-red-600 shadow-lg"
            : "bg-gray-400 cursor-not-allowed"}`}
      >
        Delete
      </button>
    </div>

    {error && (
      <div
        style={{ fontFamily: "Questrial" }}
        className="mx-4 mb-3 px-3 py-2 rounded-lg bg-red-100
        text-red-700 text-xs font-medium"
      >
        {error}
      </div>
    )}
  </div>
);

};
