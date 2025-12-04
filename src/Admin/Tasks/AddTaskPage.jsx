import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addTask, getTasks, resetTaskState } from "../ReduxToolkit/taskSlice";
import { useToast } from "../Toast/ToastProvider";

export default function AddTaskPage({ open, onClose }) {
  if (!open) return null;
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.tasks);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  // Employees
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);

  // Fetch Employees
  useEffect(() => {
    fetch("https://hrms-api.tipsg.in/employee")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data?.data || []);
        setEmpLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
        setEmpLoading(false);
      });
  }, []);

  // Handle Submit
  const handleSubmit = async () => {
    // Validation
    if (!title || !description || !assignTo || !dueDate) {
      showToast("Please fill all required fields!", "error");
      return;
    }

    const res = await dispatch(
      addTask({
        title,
        description,
        assignTo,
        dueDate,
        priority,
        status,
        createdBy: "69200b3e79c9ccf8b7d8fb53",
      })
    );
    console.log("Add Task Response:", res);
  };

  // Auto close after success
  useEffect(() => {
    if (success) {
      onClose();
      setTitle("");
      setDescription("");
      setAssignTo("");
      setDueDate("");
      setPriority("Medium");
      setStatus("Pending");
      dispatch(resetTaskState());
      dispatch(getTasks());
      showToast("Task added successfully!", "success");
    }
  }, [success]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-white w-[90%] md:w-[800px] rounded-xl p-6 shadow-xl space-y-5"
        >
          {/* Header */}
          <div className="relative">
            <h2 className="text-2xl font-bold">Create New Task</h2>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-600 hover:text-red-500"
            >
              <IoMdCloseCircle size={32} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Assign + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assign To */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Select Employee</option>

                {empLoading ? (
                  <option>Loading...</option>
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName}
                    </option>
                  ))
                ) : (
                  <option>No employees found</option>
                )}
              </select>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 bg-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold bg-gray-700 rounded-md hover:bg-red-500 text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 bg-black text-white font-semibold rounded-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
