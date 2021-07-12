import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registering: false,
  registered: false,
  performanceGraphOptions: undefined,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setRegistering(state) {
      state.registering = true;
    },
    setRegistered(state) {
      state.registering = false;
      state.registered = true;
    },
    setPerformanceGraphOptions(state, action) {
      state.performanceGraphOptions = action.payload;
    },
  },
});

export default homeSlice;
