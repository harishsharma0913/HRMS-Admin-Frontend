import { X, User, Paperclip, Ticket, Clock, Briefcase } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredTickets, updateTicketStatus } from "../ReduxToolkit/ticketSlice";
import { useToast } from "../Toast/ToastProvider";

export default function TicketDetailsModal({ ticket, onClose }) {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.tickets);
  const { showToast } = useToast();

  const handleStatusChange = async (newStatus) => {
    try {
      if (ticket.status === newStatus) return;
      await dispatch(updateTicketStatus({ id: ticket._id, status: newStatus })).unwrap();
      dispatch(getFilteredTickets({search:"",status:"",priority:"",category:"",page:1,limit:5}))
      showToast(`Ticket status updated to ${newStatus}`, "success");
      onClose();
    } catch (error) {
      console.error("Error updating ticket:", error);
      showToast("Failed to update ticket status.", "error");
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`https://hrms-api.tipsg.in/uploads/${encodeURIComponent(fileName)}`);
      if (!response.ok) return alert("File not found or not uploaded");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed: " + error.message);
    }
  };

  // 👇 Define the order of statuses
  const statusOrder = ["Open", "In Progress", "Resolved", "Closed"];
  const currentStatusIndex = statusOrder.indexOf(ticket.status);

  const colorMap = {
    Open: "green",
    "In Progress": "yellow",
    Resolved: "blue",
    Closed: "red",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[600px] max-h-[90vh] overflow-y-auto p-6 border border-gray-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Ticket size={20} /> Ticket Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">Ticket ID: {ticket.ticketId}</p>
        </div>

        {/* Status badge */}
        <span
          className={`absolute top-6 right-14 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
            ${
              ticket.status === "Open"
                ? "bg-yellow-100 text-yellow-700"
                : ticket.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : ticket.status === "Resolved"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
        >
          {ticket.status}
        </span>

        {/* Reporter Info */}
        <div className="mt-4 border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <User size={18} /> Reported By
          </h3>

          <div className="flex items-center gap-3">
            <img
              src={`https://hrms-api.tipsg.in/uploads/${ticket.employee.documents.profileImage}`}
              alt={ticket.employee.fullName || "Profile"}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="font-medium text-gray-800">{ticket.employee.fullName}</p>
              <p className="text-sm text-gray-600">ID: {ticket.employee.employeeId}</p>
              <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <Briefcase size={14} /> {ticket.designation.name}
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="mt-5 border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Ticket size={18} /> Ticket Information
          </h3>

          <div className="space-y-2">
            <p>
              <span className="text-sm font-medium text-gray-600">Title:</span>
              <br />
              <span className="text-base font-semibold text-gray-900">{ticket.subject}</span>
            </p>

            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <p className="font-medium">Category</p>
                <p>{ticket.category}</p>
              </div>
              <div>
                <p className="font-medium">Priority</p>
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-md">
                  {ticket.priority}
                </span>
              </div>
              <div>
                <p className="font-medium">Created</p>
                <p>
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mt-2">Description</p>
              <p className="bg-white p-3 rounded-md text-sm text-gray-700 shadow-sm mt-1">
                {ticket.description}
              </p>
            </div>

            {ticket.attachments && (
              <div className="mt-3 border-t pt-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Attachment</p>
                <div className="flex items-center justify-between p-2 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Paperclip size={16} /> {ticket.attachments}
                  </div>
                  <button
                    className="text-xs px-3 py-1 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-200 text-gray-700 transition"
                    onClick={() => handleDownload(ticket.attachments)}
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Clock size={18} /> Timeline
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-1"></span>
              <div>
                <p className="font-medium">Ticket Created</p>
                <p className="text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600 mt-1"></span>
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-gray-600">
                  {ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not updated yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            {statusOrder.map((status, index) => {
              const color = colorMap[status];
              const isDisabled =
                 index <= currentStatusIndex; // 🔥 disable current & previous statuses

              return (
                <button
                  key={status}
                  disabled={isDisabled}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full px-4 py-2 rounded-xl font-semibold border shadow-sm border-${color}-300
                    ${
                      isDisabled
                        ? `bg-gray-200 text-gray-500 cursor-not-allowed`
                        : `bg-${color}-100 text-${color}-700 hover:bg-${color}-600 hover:text-white hover:shadow-md transition-all duration-200`
                    }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
