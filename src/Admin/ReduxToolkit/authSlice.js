import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

// ✅ Get All Leaves (Admin)
export const getAllLeaves = createAsyncThunk(
  "admin/getAllLeaves",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/leaves");
      if (!response.status) {
        throw new Error(response.message || "Failed to fetch leaves");
      }
      return response.leave;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching leaves");
    }
  }
);

// ✅ Get Filtered Leaves (Admin)
export const getFilteredLeaves = createAsyncThunk(
  "admin/getFilteredLeaves",
  async ({ status, type, page, limit, search }, thunkAPI) => {
    try {
      const response = await api.get("/admin/filteredleaves", {
        params: { status, type, page, limit, search },
      });
      console.log(response);
      if (!response.status) {
        throw new Error(response.message || "Failed to fetch filtered leaves");
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching filtered leaves");
    }
  }
);

export const updateLeave = createAsyncThunk(
  "admin/updateLeave",
  async ({ leaveId, status }, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/leave/${leaveId}`, { status });

      if (!response.status) {
        throw new Error(response.message || "Failed to update leave");
      }
      return response.leave; // ✅ updated leave object return karo
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error updating leave");
    }
  }
);

// ✅ Get Employee by ID
export const getEmployeeById = createAsyncThunk(
  "admin/getEmployeeById",
  async (employeeId, thunkAPI) => {
    try {
      const response = await api.get(`/employee/${employeeId}`);
      console.log("Employee response:", response);

      if (!response.status) {
        throw new Error(response.message || "Failed to fetch employee");
      }
      return response.data; // ✅ employee object return karega
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching employee");
    }
  }
);

export const addComment = createAsyncThunk(
  "leave/addComment",
  async ({ leaveId, text, userId }, thunkAPI) => {
    try {
      const response = await api.post(`/admin/${leaveId}/comment`, {
        text,
        userId,   // 👈 abhi ke liye body se bhejna hoga kyunki authMiddleware nahi hai
      });

      if (!response.status) {
        throw new Error(response.message || "Failed to add comment");
      }

      return response.leave; // controller se jo updated leave return ho raha hai
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔰 INITIAL STATE
const initialState = {
  token: localStorage.getItem('adminToken') || null,

  getLeavesLoading: false,
  getFilteredLeavesLoading: false,
  getEmployeeLoading: false,
  updateLeaveLoading: false,
  addCommentLoading: false,

  getLeavesError: null,
  getFilteredLeavesError: null,
  getEmployeeError: null,
  updateLeaveError: null,
  addCommentError: null,

  leaves: [],
  leavesFiltered: [],
  employeeData: null,
};

// 🔧 SLICE    
const adminLeavesSlice = createSlice({
  name: "admin",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllLeaves.pending, (state) => {
        state.getLeavesLoading = true;
        state.getLeavesError = null;
      })
      .addCase(getAllLeaves.fulfilled, (state, action) => {
        state.getLeavesLoading = false;
        state.leaves = action.payload;
      })
      .addCase(getAllLeaves.rejected, (state, action) => {
        state.getLeavesLoading = false;
        state.getLeavesError = action.payload;
      })


      .addCase(getFilteredLeaves.pending, (state) => {
        state.getFilteredLeavesLoading = true;
        state.getFilteredLeavesError = null;
      })
      .addCase(getFilteredLeaves.fulfilled, (state, action) => {
        state.getFilteredLeavesLoading = false;
        state.leavesFiltered = action.payload;
      })
      .addCase(getFilteredLeaves.rejected, (state, action) => {
        state.getFilteredLeavesLoading = false;
        state.getFilteredLeavesError = action.payload;
      })


      .addCase(updateLeave.pending, (state) => {
        state.updateLeaveLoading = true;
        state.updateLeaveError = null;
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.updateLeaveLoading = false;
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.updateLeaveLoading = false;
        state.updateLeaveError = action.payload;
      })


      .addCase(getEmployeeById.pending, (state) => {
        state.getEmployeeLoading = true;
        state.getEmployeeError = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.getEmployeeLoading = false;
        state.employeeData = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.getEmployeeLoading = false;
        state.getEmployeeError = action.payload;
      })


       .addCase(addComment.pending, (state) => {
        state.addCommentLoading = true;
        state.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addCommentLoading = false;
        // updated leave replace kar do list me
        const updated = action.payload;
        state.leaves = state.leaves.map((l) => l._id === updated._id ? updated : l);
        state.selectedLeave = updated;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentLoading = false;
        state.addCommentError = action.payload;
      });
  },
});

export default adminLeavesSlice.reducer;
