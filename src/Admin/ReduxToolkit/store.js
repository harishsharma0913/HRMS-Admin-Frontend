import { configureStore } from '@reduxjs/toolkit';
import adminLeavesSlice from './authSlice';
import ticketSlice from './ticketSlice';
import jobsSlice from './jobSlice';
import organizationSlice from './department';
const store = configureStore({
  reducer: {
    auth: adminLeavesSlice,
    tickets: ticketSlice,
    jobs: jobsSlice,
    organization: organizationSlice,
  },
});

export default store;
  