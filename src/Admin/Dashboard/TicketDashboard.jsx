import { Ticket, AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function TicketDashboard() {
    
  const navigate = useNavigate();
    const openTicketPage = () => {
      navigate('/ticket');      
    }
    
      const data = [
    { name: "Approved", value: 45, color: "#16a34a" },
    { name: "Cancelled", value: 15, color: "#6b7280" },
    { name: "Pending", value: 12, color: "#facc15" },
    { name: "Rejected", value: 8, color: "#ef4444" },
  ];

  // 🔥 Now total will work
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="px-6 bg-pink-50 text-gray-800">
      {/* ================= Ticket Management Summary ================= */}
      <h2 className="text-lg font-semibold mb-3">Ticket Management Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {/* Total Tickets */}
        <div onClick={openTicketPage} className="bg-gray-400 p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Total Tickets</h4>
            <Ticket className="w-5 h-5 text-gray-800" />
          </div>
          <p className=" text-gray-800 text-2xl font-semibold mb-1">156</p>
          <p className="text-sm text-gray-800">+8% from last month</p>
        </div>

        {/* Open Tickets */}
        <div onClick={openTicketPage} className="bg-yellow-400 p-5 rounded-2xl  shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-yellow-800">Open Tickets</h4>
            <AlertTriangle className="w-5 h-5 text-yellow-800" />
          </div>
          <p className="text-2xl font-semibold text-yellow-800 mb-1">23</p>
          <p className="text-sm text-yellow-800">Needs attention</p>
        </div>

        {/* Resolution Rate */}
        <div onClick={openTicketPage} className="bg-green-400 p-5 rounded-2xl  shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-green-800">Resolution Rate</h4>
            <RefreshCw className="w-5 h-5 text-green-800" />
          </div>
          <p className="text-2xl font-semibold text-green-800 mb-1">56%</p>
          <p className="text-sm text-green-800">+12% from last month</p>
        </div>

        {/* Avg Resolution */}
        <div onClick={openTicketPage} className="bg-purple-400 p-5 rounded-2xl  shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-purple-800">Avg Resolution</h4>
            <Clock className="w-5 h-5 text-purple-800" />
          </div>
          <p className="text-2xl font-semibold text-purple-800 mb-1">1.8 days</p>
          <p className="text-sm text-purple-800">-0.3 days from last month</p>
        </div>
      </div>

      {/* ================= Ticket Status Distribution ================= */}
      <div className="w-full flex flex-col items-center ">
      <h3 className="text-lg font-semibold mb-4">Leave Status Distribution</h3>
      <PieChart width={550} height={350} className="outline-none focus:outline-none" tabIndex={-1}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={(entry) =>
            `${entry.name}: ${entry.value} (${Math.round(
              (entry.value / total) * 100
            )}%)`
          }
        >
          {data.map((item, index) => (
            <Cell key={index} fill={item.color} className="outline-none focus:outline-none" tabIndex={-1} />
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
      </div>
    </div>
  );
}
