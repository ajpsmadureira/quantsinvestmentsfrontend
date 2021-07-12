import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  graphDataAvailable: false,
};

const operationsSlice = createSlice({
  name: "operations",
  initialState,
  reducers: {
    setGraphDataAvailable(state) {
      state.graphDataAvailable = true;
    },
  },
});

export default operationsSlice;
