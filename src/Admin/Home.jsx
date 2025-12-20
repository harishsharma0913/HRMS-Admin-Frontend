// import TicketDashboard from "./Dashboard/TicketDashboard";
// import TicketCategoryAndPriority from "./Dashboard/TicketCategoryAndPriority";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useMemo, useState } from "react";
// import { getAllLeaves } from "./ReduxToolkit/authSlice";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { leaves, getLeavesLoading, getLeavesError } = useSelector(
//     (state) => state.auth
//   );
//   console.log(leaves);
//   const WEEKS = ["W1", "W2", "W3", "W4", "W5"];
//   useEffect(() => {
//     dispatch(getAllLeaves());
//   }, [dispatch]);

//   const openLeavePage = () => {
//     navigate("/leave");
//   };

//    const [active, setActive] = useState(""); // Track active filter button

//   const filters = [
//     "Last 7 Days",
//     "Last 30 Days",
//     "This Month",
//   ];
  

// const getWeekKey = (date) =>
//   "W" + Math.ceil(new Date(date).getDate() / 7);

// const totalGraph = useMemo(() => {
//   const map = {};

//   leaves.forEach((l) => {
//     const w = getWeekKey(l.createdAt);
//     map[w] = (map[w] || 0) + 1;
//   });

//   return WEEKS.map((w) => map[w] || 0);
// }, [leaves]);

// const pendingGraph = useMemo(() => {
//   const map = {};

//   leaves
//     .filter((l) => l.status === "pending")
//     .forEach((l) => {
//       const w = getWeekKey(l.createdAt);
//       map[w] = (map[w] || 0) + 1;
//     });

//   return WEEKS.map((w) => map[w] || 0);
// }, [leaves]);
 
// const approvalGraph = useMemo(() => {
//   const map = {};

//   leaves.forEach((l) => {
//     const w = getWeekKey(l.createdAt);

//     if (!map[w]) map[w] = { approved: 0, total: 0 };

//     map[w].total++;
//     if (l.status === "approved") map[w].approved++;
//   });

//   return WEEKS.map((w) =>
//     map[w] ? Math.round((map[w].approved / map[w].total) * 100) : 0
//   );
// }, [leaves]);

// const rejectedGraph = useMemo(() => {
//   const map = {};

//   leaves
//     .filter((l) => l.status === "rejected")
//     .forEach((l) => {
//       const w = getWeekKey(l.createdAt);
//       map[w] = (map[w] || 0) + 1;
//     });

//   return WEEKS.map((w) => map[w] || 0);
// }, [leaves]);

// const getHeight = (value, max) =>
//   max === 0 ? "5%" : `${(value / max) * 100}%`;


// const {
//   totalLeaves,
//   pendingLeaves,
//   approvalRate,
//   avgRejected,
// } = useMemo(() => {
//   if (!leaves || leaves.length === 0) {
//     return {
//       totalLeaves: 0,
//       pendingLeaves: 0,
//       approvalRate: 0,
//       avgRejected: 0,
//     };
//   }

//   const total = leaves.length;

//   const pending = leaves.filter(
//     (l) => l.status === "pending"
//   ).length;

//   const approved = leaves.filter(
//     (l) => l.status === "approved"
//   ).length;

//   const rejected = leaves.filter(
//     (l) => l.status === "rejected"
//   ).length;

//   const approval =
//     total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

//   // simple average rejected per month (last 6 months)
//   const avgRej = (rejected / 6).toFixed(1);

//   return {
//     totalLeaves: total,
//     pendingLeaves: pending,
//     approvalRate: approval,
//     avgRejected: avgRej,
//   };
// }, [leaves]);




//   return (
//     <div>
//       {/* Header */}
//       <div className=" hidden md:flex items-center justify-between border-b p-4">
//         <div>
//           <h1 className="text-2xl text-purple-600">Leave Management</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="text-right font-bold">
//             <p className="text-sm">Admin User</p>
//             <p className="text-xs text-muted-foreground">HR Department</p>
//           </div>
//           <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
//             A
//           </div>
//         </div>
//       </div>
//       <div className="p-6  bg-pink-50">
      
//       {/* Filters */}
//       <div className="w-full mb-4 bg-white p-6 rounded-2xl shadow-md">
//         {/* Top Row: Input + Buttons */}
//         <div className="w-full mb-3">
//           {/* FOR WEB (md and above) – exactly same as your design */}
//           <div className="hidden md:flex justify-between items-center gap-4">
//             <input
//               type="text"
//               placeholder="search by employee..."
//               className="px-4 py-2 w-full bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
//               onChange={(e) => setSearchEmployee(e.target.value)}
//             />

//             <div className="flex gap-3 shrink-0">
//               {filters.map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => setActive(item)}
//                   className={`px-4 py-2 rounded-lg border transition
//                     ${
//                       active === item
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
//                     }`}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* FOR MOBILE (below md) */}
//           <div className="flex flex-col gap-3 md:hidden">

//             {/* Input on top */}
//             <input
//               type="text"
//               placeholder="search by employee..."
//               className="px-4 py-2 w-full bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
//               onChange={(e) => setSearchEmployee(e.target.value)}
//             />

//             {/* Buttons in one line */}
//             <div className="grid grid-cols-3 gap-3">
//               {filters.map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => setActive(item)}
//                   className={`px-2 py-2 rounded-lg border text-sm transition
//                     ${
//                       active === item
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
//                     }`}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>

//           </div>

//         </div>
//         {/* Date Inputs */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium block mb-2">From Date</label>
//             <input
//               type="date"
//               className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="font-medium block mb-2">To Date</label>
//             <input
//               type="date"
//               className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none"
//             />
//           </div>
//         </div>
//       </div>
      
//       {/* Leave Management Summary */}
//       <div className=" text-gray-800">
//         <h2 className="text-lg font-medium mb-3">Leave Management Summary</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">

//           {/* Total Applications (Dynamic) */}
//            <div className="bg-blue-100 p-5 rounded-2xl shadow-lg cursor-pointer">
//       <h4 className=" font-bold mb-1">Total Applications</h4>
//       <p className="text-4xl font-bold text-blue-500 mb-4">{totalLeaves}</p>
// <div className="w-full h-28 flex items-end space-x-2">
//   {totalGraph.map((val, i) => (
//     <div
//       key={i}
//       className="bg-blue-500 rounded-sm w-1/5"
//       style={{ height: getHeight(val, Math.max(...totalGraph)) }}
//     />
//   ))}
// </div>

// <p className="font-bold text-sm mt-2">W1 - W5</p>

//     </div>

//           {/* Pending Review */}
//             <div className="bg-teal-100 p-5 rounded-2xl shadow-lg cursor-pointer">
//       <h4 className="font-bold mb-1">Pending Review</h4>
//       <p className="text-4xl font-bold text-teal-500 mb-4">{pendingLeaves}</p>
// <div className="w-full h-28 flex items-end space-x-2">
//   {pendingGraph.map((val, i) => (
//     <div
//       key={i}
//       className="bg-teal-500 rounded-sm w-1/5"
//       style={{ height: `${val * 15}%` }}
//     />
//   ))}
// </div>

//       <p className=" font-bold text-sm mt-2">W1 - W5</p>
//     </div>


//           {/* Approval Rate */}
//             <div className="bg-purple-100 p-5 rounded-2xl shadow-lg cursor-pointer">
//       <h4 className=" font-bold mb-1">Approval Rate</h4>
//       <p className="text-4xl font-bold text-purple-500 mb-4"> {approvalRate}%</p>
// <div className="w-full h-28 flex items-end space-x-2">
//   {approvalGraph.map((val, i) => (
//     <div
//       key={i}
//       className="bg-purple-500 rounded-sm w-1/6"
//       style={{ height: `${val}%` }}
//     />
//   ))}
// </div>

//       <p className=" font-bold text-sm mt-2">Jan - Jun</p>
//     </div>

//           {/* Avg Rejected */}
//               <div className="bg-red-200 p-5 rounded-2xl shadow-lg cursor-pointer">
//       <h4 className=" font-bold mb-1">Avg Rejected</h4>
//       <p className="text-4xl font-bold text-red-500 mb-4">{avgRejected}</p>
// <div className="w-full h-28 flex items-end space-x-2">
//   {rejectedGraph.map((val, i) => (
//     <div
//       key={i}
//       className="bg-red-500 rounded-sm w-1/4"
//       style={{ height: `${val * 20}%` }}
//     />
//   ))}
// </div>

//       <p className=" font-bold text-sm mt-2">Jan - Apr</p>
//     </div>

//         </div>

//         {/* ====================== Employee Leave Balance ====================== */}
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           {/* Heading */}
//           <h3 className="text-lg font-semibold text-gray-800 mb-6">
//             Employee Leave Balance - Priya Sharma
//           </h3>

//           {/* Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

//             {/* Annual Leave */}
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-700 font-medium">Annual Leave</span>
//                 <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
//                   8/24
//                 </span>
//               </div>

//               {/* Progress bar */}
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                 <div
//                   className="bg-blue-600 h-2 rounded-full"
//                   style={{ width: "33%" }}
//                 ></div>
//               </div>

//               <p className="text-sm text-gray-500">16 days remaining</p>
//             </div>

//             {/* Sick Leave */}
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-700 font-medium">Sick Leave</span>
//                 <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
//                   2/10
//                 </span>
//               </div>

//               {/* Progress bar */}
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                 <div
//                   className="bg-purple-600 h-2 rounded-full"
//                   style={{ width: "20%" }}
//                 ></div>
//               </div>

//               <p className="text-sm text-gray-500">8 days remaining</p>
//             </div>

//             {/* Casual Leave */}
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-700 font-medium">Casual Leave</span>
//                 <span className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">
//                   5/12
//                 </span>
//               </div>

//               {/* Progress bar */}
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                 <div
//                   className="bg-gray-800 h-2 rounded-full"
//                   style={{ width: "42%" }}
//                 ></div>
//               </div>

//               <p className="text-sm text-gray-500">7 days remaining</p>
//             </div>

//           </div>
//         </div>

//       </div>

//       <TicketDashboard />
//       <TicketCategoryAndPriority />
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeaves } from "./ReduxToolkit/authSlice";
import TicketDashboard from "./Dashboard/TicketDashboard";
import LeaveBalance from "./Dashboard/LeaveBalance";
import LeaveChart from "./Dashboard/LeaveChart";

export default function Home() {
  const dispatch = useDispatch();
  const { leaves = [] } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  const WEEKS = ["W1", "W2", "W3", "W4", "W5"];

  const getWeekKey = (date) => {
    const d = new Date(date).getDate();
    return "W" + Math.min(5, Math.ceil(d / 7));
  };

  const getHeight = (value, max) => {
    if (!max || max === 0) return "5%";
    return `${(value / max) * 100}%`;
  };

  /* ======================= GRAPHS ======================= */

  const totalGraph = useMemo(() => {
    const map = {};
    leaves.forEach((l) => {
      const w = getWeekKey(l.createdAt);
      map[w] = (map[w] || 0) + 1;
    });
    return WEEKS.map((w) => map[w] || 0);
  }, [leaves]);

  const pendingGraph = useMemo(() => {
    const map = {};
    leaves.forEach((l) => {
      if (l.status?.toLowerCase() !== "pending") return;
      const w = getWeekKey(l.createdAt);
      map[w] = (map[w] || 0) + 1;
    });
    return WEEKS.map((w) => map[w] || 0);
  }, [leaves]);

  const approvalGraph = useMemo(() => {
    const map = {};
    leaves.forEach((l) => {
      const w = getWeekKey(l.createdAt);
      if (!map[w]) map[w] = { approved: 0, total: 0 };
      map[w].total++;
      if (l.status?.toLowerCase() === "approved") map[w].approved++;
    });
    return WEEKS.map((w) =>
      map[w] ? Math.round((map[w].approved / map[w].total) * 100) : 0
    );
  }, [leaves]);

  const rejectedGraph = useMemo(() => {
    const map = {};
    leaves.forEach((l) => {
      if (l.status?.toLowerCase() !== "rejected") return;
      const w = getWeekKey(l.createdAt);
      map[w] = (map[w] || 0) + 1;
    });
    return WEEKS.map((w) => map[w] || 0);
  }, [leaves]);

  /* ======================= COUNTS ======================= */

  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter(
    (l) => l.status?.toLowerCase() === "pending"
  ).length;
  const approvedLeaves = leaves.filter(
    (l) => l.status?.toLowerCase() === "approved"
  ).length;
  const rejectedLeaves = leaves.filter(
    (l) => l.status?.toLowerCase() === "rejected"
  ).length;

  const approvalRate = totalLeaves
    ? ((approvedLeaves / totalLeaves) * 100).toFixed(1)
    : 0;

  const avgRejected = (rejectedLeaves / 6).toFixed(1);

  return (
    <div >
      {/* HEADER */}
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

      {/* SUMMARY */}
      <div className="p-6 bg-pink-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Leave Management Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* TOTAL */}
        <div className="bg-blue-100 p-5 rounded-2xl shadow">
          <h4 className="font-bold">Total Applications</h4>
          <p className="text-4xl font-bold text-blue-500 mb-4">{totalLeaves}</p>
          <div className="w-full h-28 flex items-end space-x-2">
            {totalGraph.map((v, i) => (
              <div
                key={i}
                className="bg-blue-500 w-1/5 rounded-sm"
                style={{ height: getHeight(v, Math.max(...totalGraph)) }}
              />
              
            ))}
          </div>
          <p className="flex justify-around font-semibold mt-1">
           <span>W1</span>
           <span>W2</span>
           <span>W3</span>
           <span>W4</span>
           <span>W5</span>
          </p>
        </div>

        {/* PENDING */}
        <div className="bg-teal-100 p-5 rounded-2xl shadow">
          <h4 className="font-bold">Pending Review</h4>
          <p className="text-4xl font-bold text-teal-500 mb-4">
            {pendingLeaves}
          </p>
          <div className="w-full h-28 flex items-end space-x-2">
            {pendingGraph.map((v, i) => (
              <div
                key={i}
                className="bg-teal-500 w-1/5 rounded-sm"
                style={{ height: getHeight(v, Math.max(...pendingGraph)) }}
              />
            ))}
          </div>
          <p className="flex justify-around font-semibold mt-1">
           <span>W1</span>
           <span>W2</span>
           <span>W3</span>
           <span>W4</span>
           <span>W5</span>
          </p>        </div>

        {/* APPROVAL */}
        <div className="bg-purple-100 p-5 rounded-2xl shadow">
          <h4 className="font-bold">Approval Rate</h4>
          <p className="text-4xl font-bold text-purple-500 mb-4">
            {approvalRate}%
          </p>
          <div className="w-full h-28 flex items-end space-x-2">
            {approvalGraph.map((v, i) => (
              <div
                key={i}
                className="bg-purple-500 w-1/5 rounded-sm"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
          <p className="flex justify-around font-semibold mt-1">
           <span>W1</span>
           <span>W2</span>
           <span>W3</span>
           <span>W4</span>
           <span>W5</span>
          </p>        </div>

        {/* REJECTED */}
        <div className="bg-red-200 p-5 rounded-2xl shadow">
          <h4 className="font-bold">Avg Rejected</h4>
          <p className="text-4xl font-bold text-red-500 mb-4">
            {avgRejected}
          </p>
          <div className="w-full h-28 flex items-end space-x-2">
            {rejectedGraph.map((v, i) => (
              <div
                key={i}
                className="bg-red-500 w-1/5 rounded-sm"
                style={{ height: getHeight(v, Math.max(...rejectedGraph)) }}
              />
            ))}
          </div>
          <p className="flex justify-around font-semibold mt-1">
           <span>W1</span>
           <span>W2</span>
           <span>W3</span>
           <span>W4</span>
           <span>W5</span>
          </p>        </div>
      </div>

      <LeaveBalance data={leaves} />
      <LeaveChart data={leaves} />
      <TicketDashboard />
    </div>

    </div>
  );
}
