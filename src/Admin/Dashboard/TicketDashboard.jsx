import { Ticket, AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../ReduxToolkit/ticketSlice";
import TicketCategoryAndPriority from "./TicketCategoryAndPriority";

export default function TicketDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tickets = [], getAllTicketLoading } = useSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  const openTicketPage = () => {
    navigate("/ticket");
  };

  /* ================== 📊 Calculations ================== */
  const {
    totalTickets,
    openTickets,
    resolutionRate,
    avgResolutionDays,
  } = useMemo(() => {
    const total = tickets.length;

    const resolved = tickets.filter(
      (t) => t.status === "Resolved"
    );

    const open = tickets.filter(
      (t) => t.status !== "Resolved"
    );

    // Avg resolution time
    let totalDays = 0;
    resolved.forEach((t) => {
      const created = new Date(t.createdAt);
      const updated = new Date(t.updatedAt);
      const diffDays =
        (updated - created) / (1000 * 60 * 60 * 24);
      totalDays += diffDays;
    });

    return {
      totalTickets: total,
      openTickets: open.length,
      resolutionRate: total
        ? Math.round((resolved.length / total) * 100)
        : 0,
      avgResolutionDays: resolved.length
        ? (totalDays / resolved.length).toFixed(1)
        : "0.0",
    };
  }, [tickets]);

  /* ================== UI ================== */
  return (
    <div className="mt-2 bg-pink-50 text-gray-800">
      <h2 className="text-lg font-semibold mb-3">
        Ticket Management Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {/* Total Tickets */}
        <div onClick={openTicketPage} className="bg-gray-200 p-5 rounded-2xl shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Total Tickets</h4>
            <Ticket className="w-5 h-5 text-gray-800" />
          </div>
          <p className="text-2xl font-semibold mb-1">
            {getAllTicketLoading ? "—" : totalTickets}
          </p>
          <p className="text-sm text-gray-800">All created tickets</p>
        </div>

        {/* Open Tickets */}
        <div onClick={openTicketPage} className="bg-yellow-300 p-5 rounded-2xl shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-yellow-800">Open Tickets</h4>
            <AlertTriangle className="w-5 h-5 text-yellow-800" />
          </div>
          <p className="text-2xl font-semibold text-yellow-800 mb-1">
            {getAllTicketLoading ? "—" : openTickets}
          </p>
          <p className="text-sm text-yellow-800">Needs attention</p>
        </div>

        {/* Resolution Rate */}
        <div onClick={openTicketPage} className="bg-green-200 p-5 rounded-2xl shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-green-800">Resolution Rate</h4>
            <RefreshCw className="w-5 h-5 text-green-800" />
          </div>
          <p className="text-2xl font-semibold text-green-800 mb-1">
            {resolutionRate}%
          </p>
          <p className="text-sm text-green-800">Resolved tickets</p>
        </div>

        {/* Avg Resolution */}
        <div onClick={openTicketPage} className="bg-purple-300 p-5 rounded-2xl shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-purple-800">Avg Resolution</h4>
            <Clock className="w-5 h-5 text-purple-800" />
          </div>
          <p className="text-2xl font-semibold text-purple-800 mb-1">
            {avgResolutionDays} days
          </p>
          <p className="text-sm text-purple-800">Average resolve time</p>
        </div>
      </div>
      <TicketCategoryAndPriority data={tickets} />
    </div>
  );
}
