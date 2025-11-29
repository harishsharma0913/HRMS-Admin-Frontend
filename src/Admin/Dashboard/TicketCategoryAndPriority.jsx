import { AlertTriangle } from "lucide-react";

export default function TicketCategoryAndPriority() {
  return (
    <div className="bg-[#FFFBEB] p-4 mt-1 rounded-2xl border border-yellow-300 shadow-sm">

      {/* TITLE */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-400 text-white p-3 rounded-xl shadow">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Priority Alerts</h3>
      </div>

      {/* INTERNAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Critical Priority */}
        <div className="flex items-center bg-white rounded-2xl shadow-sm p-5 border-l-8 border-red-400">
          {/* Dot */}
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>

          {/* Text */}
          <div className="ml-4">
            <h4 className="font-semibold text-red-700">Critical Priority Tickets</h4>
            <p className="text-sm text-red-500">Immediate attention required</p>
          </div>

          {/* Count */}
          <span className="ml-auto text-red-600 font-bold text-2xl">3</span>
        </div>

        {/* High Priority */}
        <div className="flex items-center bg-white rounded-2xl shadow-sm p-5 border-l-8 border-orange-400">
          {/* Dot */}
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>

          {/* Text */}
          <div className="ml-4">
            <h4 className="font-semibold text-orange-700">High Priority Tickets</h4>
            <p className="text-sm text-orange-500">Priority handling needed</p>
          </div>

          {/* Count */}
          <span className="ml-auto text-orange-600 font-bold text-2xl">12</span>
        </div>

      </div>
    </div>
  );
}
