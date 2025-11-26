import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

/* -----------------------------------------
   1) GET ALL DEPARTMENTS
----------------------------------------- */
export const getDepartments = createAsyncThunk(
  "org/getDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/department");
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   2) ADD DEPARTMENT
----------------------------------------- */
export const addDepartment = createAsyncThunk(
  "org/addDepartment",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/department", payload);
      return data.department;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   3) UPDATE DEPARTMENT
----------------------------------------- */
export const updateDepartment = createAsyncThunk(
  "org/updateDepartment",
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/department/${id}`, { name, description });
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   4) DELETE DEPARTMENT
----------------------------------------- */
export const deleteDepartment = createAsyncThunk(
  "org/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/department/${id}`);
      
      // backend se {status, message} aa raha hoga
      if (res.status === false) {
        return rejectWithValue(res.message);
      }

      return id; // <-- yahi best hai
    } catch (err) {
      return rejectWithValue("Something went wrong");
    }
  }
);


/* -----------------------------------------
   5) GET ALL DESIGNATIONS (or by department)
----------------------------------------- */
export const getDesignations = createAsyncThunk(
  "org/getDesignations",
  async (department_id = "", { rejectWithValue }) => {
    try {
      const params = department_id ? { department_id } : {};
      const data = await api.get("/designation", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   6) ADD DESIGNATION
----------------------------------------- */
export const addDesignation = createAsyncThunk(
  "org/addDesignation",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/designation", payload);
      return data.designation;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   7) UPDATE DESIGNATION
----------------------------------------- */
export const updateDesignation = createAsyncThunk(
  "org/updateDesignation",
  async ({ id, name, department_id }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/designation/${id}`, { name, department_id });
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
   8) DELETE DESIGNATION
----------------------------------------- */
export const deleteDesignation = createAsyncThunk(
  "org/deleteDesignation",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.delete(`/designation/${id}`);
      if (!data.status) {
        return rejectWithValue(data.message);
      }
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

/* -----------------------------------------
    SLICE
----------------------------------------- */
const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    departments: [],
    designations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* -----------------------------------
         FETCH DEPARTMENTS
      ----------------------------------- */
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -----------------------------------
         ADD DEPARTMENT
      ----------------------------------- */
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -----------------------------------
         UPDATE DEPARTMENT
      ----------------------------------- */
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
      })

      /* -----------------------------------
         DELETE DEPARTMENT
      ----------------------------------- */
.addCase(deleteDepartment.fulfilled, (state, action) => {
  state.departments = state.departments.filter(
    (d) => d._id !== action.payload
  );
})



      /* -----------------------------------
         GET DESIGNATIONS
      ----------------------------------- */
      .addCase(getDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
      })
      .addCase(getDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -----------------------------------
         ADD DESIGNATION
      ----------------------------------- */
      .addCase(addDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations.push(action.payload);
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -----------------------------------
         UPDATE DESIGNATION
      ----------------------------------- */
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.designations = state.designations.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
      })

      /* -----------------------------------
         DELETE DESIGNATION
      ----------------------------------- */
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.designations = state.designations.filter(
          (d) => d._id !== action.payload
        );
      });
  },
});

export default organizationSlice.reducer;
