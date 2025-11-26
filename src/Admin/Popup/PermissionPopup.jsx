import { IoIosCloseCircle } from "react-icons/io";
import { createPortal } from "react-dom";

const PermissionPopup = ({ message, onConfirm, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-purple-600 hover:text-purple-700"
        >
          <IoIosCloseCircle size={30}  />
        </button>

        {/* Message */}
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-5">
          {message || "Do you allow this action?"}
        </h2>

        {/* OK Button */}
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default PermissionPopup;
