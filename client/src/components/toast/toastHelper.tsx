import { toast } from 'react-hot-toast';

/**
 * Interaktivni confirm toast sa "Da / Ne" dugmadima
 * @param message Poruka koja ce se prikazati
 */
export const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>{message}</span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
            >
              No
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
            >
              Yes
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
};
