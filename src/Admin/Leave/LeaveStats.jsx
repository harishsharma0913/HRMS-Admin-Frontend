import { useEffect } from "react";
import {
  FaCalendarAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeaves } from "../ReduxToolkit/authSlice";

const LeaveStats = () => {
  const dispatch = useDispatch();
  const { leaves, getLeavesLoading, getLeavesError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  if (getLeavesLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">Loading stats...</span>
      </div>
    );
  }

  if (getLeavesError) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-md text-center font-medium">
        ❌ Failed to load leave stats: {getLeavesError}
      </div>
    );
  }

  const stats = {
    total: leaves.length,
    pending: leaves.filter((leave) => leave.status === "Pending").length,
    approved: leaves.filter((leave) => leave.status === "Approved").length,
    rejected: leaves.filter((leave) => leave.status === "Rejected").length,
  };

  const cards = [
    {
      icon: <FaCalendarAlt className="text-blue-500 text-xl" />,
      label: "Total Leaves",
      value: stats.total,
      color: "bg-blue-100",
    },
    {
      icon: <FaHourglassHalf className="text-yellow-500 text-xl" />,
      label: "Pending",
      value: stats.pending,
      color: "bg-yellow-100",
    },
    {
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      label: "Approved",
      value: stats.approved,
      color: "bg-green-100",
    },
    {
      icon: <FaTimesCircle className="text-red-500 text-xl" />,
      label: "Rejected",
      value: stats.rejected,
      color: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-lg shadow flex items-center gap-3"
        >
          <div className={`p-3 rounded-full ${card.color}`}>{card.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <h2 className="text-lg font-bold">{card.value} Requests</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStats;
