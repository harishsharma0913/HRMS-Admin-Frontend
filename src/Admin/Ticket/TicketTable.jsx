import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredTickets } from "../ReduxToolkit/ticketSlice";
import TicketDetailsModal from "./TicketDetailsModal";

const TicketTable = () => {
  const dispatch = useDispatch();
  const { filteredTickets, total, page, pages, getFilteredTicketLoading, getFilteredTicketError } = useSelector(
    (state) => state.tickets
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // 🔹 API call jab component load ho ya filters/page change ho
  useEffect(() => {
    dispatch(
      getFilteredTickets({
        search,
        status,
        priority,
        category,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, search, status, priority, category, currentPage, limit]);

  const handleStatusUpdate = (id) => {
    console.log("Update ticket status:", id);
    setSelectedTicket(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Critical":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 bg-white border-1 border-gray-200 rounded-xl shadow-md">
      {/* 🔍 Search and Filters */}
      <h2 className="text-sm font-medium mb-2">Support Tickets</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search tickets, employees, or categories..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // 🔹 new search reset to first page
            }}
          />
        </div>

        {/* <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-lg bg-gray-200 focus:outline-none"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="px-3 py-2 bg-gray-200 rounded-lg focus:outline-none"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>   */}
        <div className="flex flex-col sm:flex-row gap-2 ">
  <select
    className="w-full sm:w-auto flex-1 px-3 py-2 rounded-lg bg-gray-200 focus:outline-none"
    value={status}
    onChange={(e) => {
      setStatus(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Closed">Closed</option>
  </select>

  <select
    className="w-full sm:w-auto flex-1 px-3 py-2 bg-gray-200 rounded-lg focus:outline-none"
    value={priority}
    onChange={(e) => {
      setPriority(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="">All Priorities</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>

      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto border-1 border-gray-200 rounded-lg shadow-sm">
        {getFilteredTicketLoading ? (
          <p className="p-4 text-gray-500 text-center">Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No tickets found</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Ticket</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                    onClick={()=> setSelectedTicket(ticket)} // open modal on row click
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {ticket.subject}
                        </span>
                        <span className="text-sm text-gray-500">
                          {ticket.ticketId}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {ticket.employee?.fullName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {ticket.designation?.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{ticket.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           
          </>
        )}
      </div>

      {/* 📌 Pagination */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 px-2">
  {/* Showing text */}
  <p className="text-sm text-gray-600 text-center sm:text-left">
    Showing {(currentPage - 1) * limit + 1} -{" "}
    {Math.min(currentPage * limit, total)} of {total}
  </p>

  {/* 🔹 Limit dropdown */}
  <div className="flex items-center justify-center sm:justify-end gap-2">
    <label className="text-sm text-gray-600 whitespace-nowrap">
      Rows per page:
    </label>
    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="px-2 py-1 border border-gray-200 focus:outline-none rounded bg-gray-200 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  </div>

  {/* Pagination buttons */}
  <div className="flex justify-center sm:justify-end items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
    >
      Prev
    </button>
    <span className="px-2 text-sm text-gray-700">
      Page {currentPage} of {pages}
    </span>
    <button
      disabled={currentPage === pages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
    >
      Next
    </button>
  </div>
       </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default TicketTable;
