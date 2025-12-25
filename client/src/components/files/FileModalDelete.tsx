type Props = {
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const FileModalDelete = ({ fileName, onConfirm, onCancel }: Props) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="
            w-[420px]
            bg-white/20 backdrop-blur-xl
            border border-white/30
            rounded-3xl
            shadow-2xl
            p-8
          "
        >
          <h2
            className="text-center text-xl font-bold text-white mb-2"
            style={{ fontFamily: "Questrial" }}
          >
            Delete file
          </h2>

          <p className="text-center text-white/80 mb-8">
            Are you sure you want to delete <br />
            <span className="font-semibold">{fileName}</span>?
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onConfirm}
              className="
                px-6 py-2 rounded-xl
                bg-red-500 hover:bg-red-600
                text-white font-semibold
                transition shadow-lg
              "
            >
              Delete
            </button>

            <button
              onClick={onCancel}
              className="
                px-6 py-2 rounded-xl
                bg-white/30 hover:bg-white/40
                text-white font-semibold
                transition
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
