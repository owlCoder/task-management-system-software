import { FileDTO } from "../../models/file/FileDTO";

type FileUploadProps = {
  setIsOpen: () => void;
  fileInfo?: FileDTO;
};

export const FileUpload = ({ setIsOpen, fileInfo }: FileUploadProps) => {
  return (
    <div
      className="w-full h-full relative bg-cover bg-center"
      style={{ backgroundImage: `url(/bg.jpg)` }}
    >
      <h1
        className="text-white font-bold text-5xl drop-shadow-lg absolute top-10 left-10"
        style={{ fontFamily: "Questrial" }}
      >
        Files
      </h1>

      <div className="flex items-center justify-center h-full">
        <button
          onClick={setIsOpen}
          className="bg-white hover:bg-blue-500 
          hover:text-white text-[#3270F4] 
          font-bold rounded-2xl shadow-2xl 
          transition-all duration-300 scale-100 hover:scale-105"
          style={{
            fontFamily: "Questrial",
            width: 220,
            height: 90,
            fontSize: 24,
          }}
        >
          Select file
        </button>
      </div>

      {fileInfo && (
        <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[350px]">
          <h2 className="font-bold mb-3 text-lg text-blue-700">Selected File</h2>
          <p><b>Name:</b> {fileInfo.originalFileName}</p>
          <p><b>Type:</b> {fileInfo.fileType}</p>
          <p><b>Extension:</b> {fileInfo.fileExtension}</p>
          <p><b>Uploaded By:</b> {fileInfo.authorId}</p>
        </div>
      )}
    </div>
  );
};
