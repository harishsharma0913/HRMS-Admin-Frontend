import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (
    { page = 1, limit = 5, search = "", status = "", department = "", startDate = "", endDate = "" },
    thunkAPI
  ) => {
    try {
      const query = `?page=${page}&limit=${limit}&search=${search}&status=${status}&department=${department}&startDate=${startDate}&endDate=${endDate}`;
      const data = await api.get(`/admin/jobs${query}`);

      if (!data.status) throw new Error(data.message || "Failed to fetch jobs");

      return data; // pagination + jobs
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addJob = createAsyncThunk("jobs/addJob", async (jobData, thunkAPI) => {
  try {
    const data = await api.post("/admin/create-job", jobData);
    if (!data.status) throw new Error(data.message || "Failed to add job");
    return data.job;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, updates }, thunkAPI) => {
    try {
      const data = await api.patch(`/admin/job/${id}`, updates);
      if (!data.status) throw new Error(data.message || "Failed to update job");
      return data.job;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,

    addJobLoading: false,
    addJobError: null,

    updateJobLoding: false,
    updateJobError: null,

    // Pagination state
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,

    // Filters
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    // 🔍 SET FILTERS
    setFilters: (state, action) => {
      const { search, status, startDate, endDate } = action.payload;
      if (search !== undefined) state.search = search;
      if (status !== undefined) state.status = status;
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
    },

    // 🔄 Change Page
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;

        state.jobs = action.payload.jobs;

        // Pagination
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.total = action.payload.pagination.total;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addJob.pending, (state) => {
        state.addJobLoading = true;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.addJobLoading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.addJobLoading = false;
        state.addJobError = action.payload;
      });

    builder
      .addCase(updateJob.pending, (state) => {
        state.updateJobLoding = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateJobLoding = false;

        const index = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateJobLoding = false;
        state.updateJobError = action.payload;
      });
  },
});

export const { clearError, setFilters, setPage } = jobsSlice.actions;
export default jobsSlice.reducer;
