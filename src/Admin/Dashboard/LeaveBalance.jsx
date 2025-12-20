// import { useState, useMemo } from "react";

// const LeaveBalance = ({ data = [] }) => {
// console.log(data);

//   /* =====================================================
//      1️⃣ EMPLOYEE-WISE DATA (HOOK #1)
//   ===================================================== */
//   const employeeDataList = useMemo(() => {
//     const map = {};

//     data.forEach((item) => {
//       const empId = item.employee?._id;
//       if (!empId) return;

//       if (!map[empId]) {
//         map[empId] = {
//           employee: item.employee,
//           annualLeave: item.annualLeave,
//           leaves: [],
//         };
//       }

//       map[empId].leaves.push(item);
//     });

//     return Object.values(map);
//   }, [data]);

//   /* =====================================================
//      2️⃣ STATE (HOOK #2)
//   ===================================================== */
//   const [currentIndex, setCurrentIndex] = useState(0);

//   /* =====================================================
//      3️⃣ CURRENT EMPLOYEE (NO HOOK)
//   ===================================================== */
//   const currentEmployeeData = employeeDataList[currentIndex] || null;

//   /* =====================================================
//      4️⃣ LEAVE SUMMARY (HOOK #3)
//   ===================================================== */
//   const leaveSummary = useMemo(() => {
//     if (!currentEmployeeData) return {};

//     const summary = {
//       "Earned Leave": 0,
//       "Casual Leave": 0,
//       "Sick Leave": 0,
//     };

//     currentEmployeeData.leaves.forEach((leave) => {
//       summary[leave.leaveType] =
//         (summary[leave.leaveType] || 0) + 1;
//     });

//     return summary;
//   }, [currentEmployeeData]);

//   /* =====================================================
//      5️⃣ SAFETY RENDER (AFTER ALL HOOKS)
//   ===================================================== */
//   if (!currentEmployeeData) {
//     return <p className="text-center">No leave data available</p>;
//   }

//   /* =====================================================
//      6️⃣ CONSTANTS & HELPERS
//   ===================================================== */
//   const TOTAL_LEAVES = {
//     "Earned Leave": currentEmployeeData.annualLeave || 0,
//     "Casual Leave": 10,
//     "Sick Leave": 10,
//   };

//   const getEmployeeName = (emp) => emp?.fullName || "Employee";

//   /* =====================================================
//      7️⃣ NAVIGATION
//   ===================================================== */
//   const handleNext = () => {
//     if (currentIndex < employeeDataList.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   /* =====================================================
//      8️⃣ UI
//   ===================================================== */
//   return (
//     <div className="flex items-center justify-around">

//       <button
//         onClick={handlePrev}
//         disabled={currentIndex === 0}
//         className="text-xl disabled:opacity-30"
//       >
//         ◀
//       </button>

//       <div className="bg-white w-full p-6 rounded-2xl shadow-md mx-4">

//         <h3 className="text-lg font-semibold mb-6">
//           Employee Leave Balance –{" "}
//           {getEmployeeName(currentEmployeeData.employee)}
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

//           {Object.keys(TOTAL_LEAVES).map((type) => {
//             const used = leaveSummary[type] || 0;
//             const total = TOTAL_LEAVES[type];
//             const remaining = Math.max(total - used, 0);
//             const percent =
//               total > 0 ? Math.min((used / total) * 100, 100) : 0;

//             return (
//               <div key={type}>
//                 <div className="flex justify-between mb-1">
//                   <span className="font-medium">
//                     {type === "Earned Leave" ? "Annual Leave" : type}
//                   </span>
//                   <span className="text-xs bg-blue-100 px-3 py-1 rounded-full">
//                     {used}/{total}
//                   </span>
//                 </div>

//                 <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full"
//                     style={{ width: `${percent}%` }}
//                   />
//                 </div>

//                 <p className="text-sm text-gray-500">
//                   {remaining} days remaining
//                 </p>
//               </div>
//             );
//           })}

//         </div>
//       </div>

//       <button
//         onClick={handleNext}
//         disabled={currentIndex === employeeDataList.length - 1}
//         className="text-xl disabled:opacity-30"
//       >
//         ▶
//       </button>
//     </div>
//   );
// };

// export default LeaveBalance;



import { useState, useMemo, useEffect } from "react";

const AUTO_SCROLL_DELAY = 4000;

const LeaveBalance = ({ data = [] }) => {

  /* =====================================================
     1️⃣ EMPLOYEE-WISE DATA
  ===================================================== */
  const employeeDataList = useMemo(() => {
    const map = {};

    data.forEach((item) => {
      const empId = item.employee?._id;
      if (!empId) return;

      if (!map[empId]) {
        map[empId] = {
          employee: item.employee,
          leaves: [],
        };
      }
      map[empId].leaves.push(item);
    });

    return Object.values(map);
  }, [data]);

  /* =====================================================
     2️⃣ STATE
  ===================================================== */
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEmployeeData = employeeDataList[currentIndex] || null;

  /* =====================================================
     3️⃣ AUTO SCROLL (INFINITE LOOP)
  ===================================================== */
  useEffect(() => {
    if (employeeDataList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === employeeDataList.length - 1 ? 0 : prev + 1
      );
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(timer);
  }, [employeeDataList.length]);

  /* =====================================================
     4️⃣ LEAVE SUMMARY (CURRENT YEAR)
  ===================================================== */
  const leaveSummary = useMemo(() => {
    if (!currentEmployeeData) return {};

    const CURRENT_YEAR = new Date().getFullYear();

    const summary = {
      "Earned Leave": 0,
      "Casual Leave": 0,
      "Sick Leave": 0,
    };

    currentEmployeeData.leaves
      .filter(
        (leave) =>
          new Date(leave.startDate).getFullYear() === CURRENT_YEAR
      )
      .forEach((leave) => {
        summary[leave.leaveType] =
          (summary[leave.leaveType] || 0) + 1;
      });

    return summary;
  }, [currentEmployeeData]);

  if (!currentEmployeeData) {
    return <p className="text-center">No leave data available</p>;
  }

  /* =====================================================
     5️⃣ LEAVE POLICY
  ===================================================== */
  const TOTAL_LEAVES = {
    "Earned Leave": 24,
    "Casual Leave": 10,
    "Sick Leave": 10,
  };

  const getEmployeeName = (emp) => emp?.fullName || "Employee";

  /* =====================================================
     6️⃣ BUTTON NAVIGATION (LOOP)
  ===================================================== */
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === employeeDataList.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? employeeDataList.length - 1 : prev - 1
    );
  };

  /* =====================================================
     7️⃣ UI
  ===================================================== */
  return (
    <div className="relative w-full max-w-5xl mx-auto">

      {/* ◀ PREVIOUS */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                   bg-white/80 hover:bg-white shadow-lg 
                   w-10 h-10 rounded-full text-xl flex items-center justify-center"
      >
        ◀
      </button>

      {/* CARD */}
      <div className="overflow-hidden px-14">
        <div
          key={currentIndex}
          className="animate-slideFade bg-white p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Employee Leave Balance –{" "}
            <span className="text-blue-600">
              {getEmployeeName(currentEmployeeData.employee)}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            {Object.keys(TOTAL_LEAVES).map((type) => {
              const used = leaveSummary[type] || 0;
              const total = TOTAL_LEAVES[type];
              const remaining = Math.max(total - used, 0);
              const percent =
                total > 0 ? Math.min((used / total) * 100, 100) : 0;

              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">
                      {type}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {used}/{total}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {remaining} days remaining
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ▶ NEXT */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                   bg-white/80 hover:bg-white shadow-lg 
                   w-10 h-10 rounded-full text-xl flex items-center justify-center"
      >
        ▶
      </button>

      {/* DOT INDICATOR */}
      <div className="flex justify-center gap-2 mt-4">
        {employeeDataList.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaveBalance;
