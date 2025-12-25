import { useEffect, useState } from "react";
import { IFileAPI } from "../../api/file/IFileAPI";
import { FileAPI } from "../../api/file/FileAPI";
import { FileDTO } from "../../models/file/FileDTO";

type FileListProps = {
  onSelectFile: (file: FileDTO) => void;
  openDeleteModal: (onConfirm: () => Promise<void>) => void;
};

export const FileList = ({ onSelectFile, openDeleteModal }: FileListProps) => {
  const fileApi: IFileAPI = new FileAPI();
  const [error, setError] = useState<string>("");
  const [files, setFiles] = useState<FileDTO[]>([]);
  const [selectedFileId, SetSelectedFileId] = useState<number | null>(null);
  const [filteredFiles, setFilteredFiles] = useState<FileDTO[]>([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const userIdRaw = localStorage.getItem("userId");

      if (!token || !userIdRaw) {
        setFiles([]);
        return;
    }

      const userId = Number(userIdRaw);
      const data = await fileApi.getFileList(token!, userId);

      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (selectedType === "ALL") {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(files.filter((file) => file.fileType === selectedType));
    }
  }, [files, selectedType]);

  const handleDownload = async () => {
    const file = files.find((f) => f.fileId === selectedFileId);
    if (file) onSelectFile(file);

    const blob = await fileApi.downloadFile(token!, selectedFileId!);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "file";
    a.click();
  };

  const handleDelete = async () => {
    const file = files.find((f) => f.fileId === selectedFileId);
    if (file) onSelectFile(file);
    await fileApi.deleteFile(token!, selectedFileId!);
    await fetchFiles();
  };

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl
        border border-white/20
        rounded-3xl shadow-2xl
        w-full max-w-5xl
        max-h-[80vh] md:max-h-[840px]
        flex flex-col
      "
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-5 md:px-7 py-5 border-b border-white/20">
        <h2 className="font-bold text-lg text-white tracking-wide">
          FILE LIST
        </h2>

        <div className="relative w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="
              appearance-none
              w-full md:w-[160px] h-[44px]
              px-4 pr-10
              rounded-xl
              bg-white/20 backdrop-blur-md
              border border-white/30
              font-semibold
              text-white bg-clip-text
              bg-gradient-to-t from-blue-400 to-blue-700
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400
              hover:bg-white/30
              transition
            "
          >
            <option value="ALL" className="text-blue-700">
              All
            </option>
            <option value="image" className="text-blue-700">
              Image
            </option>
            <option value="video" className="text-blue-700">
              Video
            </option>
            <option value="audio" className="text-blue-700">
              Audio
            </option>
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
            ▾
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="rounded-2xl border border-white/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table
              style={{ fontFamily: "Questrial" }}
              className="w-full min-w-[640px] text-left border-collapse"
            >
              <thead
                className="
                  sticky top-0
                  bg-white/20 backdrop-blur-lg
                  border-b border-white/30
                "
              >
                <tr className="text-white text-sm font-semibold tracking-wide">
                  <th className="px-6 py-4 border-r border-white/20">Name</th>
                  <th className="px-6 py-4 border-r border-white/20">Type</th>
                  <th className="px-6 py-4 border-r border-white/20">
                    Extension
                  </th>
                  <th className="px-6 py-4">User</th>
                </tr>
              </thead>

              <tbody className="text-white/90 text-sm">
                {filteredFiles.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="
                        text-center py-16
                        text-white/50 italic
                        border-t border-white/20
                      "
                    >
                      No files found
                    </td>
                  </tr>
                )}

                {filteredFiles.map((file) => (
                  <tr
                    key={file.fileId}
                    onClick={() => SetSelectedFileId(file.fileId!)}
                    className={`
                      cursor-pointer transition-all
                      hover:bg-white/10
                      ${selectedFileId === file.fileId ? "bg-white/15" : ""}
                    `}
                  >
                    <td className="px-6 py-4 truncate border-t border-white/10 border-r border-white/10">
                      {file.originalFileName}
                    </td>
                    <td className="px-6 py-4 border-t border-white/10 border-r border-white/10">
                      {file.fileType}
                    </td>
                    <td className="px-6 py-4 border-t border-white/10 border-r border-white/10">
                      {file.fileExtension}
                    </td>
                    <td className="px-6 py-4 border-t border-white/10">
                      {file.authorId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between items-stretch sm:items-center px-5 md:px-7 py-4 md:py-5 border-t border-white/20">
        <button
          disabled={!selectedFileId}
          onClick={() => selectedFileId && handleDownload()}
          className={`
            w-full sm:w-[140px] h-[44px]
            rounded-xl font-semibold text-sm
            transition shadow-lg
            ${
              selectedFileId
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/30 text-white/50 cursor-not-allowed"
            }
          `}
        >
          Download
        </button>

        <button
          disabled={!selectedFileId}
          onClick={() => {
            if (selectedFileId) {
              const file = files.find((f) => f.fileId === selectedFileId);
              if (file) onSelectFile(file);
              openDeleteModal(() => handleDelete());
            }
          }}
          className={`
            w-full sm:w-[140px] h-[44px]
            rounded-xl font-semibold text-sm
            transition shadow-lg
            ${
              selectedFileId
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white/30 text-white/50 cursor-not-allowed"
            }
          `}
        >
          Delete
        </button>
      </div>

      {error && (
        <div
          style={{ fontFamily: "Questrial" }}
          className="
            mx-5 md:mx-7 mb-5 px-4 py-2
            rounded-lg
            bg-red-500/20
            border border-red-500/40
            text-red-300 text-sm
          "
        >
          {error}
        </div>
      )}
    </div>
  );
};
