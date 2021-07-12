import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  csrfToken: undefined,
  roles: undefined,
  dataRetrievingFailed: false,
  retrieveSessionData: true,
  pageToPresent: "home",
  realtimeInformationRefreshed: false,
  appDataRetrieved: false,
  performanceDataRetrieved: false,
  investmentsRetrieved: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPerformanceDataRetrieved(state) {
      state.performanceDataRetrieved = true;
    },
    setDataRetrievingFailed(state) {
      state.dataRetrievingFailed = true;
    },
    setSessionData(state, action) {
      state.csrfToken = action.payload["X-CSRF-TOKEN"];
      state.roles = action.payload["roles"];
    },
    refreshSessionData(state) {
      state.retrieveSessionData = true;
    },
    sessionDataRefreshed(state) {
      state.retrieveSessionData = false;
    },
    showPage(state, action) {
      state.pageToPresent = action.payload;
    },
    setRealtimeDataRefreshed(state, action) {
      state.realtimeInformationRefreshed = true;
    },
    refreshRealtimeData(state) {
      state.realtimeInformationRefreshed = false;
    },
    setAppDataRetrieved(state) {
      state.appDataRetrieved = true;
    },
    setInvestmentsRetrieved(state) {
      state.investmentsRetrieved = true;
    },
    unsetInvestmentsRetrieved(state) {
      state.investmentsRetrieved = false;
    },
  },
});

export default appSlice;
