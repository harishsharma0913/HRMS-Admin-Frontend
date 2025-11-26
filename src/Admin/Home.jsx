import TicketDashboard from "./Dashboard/TicketDashboard";
import TicketCategoryAndPriority from "./Dashboard/TicketCategoryAndPriority";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getAllLeaves } from "./ReduxToolkit/authSlice";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaves, getLeavesLoading, getLeavesError } = useSelector(
    (state) => state.auth
  );
  console.log(leaves);
  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  const openLeavePage = () => {
    navigate("/leave");
  };

   const [active, setActive] = useState(""); // Track active filter button

  const filters = [
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
  ];

  const { totalLeaves, recentLeaves, percentageChange } = useMemo(() => {
    if (!leaves || leaves.length === 0)
      return { totalLeaves: 0, recentLeaves: 0, percentageChange: 0 };

    const now = new Date();

    const leavesInLast30Days = leaves.filter((leave) => {
      const created = new Date(leave.createdAt);
      const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
      return diffInDays <= 30;
    });

    const total = leaves.length;
    const recent = leavesInLast30Days.length;

    const percent =
      total > 0 ? ((recent / total) * 100).toFixed(1) : 0;

    return {
      totalLeaves: total,
      recentLeaves: recent,
      percentageChange: percent,
    };
  }, [leaves]);

  return (
    <div>
      {/* Header */}
      <div className=" hidden md:flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl text-purple-600">Leave Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right font-bold">
            <p className="text-sm">Admin User</p>
            <p className="text-xs text-muted-foreground">HR Department</p>
          </div>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
            A
          </div>
        </div>
      </div>
      <div className="p-6  bg-pink-50">
      <div className="w-full rounded-xl">

      {/* Filter Buttons */}
     <div className="flex flex-wrap justify-between items-center mb-2">

  {/* Heading Left */}
  <h2 className="text-2xl font-semibold mb-1">Date Filter</h2>

  {/* Buttons Right */}
  <div className="flex flex-wrap gap-3">
    {filters.map((item) => (
      <button
        key={item}
        onClick={() => setActive(item)}
        className={`px-4 py-2 border bg-gray-300 rounded-lg transition
          ${
            active === item
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 border-gray-300 hover:bg-gray-400"
          }`}
      >
        {item}
      </button>
    ))}
  </div>

     </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-semibold block mb-1">From Date</label>
          <input
            type="date"
            className="w-full px-3 py-3 bg-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">To Date</label>
          <input
            type="date"
            className="w-full px-3 py-3 bg-gray-300 rounded-lg focus:outline-none"
          />
        </div>
      </div>
      </div>

      <div className=" text-gray-800">
        <h2 className="text-lg font-medium mb-3">Leave Management Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">

          {/* Total Applications (Dynamic) */}
           <div className="bg-blue-200 p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in cursor-pointer">
      <h4 className=" font-bold mb-1">Total Applications</h4>
      <p className="text-4xl font-bold text-blue-500 mb-4">{totalLeaves}</p>
      <div className="w-full h-28 flex items-end space-x-2">
        {["20%", "35%", "50%", "65%", "80%", "95%"].map((h, i) => (
          <div
            key={i}
            className="bg-blue-500 rounded-sm w-1/6"
            style={{ height: h }}
          ></div>
        ))}
      </div>
      <p className=" font-bold text-sm mt-2">Jan - Jun</p>
    </div>

          {/* Pending Review */}
            <div className="bg-teal-200 p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in cursor-pointer">
      <h4 className="font-bold mb-1">Pending Review</h4>
      <p className="text-4xl font-bold text-teal-500 mb-4">18</p>
      <div className="w-full h-28 flex items-end space-x-2">
        {["25%", "45%", "70%", "60%", "50%"].map((h, i) => (
          <div
            key={i}
            className="bg-teal-500 rounded-sm w-1/5"
            style={{ height: h }}
          ></div>
        ))}
      </div>
      <p className=" font-bold text-sm mt-2">W1 - W5</p>
    </div>


          {/* Approval Rate */}
            <div className="bg-purple-200 p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in cursor-pointer">
      <h4 className=" font-bold mb-1">Approval Rate</h4>
      <p className="text-4xl font-bold text-purple-500 mb-4">85%</p>
      <div className="w-full h-28 flex items-end space-x-2">
        {["25%", "40%", "55%", "70%", "80%", "85%"].map((h, i) => (
          <div
            key={i}
            className="bg-purple-500 rounded-sm w-1/6"
            style={{ height: h }}
          ></div>
        ))}
      </div>
      <p className=" font-bold text-sm mt-2">Jan - Jun</p>
    </div>

          {/* Avg Rejected */}
              <div className="bg-red-200 p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in cursor-pointer">
      <h4 className=" font-bold mb-1">Avg Rejected</h4>
      <p className="text-4xl font-bold text-red-500 mb-4">2.1</p>
      <div className="w-full h-28 flex items-end space-x-2">
        {["30%", "45%", "65%", "55%", "25%"].map((h, i) => (
          <div
            key={i}
            className="bg-red-500 rounded-sm w-1/4"
            style={{ height: h }}
          ></div>
        ))}
      </div>
      <p className=" font-bold text-sm mt-2">Jan - Apr</p>
    </div>

        </div>

        {/* ====================== Employee Leave Balance ====================== */}
        <div className="bg-gray-100 p-6 rounded-2xl border-amber-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-5">
            Employee Leave Balance - Priya Sharma
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Annual Leave */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">Annual Leave</span>
                <span className="text-sm text-gray-600">8/24</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-[6px] mb-1">
                <div
                  className="bg-gray-800 h-[6px] rounded-full"
                  style={{ width: "33%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">16 days remaining</p>
            </div>

            {/* Sick Leave */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">Sick Leave</span>
                <span className="text-sm text-gray-600">2/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-[6px] mb-1">
                <div
                  className="bg-gray-800 h-[6px] rounded-full"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">8 days remaining</p>
            </div>

            {/* Casual Leave */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">Casual Leave</span>
                <span className="text-sm text-gray-600">5/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-[6px] mb-1">
                <div
                  className="bg-gray-800 h-[6px] rounded-full"
                  style={{ width: "42%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">7 days remaining</p>
            </div>
          </div>
        </div>
      </div>

      <TicketDashboard />
      <TicketCategoryAndPriority />
      </div>
    </div>
  );
}
