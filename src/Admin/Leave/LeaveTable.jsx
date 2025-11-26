import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredLeaves } from "../ReduxToolkit/authSlice";
import LeaveDetailsModal from "./LeaveDetailsModal";

const LeaveTable = () => {
  const dispatch = useDispatch();
  const { leavesFiltered, getFilteredLeavesLoading, getFilteredLeavesError } = useSelector(
    (state) => state.auth
  );
  console.log(leavesFiltered);

  const [selectedLeave, setSelectedLeave] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [nameFilter, setNameFilter] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(
      getFilteredLeaves({
        status: statusFilter === "All Status" ? "All" : statusFilter,
        type: typeFilter === "All Types" ? "All" : typeFilter,
        page: page,
        limit: limit,
        search: nameFilter.trim() === "" ? "" : nameFilter,
      })
    );
  }, [dispatch, statusFilter, typeFilter, page, limit, nameFilter]);

  const filteredLeaves = leavesFiltered?.leave || [];

  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-600",
    Approved: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
    Cancelled: "bg-gray-200 text-gray-600",
  };

  // Handlers
  const handleApprove = (id) => {
    console.log("Approve leave:", id);
    setSelectedLeave(null);
  };

  const handleCancel = (id) => {
    console.log("Cancel leave:", id);
    setSelectedLeave(null);
  };

  const getPageNumbers = () => {
  const totalPages = leavesFiltered?.pagination?.totalPages || 0;
  const maxVisible = 3; // ek time par 3 page buttons

  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};


  return (
    <div className="pt-6 pb-4">
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Leave Applications</h2>

        {/* 🔹 Filters row */}
        <div className="flex flex-col md:flex-row gap-5 mb-4">
          {/* Search */}
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search by name, employee ID or email..."
            className="border bg-gray-100 rounded-lg px-3 py-2 w-full md:w-2/3"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border bg-gray-100 rounded-lg px-3 py-2"
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
            <option>Cancelled</option>
          </select>
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border bg-gray-100 rounded-lg px-3 py-2"
          >
            <option>All Types</option>
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Earned Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        {/* 🔹 Table */}
        <div className="overflow-x-auto border rounded-lg shadow-sm">
  {getFilteredLeavesLoading ? (
    <p className="p-4 text-gray-600 text-center">⏳ Loading...</p>
  ) : getFilteredLeavesError ? (
    <p className="p-4 text-red-500">Error: {getFilteredLeavesError}</p>
  ) : (
    <table className="w-full border-collapse text-sm text-gray-600">
      <thead>
        <tr className="bg-gray-100 text-left text-sm text-gray-700">
          <th className="p-3 pl-16">Employee</th>
          <th className="p-3 text-center">Leave Type</th>
          <th className="p-3 text-center">Start Date</th>
          <th className="p-3 text-center">End Date</th>
          <th className="p-3 text-center">Duration</th>
          <th className="p-3 text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredLeaves?.length > 0 ? (
          filteredLeaves.map((leave, idx) => {
            const startDate = new Date(
              leave.startDate
            ).toLocaleDateString("en-GB");
            const endDate = new Date(
              leave.endDate
            ).toLocaleDateString("en-GB");

            return (
              <tr
                key={idx}
                className="border-t cursor-pointer hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 text-center"
                onClick={() => setSelectedLeave(leave)}
              >
                {/* Employee */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`http://localhost:5000/uploads/${leave.employee?.documents?.profileImage}`}
                      alt={leave.employee?.fullName || "Profile"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">
                        {leave.employee?.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {leave.employee?.employeeId}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Leave Type */}
                <td className="p-3 text-center">{leave.leaveType}</td>

                {/* Dates */}
                <td className="p-3 text-center">{startDate}</td>
                <td className="p-3 text-center">{endDate}</td>

                {/* Duration */}
                <td className="p-3 text-center">{leave.duration}</td>

                {/* Status */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[leave.status]}`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan="6"
              className="text-center p-4 text-gray-500"
            >
              No leave records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )}
        </div>

{/* 🔹 Pagination Controls */}
{leavesFiltered?.pagination && (
  <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
    <div className="text-sm text-gray-600">
  {filteredLeaves && filteredLeaves.length > 0 ? (
    <>
      Showing {(page - 1) * limit + 1} to{" "}
      {Math.min(page * limit, leavesFiltered.pagination.total)} of{" "}
      {leavesFiltered.pagination.total} results
    </>
  ) : (
    "No results found"
  )}
</div>


    {leavesFiltered.pagination.totalPages > 1 && (
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {getPageNumbers().map((p) => (
  <button
    key={p}
    onClick={() => setPage(p)}
    className={`px-3 py-1 border rounded ${
      page === p ? "bg-blue-500 text-white" : ""
    }`}
  >
    {p}
  </button>
))}

        <button
          disabled={page === leavesFiltered.pagination.totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* Limit per page */}
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Select limit</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
    )}
  </div>
)}

      </div>

      {/* 🔹 Modal */}
      {selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default LeaveTable;
