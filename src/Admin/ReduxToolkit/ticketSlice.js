import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api"; 

// 1️⃣ Get All Tickets
export const getAllTickets = createAsyncThunk(
  "tickets/getAllTicket",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/admin/ticket");
      console.log(res);
      
      if (!res.status) {
        throw new Error(res.message || "Failed to fetch tickets");
      }
      return res.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching tickets");
    }
  }
);

// 2️⃣ Get Filtered Tickets (search, filter, pagination)
export const getFilteredTickets = createAsyncThunk(
  "tickets/getFilteredTicket",
  async (params, thunkAPI) => {
    try {
      // params = { search, category, priority, status, page, limit }
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/admin/filtered-ticket?${query}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to fetch filtered tickets");
      }
      console.log(res);
      
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error fetching filtered tickets");
    }
  }
);

// 3️⃣ Update Ticket Status
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await api.patch(`/admin/ticket/${id}/status`, { status });
      if (!res.status) {
        throw new Error(res.message || "Failed to update ticket status");
      }
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || "Error updating ticket status");
    }
  }
);



const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    filteredTickets: [],

    getAllTicketLoading: false,
    getFilteredTicketLoading: false,
    updateTicketLoading: false,

    getAllTicketError: null,
    getFilteredTicketError: null,
    updateTicketError: null,

    total: 0,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get All Tickets
      .addCase(getAllTickets.pending, (state) => {
        state.getAllTicketLoading = true;
        state.getAllTicketError = null;
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.getAllTicketLoading = false;
        state.tickets = action.payload;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.getAllTicketLoading = false;
        state.getAllTicketError = action.payload;
      })

      // ✅ Get Filtered Tickets
      .addCase(getFilteredTickets.pending, (state) => {
        state.getFilteredTicketLoading = true;
        state.getFilteredTicketError = null;
      })
      .addCase(getFilteredTickets.fulfilled, (state, action) => {
        state.getFilteredTicketLoading = false;
        state.filteredTickets = action.payload.tickets;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getFilteredTickets.rejected, (state, action) => {
        state.getFilteredTicketLoading = false;
        state.getFilteredTicketError = action.payload;
      })

      // ✅ Update Ticket Status
      .addCase(updateTicketStatus.pending, (state) => {
        state.updateTicketLoading = true;
        state.updateTicketError = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.updateTicketLoading = false;
        // update ticket inside tickets list
        const updated = action.payload.ticket;
        state.tickets = state.tickets.map((t) =>
          t._id === updated._id ? updated : t
        );
        state.filteredTickets = state.filteredTickets.map((t) =>
          t._id === updated._id ? updated : t
        );
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.updateTicketLoading = false;
        state.updateTicketError = action.payload;
      });
  },
});

export default ticketSlice.reducer;
