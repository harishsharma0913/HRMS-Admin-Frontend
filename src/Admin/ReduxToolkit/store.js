import { configureStore } from '@reduxjs/toolkit';
import adminLeavesSlice from './authSlice';
import ticketSlice from './ticketSlice';
import jobsSlice from './jobSlice';
import organizationSlice from './department';
import taskSlice from './taskSlice';
const store = configureStore({
  reducer: {
    auth: adminLeavesSlice,
    tickets: ticketSlice,
    jobs: jobsSlice,
    organization: organizationSlice,
    tasks: taskSlice,
  },
});

export default store;
  