import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../ReduxToolkit/ticketSlice";

export default function TicketStats() {
  const dispatch = useDispatch();
  const { tickets, getAllTicketLoading, getAllTicketError } = useSelector(
    (state) => state.tickets
  );

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => ticket.status === "Open").length;
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;
  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "High"
  ).length;

  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  if (getAllTicketLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">Loading tickets...</span>
      </div>
    );
  }

  if (getAllTicketError) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-md text-center font-medium">
        ❌ Failed to load ticket stats: {getAllTicketError}
      </div>
    );
  }

  return (
    <div
      className="
        grid 
        grid-cols-1       /* 📱 Mobile: single column */
        sm:grid-cols-2    /* 📱 Small screens: 2 columns */
        lg:grid-cols-4    /* 💻 Large screens: 4 columns */
        gap-4 mb-4
      "
    >
      {/* Total Tickets */}
      <div className="p-4 rounded-lg bg-purple-500 shadow-md hover:shadow-lg ">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">Total Tickets</p>
            <h2 className="text-2xl text-white font-bold">{totalTickets}</h2>
          </div>
          <Ticket className="text-white h-8 w-8" />
        </div>
      </div>

      {/* Open Tickets */}
      <div className="p-4 rounded-lg bg-yellow-500 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">Open</p>
            <h2 className="text-2xl font-bold text-white">{openTickets}</h2>
          </div>
          <Clock className="text-white h-8 w-8" />
        </div>
      </div>

      {/* In Progress Tickets */}
      <div className="p-4 rounded-lg bg-blue-500 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">In Progress</p>
            <h2 className="text-2xl font-bold text-white">{inProgressTickets}</h2>
          </div>
          <CheckCircle className="text-white h-8 w-8" />
        </div>
      </div>

      {/* Critical Tickets */}
      <div className="p-4 rounded-lg bg-red-500 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">Critical</p>
            <h2 className="text-2xl font-bold text-white">{criticalTickets}</h2>
          </div>
          <AlertTriangle className="text-white h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
