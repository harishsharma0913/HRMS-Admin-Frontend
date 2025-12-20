import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useMemo } from "react";

const COLORS = {
  Approved: "#16a34a",
  Cancelled: "#6b7280",
  Pending: "#facc15",
  Rejected: "#ef4444",
};

const LeaveChart = ({ data = [] }) => {

  /* =====================================================
     1️⃣ PREPARE STATUS-WISE DATA
  ===================================================== */
  const chartData = useMemo(() => {
    const statusMap = {
      Approved: 0,
      Cancelled: 0,
      Pending: 0,
      Rejected: 0,
    };

    data.forEach((leave) => {
      const status = leave.status;
      if (statusMap[status] !== undefined) {
        statusMap[status] += 1;
      }
    });

    return Object.keys(statusMap)
      .filter((key) => statusMap[key] > 0)
      .map((key) => ({
        name: key,
        value: statusMap[key],
        color: COLORS[key],
      }));
  }, [data]);

  /* =====================================================
     2️⃣ TOTAL
  ===================================================== */
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <p className="text-center text-gray-500">
        No leave status data available
      </p>
    );
  }

  /* =====================================================
     3️⃣ UI
  ===================================================== */
  return (
    <div className="w-full flex flex-col items-center bg-white p-6 mb-4
     rounded-2xl shadow-md">

      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Leave Status Distribution
      </h3>

      <div className="w-full max-w-[550px] h-[250px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={window.innerWidth < 640 ? 80 : 120}
              label={(entry) =>
                `${entry.name}: ${entry.value} (${Math.round(
                  (entry.value / total) * 100
                )}%)`
              }
            >
              {chartData.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Pie>

            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
            />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeaveChart;
