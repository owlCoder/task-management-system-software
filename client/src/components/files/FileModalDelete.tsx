type FileUploadProps = {
  setIsDelete: () => void;
  setIsClose: () => void;
};

export const FileModalDelete = ({ setIsDelete ,setIsClose}: FileUploadProps) => {
  return (
     <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[360px] bg-white rounded-2xl shadow-2xl p-6">

          <h1
            className="text-center text-xl font-bold text-blue-700 mb-6"
            style={{ fontFamily: "Questrial" }}
          >
            Do you want to delete this file?
          </h1>

          <div className="flex justify-between mt-4">
            <button
              onClick={setIsDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Delete
            </button>

            <button
              onClick={setIsClose}
              className="px-6 py-2 bg-gray-300 text-black rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};