import { configureStore } from '@reduxjs/toolkit';
import adminLeavesSlice from './authSlice';
import ticketSlice from './ticketSlice';
import jobsSlice from './jobSlice';
import organizationSlice from './department';
import taskSlice from './taskSlice';
import forgotPasswordSlice from './forgotSlice';
const store = configureStore({
  reducer: {
    auth: adminLeavesSlice,
    tickets: ticketSlice,
    jobs: jobsSlice,
    organization: organizationSlice,
    tasks: taskSlice,
    forgotPassword: forgotPasswordSlice,
  },
});

export default store;
  