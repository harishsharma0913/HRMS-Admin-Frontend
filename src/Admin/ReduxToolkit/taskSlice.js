import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

// ==================== ADD TASK ====================
export const addTask = createAsyncThunk(
  "task/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/tasks", taskData);

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to add task");
      }
      console.log(response);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==================== GET TASKS ====================
export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/tasks", { params: filters });

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to fetch tasks");
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// ==================== GetAll TASKS ====================
export const getAllTasks = createAsyncThunk(
  "task/getAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/tasks");

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to fetch all tasks");
      }
      console.log(response);
      
      return response.tasks;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// ==================== UPDATE TASK ====================
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/tasks/${id}`, updatedData);

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to update task");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==================== DELETE TASK ====================
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/tasks/${id}`);

      if (!response.status) {
        return rejectWithValue(response.message || "Failed to delete task");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    loading: false,
    success: false,
    error: null,
    tasks: [],
    allTasks: [],
    totalTasks: 0,
    totalPages: 1,
    page: 1,
  },

  reducers: {
    resetTaskState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ADD TASK
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tasks.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET TASKS
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.totalTasks = action.payload.total || 0;   // FIX ✔
        state.totalPages = action.payload.totalPages || 1;
        state.page = action.payload.page || 1;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL TASKS
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload || [];
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE TASK
      .addCase(updateTask.fulfilled, (state, action) => {
        state.success = true;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })

      // DELETE TASK
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.success = true;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
