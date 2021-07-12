import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./login-slice";
import appSlice from "./app-slice";
import homeSlice from "./home-slice";
import panelsSlice from "./panels-slice";
import operationsSlice from "./operations-slice";

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    app: appSlice.reducer,
    home: homeSlice.reducer,
    panels: panelsSlice.reducer,
    operations: operationsSlice.reducer,
  },
});

export default store;
