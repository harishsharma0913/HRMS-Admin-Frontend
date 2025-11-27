import { X, User, Calendar, Clock, MessageSquare, CircleCheckBig, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getAllLeaves, getEmployeeById, getFilteredLeaves, updateLeave } from "../ReduxToolkit/authSlice";
import { useToast } from "../Toast/ToastProvider";

// Simple Skeleton component for loaders
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export default function LeaveDetailsModal({leave, onClose }) {
const dispatch = useDispatch();
  const { employeeData, getEmployeeLoading, getEmployeeError } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { showToast } = useToast();

  useEffect(() => {
    if (leave?.employee?._id) {
      dispatch(getEmployeeById(leave.employee._id));
    }
  }, [dispatch, leave?.employee?._id]);

   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // ✅ har second update hoga
    }, 1000);

    return () => clearInterval(interval); // ✅ cleanup on unmount
  }, []);

  const handleAdd = () => {
    if (!commentText.trim()) return;

    dispatch(
      addComment({
        leaveId: leave._id,
        text: commentText, // 👈 input ki value yaha use karo
        userId: "64f1c1234567890abcdef123", // abhi ke liye hardcoded, baad me authMiddleware use karna
      })
    );
    showToast("Comment added successfully", "success");
    setCommentText(""); 
  };


  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} // 🔹 Overlay click = close
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()} // 🔹 Modal andar click se band na ho
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div>
  <h2 className="text-lg font-semibold">Leave Application Details</h2>
  <span
    className={`absolute top-6 right-14 px-3 py-1 rounded-full text-sm
      ${
        leave.status === "Approved"
          ? "bg-green-100 text-green-700"
          : leave.status === "Rejected"
          ? "bg-red-100 text-red-700"
          : leave.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : leave.status === "Cancelled"
          ? "bg-gray-200 text-gray-600"
          : "bg-blue-100 text-blue-700" 
      }`}
  >
    {leave.status}
  </span>
        </div>
        
        {/* Employee Info */}
        <div className="mt-5 border rounded-xl p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-medium text-gray-700">
            <User size={18} /> Employee Information
          </h3>

          {getEmployeeLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-14" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ) : getEmployeeError ? (
            <p className="text-red-500 text-sm">
              ❌ Failed to load employee info: {getEmployeeError}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <img
                  src={`https://hrms-api.tipsg.in/uploads/${employeeData?.documents?.profileImage}`}
                  alt={employeeData?.fullName || "Profile"}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <p className="font-semibold">{employeeData?.fullName}</p>
                  <p className="text-sm text-gray-500">
                    ID: {employeeData?.employeeId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-center text-gray-700">
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {employeeData?.designation?.department?.name}
                </p>
                <p>
                  <span className="font-medium">Position:</span>{" "}
                  {employeeData?.designation?.name}
                </p>
                <p>
                  <span className="font-medium">Official Email:</span>{" "}
                  {employeeData?.officialEmail || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Contact Number:</span>{" "}
                  {employeeData?.phoneNo}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Leave Details */}
        <div className="mt-5 border rounded-xl p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-medium text-gray-700">
            <Calendar size={18} /> Leave Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
  <p>
    <span className="font-medium">Leave Type: </span>
    {leave.leaveType}
  </p>
  <p>
    <span className="font-medium">Total Days: </span>
    {Math.ceil(
      (new Date(leave.endDate) - new Date(leave.startDate)) /
        (1000 * 60 * 60 * 24)
    ) + 1}{" "}
    days
  </p>
  <p>
    <span className="font-medium">Start Date: </span>
    {new Date(leave.startDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
  </p>
  <p>
    <span className="font-medium">End Date: </span>
    {new Date(leave.endDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
  </p>
  <p>
    <span className="font-medium">Applied Date: </span>
    {new Date(leave.createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
  </p>
          </div>

          <div>
            <p className="font-medium">Reason for Leave</p>
            <p className="bg-gray-100 p-2 rounded-md text-sm text-gray-700 mt-1">
              {leave.reason}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 border rounded-xl p-4">
  <h3 className="font-medium text-gray-700 mb-3">Actions</h3>

  <div className="flex gap-3">
    {/* ✅ Approve */}
    <button
      disabled={leave.status !== "Pending"} // ✅ sirf pending pe active
        onClick={() => {
    dispatch(updateLeave({ leaveId: leave._id, status: "Approved" }))
      .unwrap()
      .then(() => {
        dispatch(getAllLeaves()); // ✅ leaves list refresh
        dispatch(getFilteredLeaves({status:"All", type:"All", page:"", limit:"", search:""})); // ✅ filtered leaves refresh
        showToast("Leave approved successfully ✅", "success"); // 👈 success toast
        onClose();
      })
      .catch((err) => {
        showToast(err?.message || "Failed to approve leave ❌", "error"); // 👈 error toast
      });
  }}
      className={`flex-1 rounded-md py-2 font-medium flex items-center justify-center gap-2
        ${leave.status === "Pending"
          ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
    >
      <CircleCheckBig size={16} /> Approve
    </button>

    {/* ❌ Reject */}
    <button
      disabled={leave.status !== "Pending"} // ✅ sirf pending pe active
  onClick={() => {
    dispatch(updateLeave({ leaveId: leave._id, status: "Rejected" }))
      .unwrap()
      .then(() => {
        dispatch(getAllLeaves()); // ✅ leaves list refresh
        dispatch(getFilteredLeaves({status:"All", type:"All", page:"", limit:"", search:""})); // ✅ filtered leaves refresh
        showToast("Leave rejected successfully ❌", "error"); // 👈 reject toast
        onClose();
      })
      .catch((err) => {
        showToast(err?.message || "Failed to reject leave ❌", "error"); // 👈 error toast
      });
  }}
      className={`flex-1 rounded-md py-2 font-medium flex items-center justify-center gap-2
        ${leave.status === "Pending"
          ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
    >
      <XCircle size={16} /> Reject
    </button>
  </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 border rounded-xl p-4 space-y-3">
  <h3 className="flex items-center gap-2 font-medium text-gray-700">
    <Clock size={18} /> Timeline
  </h3>

  <div className="space-y-2 text-sm">
    {/* Always show Submitted */}
    <p className="flex items-center gap-2">
      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
      Application Submitted -{" "}
      {new Date(leave.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
    </p>

    {/* If Approved */}
    {leave.status === "Approved" && (
      <p className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Approved -{" "}
        {new Date(leave.updatedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    )}

    {/* If Rejected */}
    {leave.status === "Rejected" && (
      <p className="flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Rejected -{" "}
        {new Date(leave.updatedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    )}

    {/* If Cancelled */}
    {leave.status === "Cancelled" && (
      <p className="flex items-center gap-2">
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
        Cancelled -{" "}
        {new Date(leave.updatedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    )}

    {/* If Still Pending */}
    {leave.status === "Pending" && (
      <p className="flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
        Pending Review
      </p>
    )}
  </div>
        </div>

                {/* Comments Section */}
        <div className="mt-5 border rounded-xl p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-medium text-gray-700">
            <MessageSquare size={18} /> Comments
          </h3>

          {/* Existing Comment Example (future me map karna hoga DB ke comments array se) */}
          <div className="bg-gray-100 p-3 rounded-md text-sm">
            <p className="font-medium">Admin User</p>
            {/* <p className="text-xs text-gray-500">HR Manager • 19/8/2025, 5:30am</p> */}
    <p className="text-xs text-gray-500">
      HR Manager •{" "}
      {currentTime.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // ✅ seconds dikh rahe
        hour12: true,
      })}
    </p>
            <p className="mt-1">Application received and under review.</p>
          </div>

          {/* New Comment Input */}
          <textarea
            placeholder="Add a comment..."
            value={commentText} // 👈 bind value
            onChange={(e) => setCommentText(e.target.value)} // 👈 update state
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring"
          ></textarea>
          <button
            onClick={handleAdd}
            className="w-full bg-black text-white rounded-md py-2 font-medium"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
