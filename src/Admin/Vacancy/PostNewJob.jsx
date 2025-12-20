import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addJob, fetchJobs } from "../ReduxToolkit/jobSlice";
import { useToast } from "../Toast/ToastProvider";
import { getDepartments } from "../ReduxToolkit/department";

export default function JobPostPopup({ open, setOpen }) {
  const dispatch = useDispatch();
  const { addJobLoading } = useSelector((state) => state.jobs);
  const { showToast } = useToast();
  const { departments } = useSelector((state) => state.organization);
  console.log(departments);
  
  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);
  // FORM STATES
const [formData, setFormData] = useState({
  title: "",
  department: "",
  location: "",
  experience: "Fresher",
  minSalary: "",
  maxSalary: "",
  description: "",
});

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT HANDLER
  const handleSubmit = (e) => {
  e.preventDefault();

  const finalData = {
    ...formData,
    salary: `${formData.minSalary} - ${formData.maxSalary}`,
  };

  dispatch(addJob(finalData))
    .unwrap()
    .then(() => {
      dispatch(fetchJobs({page: 1, limit: 5}));
      showToast("Job posted successfully!", "success");
      setOpen(false);
      setFormData({
        title: "",
        department: "",
        location: "",
        experience: "Fresher",
        minSalary: "",
        maxSalary: "",
        description: "",
      });
    })
    .catch((err) => {
      showToast(err || "Failed to post job.", "error");
    });
};

  return (
    <AnimatePresence>
      {open && (
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
            <div className="rounded-2xl shadow-xl p-4 bg-white">

              <h2 className="text-xl font-bold mb-4">Create New Job Posting</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="text-sm font-medium">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Senior Developer"
                      className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
  <label className="text-sm font-medium">Department *</label>
  <select
    name="department"
    value={formData.department}
    onChange={handleChange}
    className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">Select Department</option>

    {departments && departments.length > 0 ? (
      departments.map((dept) => (
        <option key={dept._id} value={dept._id}>
          {dept.name}
        </option>
      ))
    ) : (
      <option disabled>Loading...</option>
    )}
  </select>
                  </div>


                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Remote, New York"
                      className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Experience Level</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
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
                    placeholder="e.g., 40000"
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
                      placeholder="e.g., 70000"
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
                    placeholder="Describe the role, responsibilities..."
                    className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2 bg-blue-700 hover:bg-blue-900 text-white font-semibold"
                    disabled={addJobLoading}
                  >
                    {addJobLoading ? "Posting..." : "Post Job"}
                  </button>

                  <button
                    type="button"
                    className="rounded-xl px-5 py-2 bg-gray-300 border border-gray-400 font-semibold hover:bg-red-500 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    Clear
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
