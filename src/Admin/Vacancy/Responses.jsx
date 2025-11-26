import { Mail, Calendar } from "lucide-react";

export default function Responses() {
  const applicants = [
    {
      id: 1,
      name: "John Doe",
      stars: 4,
      appliedFor: "Senior React Developer",
      email: "john@example.com",
      date: "1/14/2024",
      status: "Interview",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      id: 2,
      name: "Jane Smith",
      stars: 3,
      appliedFor: "Senior React Developer",
      email: "jane@example.com",
      date: "1/13/2024",
      status: "Reviewed",
      statusColor: "bg-blue-100 text-blue-700",
    },
        {
      id: 2,
      name: "Jane Smith",
      stars: 4,
      appliedFor: "Senior React Developer",
      email: "jane@example.com",
      date: "1/13/2024",
      status: "Reviewed",
      statusColor: "bg-blue-100 text-blue-700",
    },
        {
      id: 2,
      name: "Jane Smith",
      stars: 5,
      appliedFor: "Senior React Developer",
      email: "jane@example.com",
      date: "1/13/2024",
      status: "Reviewed",
      statusColor: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div>
     <div className="hidden md:flex items-center justify-between border-b p-4">
            <div>
              <h1 className="text-2xl text-purple-600">Responses Management</h1>
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

    <div className="px-6 pt-4 bg-pink-50 min-h-screen">
      {/* Page Header */}
      <h1 className="text-2xl font-bold">Applicant Responses</h1>
      <p className="text-gray-500 font-semibold mb-4">
        Review and manage candidate applications
      </p>

      {/* Applicant Cards */}
      {applicants.map((app) => (
        <div
          key={app.id}
          className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-300"
        >
          {/* Top Row */}
         <div className="flex flex-col">

  {/* TOP ROW  (Name + Stars left, Status right) */}
  <div className="flex items-center justify-between w-full">
    
    {/* Left side: Name + Stars */}
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold">{app.name}</h2>
      <div className="flex items-center font-extrabold text-red-500">
        {"★".repeat(app.stars)}
        {"☆".repeat(5 - app.stars)}
      </div>
    </div>

    {/* Right side: Status Badge */}
    <span
      className={`${app.statusColor} px-4 py-1 rounded-full text-sm`}
    >
      {app.status}
    </span>
  </div>

  {/* Applied for — Next line */}
  <p className="text-gray-500 mt-1 text-sm">
    Applied for:{" "}
    <span className="font-semibold">{app.appliedFor}</span>
  </p>

         </div>


          {/* Contact + Date (Responsive Grid) */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center md:justify-between text-gray-600 text-sm gap-3">

            <div className="flex items-center gap-2">
              <Mail size={16} />
              {app.email}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {app.date}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-2 md:mt-0">
  <button
    className={`px-4 py-2 rounded-md font-semibold
      ${
        app.status === "Reviewed"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }
    `}
  >
    Review
  </button>

  <button
    className={`px-4 py-2 rounded-md font-semibold
      ${
        app.status === "Interview"
          ? "bg-red-600 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }
    `}
  >
    Interview
  </button>
            </div>

          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
