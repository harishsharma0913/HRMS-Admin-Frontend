import { MapPin, IndianRupee, Users, Calendar, Hourglass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobPostPopup from "./PostNewJob";
import { useState, useEffect } from "react";
import { fetchJobs } from "../ReduxToolkit/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import EditJobDetails from "./EditJobDetails";
import { getDepartments } from "../ReduxToolkit/department";

export default function VacancyHomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { jobs, loading, error, totalPages } = useSelector(
    (state) => state.jobs
  );
  console.log(jobs);
  const { departments } = useSelector((state) => state.organization);


  // Filters + Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch jobs on filter change
  useEffect(() => {
    dispatch(
      fetchJobs({
        page,
        limit: 5,
        search,
        status: statusFilter,
        department,
        startDate,
        endDate,
      })
    )
    dispatch(getDepartments());
  }, [dispatch, page, search, statusFilter, department, startDate, endDate]);

  return (
    <div >
      {/* Header */}
      <div className="hidden md:flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl text-purple-600">Jobs Management</h1>
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

      <div className="p-6 bg-pink-50 h-screen">
        {/* Add New Job */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold">Posted Jobs</h1>
          <div className="flex flex-row gap-1 md:gap-3">
            <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-3 font-semibold rounded-xl mb-2 hover:bg-blue-800 flex items-center gap-2"
          >
            <span className="text-3xl mb-1">+</span> New Job
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white px-3 font-semibold rounded-xl mb-2 hover:bg-blue-800 flex items-center gap-2"
          >
            {showFilters ? "Filters ▲" : "Filters ▼"}
          </button>
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        {showFilters && (
        <div className="gap-3 mb-4">
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-3 flex-1">
          <input
            type="text"
            placeholder="Search title / location / department / status..."
            className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-white focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* Status */}
          <select
            className=" mt-1 p-2 border border-gray-400 rounded-xl bg-white focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          
          {/* Department */}
          <select
  className="mt-1 p-2 border border-gray-400 rounded-xl bg-white focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
  value={department}
  onChange={(e) => {
    setDepartment(e.target.value);
    setPage(1);
  }}
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

         <div className="flex flex-col md:flex-row gap-3 mt-2">
          {/* Start Date */}
          <div className="w-full">
          <label className="font-semibold self-start">Start Date *</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-white focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
          />
          </div>
          {/* End Date */}
          <div className="w-full">
          <label className="font-semibold self-start">End Date *</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border border-gray-400 rounded-xl bg-white focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
          />
          </div>
         </div>

        </div>
        )}
        {/* LOADING */}
        {loading && (
          <div className="w-full text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 font-semibold text-blue-700">Loading jobs...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-xl mb-4 font-semibold">
            ❌ Failed to load jobs: {error}
          </div>
        )}

        {/* NO JOBS */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 font-semibold">No jobs posted yet.</p>
          </div>
        )}

        {/* JOB LIST */}
        {!loading &&
          !error &&
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm p-6 mt-4 border border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    {job.description}
                  </p>
                </div>

                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {job.department?.name}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center lg:gap-[100px] gap-3 text-gray-600 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee size={16} /> {job.salary}
                </div>
                <div className="flex items-center gap-1">
                  <Hourglass size={16} /> {job.experience}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} /> {job.applications} applications
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />{" "}
                  {new Date(job.createdAt).toLocaleDateString("en-US")}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/vacancy/response")}
                    className="px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-red-500 hover:text-white"
                  >
                    View Applications
                  </button>

                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setOpenEditForm(true);
                    }}
                    className="px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-red-500 hover:text-white"
                  >
                    Edit
                  </button>
                </div>

                <span className="px-4 py-2 rounded-3xl font-bold bg-green-400 text-white shadow">
                  {job.status}
                </span>
              </div>
            </div>
          ))}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <JobPostPopup open={open} setOpen={setOpen} />
      <EditJobDetails
        openEditForm={openEditForm}
        setOpenEditForm={setOpenEditForm}
        selectedJob={selectedJob}
      />
    </div>
  );
}
