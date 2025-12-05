import { useEffect, useState } from "react";
import AddTaskPage from "./AddTaskPage";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, deleteTask, getAllTasks } from "../ReduxToolkit/taskSlice";

export default function TaskHomePage() {
    const[open, setOpen]=useState(false);
  
  const dispatch = useDispatch();
  const { tasks, allTasks, loading, totalPages } = useSelector((state) => state.tasks);  
  
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const onClose = () => setOpen(false);

  useEffect(() => {
    dispatch(
      getTasks({
        search,
        status,
        startDate,
        endDate,
        page,
        limit,
      })
    );
    dispatch(getAllTasks());
  }, [search, status, startDate, endDate, page]);
  // Counts
  const totalTasks = allTasks.length;
  const pendingCount = allTasks.filter(t => t.status === "Pending").length;
  const inProgressCount = allTasks.filter(t => t.status === "In Progress" || t.status === "InProgress").length;
  const completedCount = allTasks.filter(t => t.status === "Completed").length;


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id))
        .then(() => {
           dispatch(getTasks({ page, limit: 5 }));
           dispatch(getAllTasks());
    }); 
    }
  };

  const getProgress = (status) => {
  if (status === "Pending") return 0;
  if (status === "In Progress" || status === "InProgress") return 50;
  if (status === "Completed") return 100;
  return 0;
};

const getPriorityClasses = (priority) => {
  if (priority === "High") {
    return "bg-red-100 text-red-600"; 
  }
  if (priority === "Medium") {
    return "bg-yellow-100 text-yellow-600";
  }
  if (priority === "Low") {
    return "bg-green-100 text-green-600";
  }
  return "bg-gray-100 text-gray-600"; 
};

const getStatusClasses = (status) => {
  if (status === "Pending") {
    return "text-yellow-600";
  }
  if (status === "In Progress" || status === "InProgress") {
    return "text-blue-600";
  }
  if (status === "Completed") {
    return "text-green-600";
  }
  return "text-gray-600";
};


  return (
    <div>
      <div className="hidden md:flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl text-purple-600">Tasks Management</h1>
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

    <div className="w-full bg-pink-50 h-full p-6 space-y-6">
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Tasks", value: totalTasks },
          { title: "Pending", value: pendingCount },
          { title: "In Progress", value: inProgressCount },
          { title: "Completed", value: completedCount },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-300 bg-white p-4 flex flex-col items-center justify-center shadow-sm"
          >
            <p className="text-gray-500 text-sm md:text-base">{item.title}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Create Task Button */}
      <div className="flex justify-center md:justify-start">
        <button
         onClick={() => setOpen(true)}
         className="bg-black text-white px-4 py-2 rounded-md shadow hover:scale-105 transition">
          + Create New Task
        </button>
      </div>

      {/* Filters */}
      <div className="w-full flex flex-col gap-2">

        {/* 🔎 Search + Tabs */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search tasks by employee, title, priority..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-full border border-gray-300 bg-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Status Tabs */}
          <div className="flex gap-2 w-full md:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
           className="w-full md:w-auto border border-gray-300 bg-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

        </div>

        {/* 📅 Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

        </div>
      </div>

      {/* Loading */}
        {loading && (
          <div className="w-full text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 font-semibold text-blue-700">Loading tasks...</p>
          </div>
        )}

      {/* No Tasks */}
      {!loading && tasks.length === 0 && (
        <p className="w-full mt-3 py-10 text-center font-semibold text-xl">No tasks found.</p>
      )}

      {/* Task Card */}
      {tasks.map((task) => (
      <div 
      key={task._id}
      className="w-full border border-gray-300 bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex justify-between items-start md:items-center">
          <div className="flex gap-3">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <span
              className={`text-xs px-2 py-1 mr-2 rounded-full h-8 md:h-7 font-semibold ${getPriorityClasses(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>

          <button
           onClick={() => handleDelete(task._id)}
           className="bg-red-600 text-white px-3 py-1 rounded-md hover:scale-105 transition">
            Delete
          </button>
        </div>

        <p className="text-gray-500 mt-2 text-sm md:text-base">
          {task.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
          <p className="flex items-center gap-1">👤 {task.assignTo?.fullName}</p>
          <p className="flex items-center gap-1">
            📅{new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p className={`font-semibold ${getStatusClasses(task.status)}`}>
              {task.status}
            </p>
        </div>

        <div className="mt-4 w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgress(task.status)}%` }}
          ></div>
        </div>

        <p className="text-gray-500 text-xs mt-1">
          {getProgress(task.status)}% complete
        </p>

      </div>
      ))}
      {/* Pagination */}
      {!loading && tasks.length > 0 && (
        <div className="flex justify-center items-center gap-3 py-6">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-md border border-gray-300 ${
              page === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-md border border-gray-300 ${
              page === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>

        </div>
      )}
    </div>
    {open && <AddTaskPage open={open} onClose={onClose} />}
    </div>
  );
}
