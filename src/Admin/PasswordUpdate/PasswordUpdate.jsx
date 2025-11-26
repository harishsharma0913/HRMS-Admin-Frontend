import { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useToast } from "../Toast/ToastProvider";

const PasswordModal = ({ isOpen, onClose, employeeId, onPasswordUpdated }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
    const { showToast } = useToast();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/update-password/${employeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast( `Error: ${data.message}` , "error");
      } else {
        onPasswordUpdated();
        onClose();
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      showToast("Server error. Try again.", "error");
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-modalFade">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
          Update Password
        </h2>
         <form
          onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePassword();
           }}
           >

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password:
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value.trim())}
              required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
             title="Password must be 8-20 characters long, include uppercase, lowercase, number, and special character"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password:
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
            required
             pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
             title="Password must be 8-20 characters long, include uppercase, lowercase, number, and special character"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
           type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 shadow-md"
          >
            Update
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
