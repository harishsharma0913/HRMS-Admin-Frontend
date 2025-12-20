import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, getTasks, resetTaskState } from "../ReduxToolkit/taskSlice";
import { useToast } from "../Toast/ToastProvider";

export default function UpdateTaskPage({ open, onClose, data }) {
  if (!open) return null;
  console.log(data);
  
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { updateLoading, updateSuccess, updateError } = useSelector((state) => state.tasks);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Employees
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);

  useEffect(() => {
  if (open) {
    dispatch(resetTaskState());
  }
  }, [open]);


  useEffect(() => {
  if (data) {
    setTitle(data.title || "");
    setDescription(data.description || "");
    setAssignTo(data?.assignTo?.employee_Id || "");
    setDueDate(data.dueDate?.slice(0, 10) || "");
    setPriority(data.priority || "Medium");
  }
}, [data]);

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
    if (updateLoading) return;

  if (!title || !description || !assignTo || !dueDate || !priority) {
    showToast("Please fill all required fields!", "error");
    return;
  }

  dispatch(
    updateTask({
      id: data._id,
      updatedData: {
        title,
        description,
        assignTo,
        dueDate,
        priority,
      },
    })
  );
};



  // Auto close after success
useEffect(() => {
  if (updateSuccess) {
    showToast("Task updated successfully!", "success");

    dispatch(resetTaskState());
    dispatch(getTasks());

    onClose();
  }
}, [updateSuccess]);


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
            <h2 className="text-2xl font-bold">Update Task</h2>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-600 hover:text-red-500"
            >
              <IoMdCloseCircle size={32} />
            </button>
          </div>

          {/* Error */}
          {updateError && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
              {updateError}
            </p>
          )}

          {/* Title & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={updateLoading}
              className={`px-4 py-2 bg-black text-white font-semibold rounded-md transition ${
                updateLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {updateLoading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

