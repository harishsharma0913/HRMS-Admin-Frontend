import { AlertTriangle } from "lucide-react";

export default function TicketCategoryAndPriority() {
  return (
    <div className="pt-6 bg-pink-50 text-gray-800">
      <div className="bg-white p-5 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-base font-semibold">Priority Alerts</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Critical Priority */}
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="w-3 h-3 rounded-full bg-red-600 mt-1"></div>
            <div>
              <h4 className="font-semibold text-red-700">
                Critical Priority Tickets
              </h4>
              <p className="text-sm text-gray-600">
                Immediate attention required
              </p>
            </div>
            <span className="ml-auto bg-white text-red-700 font-semibold px-3 py-1 rounded-lg border border-red-200">
              3
            </span>
          </div>

          {/* High Priority */}
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="w-3 h-3 rounded-full bg-orange-500 mt-1"></div>
            <div>
              <h4 className="font-semibold text-orange-700">
                High Priority Tickets
              </h4>
              <p className="text-sm text-gray-600">
                Priority handling needed
              </p>
            </div>
            <span className="ml-auto bg-white text-orange-700 font-semibold px-3 py-1 rounded-lg border border-orange-200">
              12
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
