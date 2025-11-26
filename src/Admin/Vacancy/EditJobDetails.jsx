import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { updateJob } from "../ReduxToolkit/jobSlice";
import { useToast } from "../Toast/ToastProvider";
import { getDepartments } from "../ReduxToolkit/department";

export default function EditJobDetails({ openEditForm, setOpenEditForm, selectedJob }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.jobs);
  const { departments } = useSelector((state) => state.organization);
  const { showToast } = useToast();
    
  // ✔ Form State
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    status: "",
    experience: "Fresher",
    minSalary: "",
    maxSalary: "",
    description: "",
  });

  // ✔ Edit ke time data load karo
useEffect(() => {
  if (selectedJob) {
    const [minS, maxS] = selectedJob.salary?.split("-") || ["", ""];

    setFormData({
      title: selectedJob.title || "",
      department: selectedJob.department?._id || "", // <-- FIX
      status: selectedJob.status || "",
      experience: selectedJob.experience || "Fresher",
      minSalary: minS.trim(),
      maxSalary: maxS.trim(),
      description: selectedJob.description || "",
    });
  }

  dispatch(getDepartments());
}, [selectedJob, dispatch]);

  // ✔ Input Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    // ✔ Submit Handler
const handleSubmit = (e) => {
  e.preventDefault();

  const finalData = {
    ...formData,
    salary: `${formData.minSalary} - ${formData.maxSalary}`
  };

  dispatch(updateJob({ 
      id: selectedJob._id,   // <-- IMPORTANT FIX
      updates: finalData
  }))
    .unwrap()
    .then(() => {
      showToast("Job updated!", "success");
      setOpenEditForm(false);
    })
    .catch((err) => {
      showToast(err, "error");
    });
};


  if (!openEditForm) return null;

  return (
    <AnimatePresence>
      {openEditForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[90%] max-w-5xl"
          >
            <div className="rounded-2xl shadow-xl p-6 bg-white">
              <h2 className="text-xl font-bold mb-3">Update Job Details</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="text-sm font-medium">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
  <label className="text-sm font-medium">Department *</label>
  <select
    name="department"
    value={formData.department}   // <-- Selected job ka department set rahega
    onChange={handleChange}
    className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">Select Department</option>

    {departments && departments.length > 0 &&
      departments.map((dept) => (
        <option key={dept._id} value={dept._id}>
          {dept.name}
        </option>
      ))}
  </select>
                  </div>


                    <div>
                    <label className="text-sm font-medium">Status *</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    >   
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                    </select>
                    </div>

                    <div>
                    <label className="text-sm font-medium">Experience *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>

                    </div>

                    <div>
                      <label className="text-sm font-medium">Min Salary *</label>
                      <input
                        type="number"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Max Salary *</label>
                      <input
                        type="number"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Job Description *</label>
                  <textarea
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2 bg-blue-700 hover:bg-blue-900 text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Job"}
                  </button>

                  <button
                    type="button"
                    className="rounded-xl px-5 py-2 bg-gray-300 border font-semibold hover:bg-red-500 hover:text-white"
                    onClick={() => setOpenEditForm(false)}
                  >
                    Close
                  </button>
                </div>
              </form>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
