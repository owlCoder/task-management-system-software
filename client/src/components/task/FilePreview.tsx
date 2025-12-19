import React, { useEffect } from "react";
import { useState } from "react";
import { UserRole } from "../../enums/UserRole";

interface FilePreviewProps {
    file: File | undefined;    
    role: UserRole;
    isUpload : () => void;
    setClose : () => void;
};

export const FilePreview : React.FC<FilePreviewProps> = ({file,role,isUpload,setClose} : FilePreviewProps) => {

    const [isTrue,setIsTrue] = useState(false);
    
    const isImage = file?.type.startsWith("image/");
    const isVideo = file?.type.startsWith("video/");
    const isAudio = file?.type.startsWith("audio/");


    const handleValidate = async () => {
        if(role == UserRole.ANIMATION_WORKER) {
            if(isImage || isVideo) {
                setIsTrue(true);
            } else {
                setIsTrue(false);
            }
        } else if (role == UserRole.AUDIO_MUSIC_STAGIST){
            if(isAudio){
                setIsTrue(true);
            } else {
                setIsTrue(false);
            }
        }
    }

    useEffect(() => {
        if(!file){
            setIsTrue(false);
            return;
        }
        handleValidate();
    },[role,file]);


return (
  <div className="fixed inset-0 z-50 flex items-center justify-center
                  bg-black/40 backdrop-blur-md">

    <div
      className="
        bg-white rounded-3xl shadow-2xl
        w-full max-w-5xl
        h-full max-h-[85vh]
        p-8
        flex flex-col
      "
    >

      <div
        className="
          flex-1
          flex items-center justify-center
          bg-gray-50
          rounded-2xl
          border border-gray-200
          overflow-hidden
        "
      >
        {file?.type.startsWith("image/") && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="
              max-w-full
              max-h-full
              object-contain
              rounded-xl
            "
          />
        )}

        {file?.type.startsWith("video/") && (
          <video
            controls
            src={URL.createObjectURL(file)}
            className="
              max-w-full
              max-h-full
              object-contain
              rounded-xl
            "
          />
        )}

        {file?.type.startsWith("audio/") && (
          <audio controls className="w-full max-w-xl" />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">

        {isTrue ? (
          <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold">
            ✔ File type is valid
          </div>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-semibold">
            ✖ Invalid file type
          </div>
        )}

        <button
          disabled={!isTrue}
          onClick={isUpload}
          className={`
            px-8 py-3 rounded-2xl font-bold text-base transition
            ${isTrue
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              : "bg-gray-400 text-white cursor-not-allowed"}
          `}
        >
          Submit
        </button>
        <button onClick={() => setClose()}
            className="px-5 py-2 rounded-xl font-bold text-sm 
            bg-blue-600 text-white hover:bg-blue-700 shadow-lg">Close
        </button>
      </div>
    </div>
  </div>
);
};