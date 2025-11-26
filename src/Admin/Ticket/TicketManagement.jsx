import TicketStats from "./TicketStats";
import TicketTable from "./TicketTable";

export default function TicketManagement() {
  return (
    <div>
       <div className=" hidden md:flex items-center justify-between border-b p-4">
            <div>
              <h1 className="text-2xl text-purple-600">Ticket Management</h1>
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
    <div className="p-4 h-screen bg-pink-50"> 
          <TicketStats />
          <TicketTable />
    </div>
    </div>
  );
}
