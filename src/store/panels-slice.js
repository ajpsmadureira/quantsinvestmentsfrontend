import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  indexFirstTableElement: 0,
  highlightId: undefined,
  graphDataAvailable: false,
  newsAvailable: false,
  showNewInvestmentModal: false,
  isRegisteringNewInvestment: false,
  registeringNewInvestmentFailed: false,
  showSellInvestmentModal: false,
  isSellingInvestment: false,
  sellInvestmentFailed: false,
  sellInvestmentData: undefined,
};

const panelsSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {
    setIndexFirstTableElement(state, action) {
      state.indexFirstTableElement = action.payload;
    },
    highlight(state, action) {
      state.highlightId = action.payload;
      state.graphDataAvailable = false;
      state.newsAvailable = false;
    },
    setGraphDataAvailable(state) {
      state.graphDataAvailable = true;
    },
    setNewsAvailable(state) {
      state.newsAvailable = true;
    },
    showNewInvestmentModal(state) {
      state.showNewInvestmentModal = true;
    },
    registerNewInvestment(state) {
      state.isRegisteringNewInvestment = true;
    },
    showRegisteringNewInvestmentSuccess(state) {
      state.showNewInvestmentModal = false;
      state.isRegisteringNewInvestment = false;
      state.registeringNewInvestmentFailed = false;
    },
    showRegisteringNewInvestmentFailed(state) {
      state.isRegisteringNewInvestment = false;
      state.registeringNewInvestmentFailed = true;
    },
    closeRegisterNewInvestmentModal(state) {
      state.showNewInvestmentModal = false;
    },
    showSellInvestmentModal(state, action) {
      state.showSellInvestmentModal = true;
      state.sellInvestmentData = action.payload;
    },
    sellInvestment(state) {
      state.isSellingInvestment = true;
    },
    showSellInvestmentSuccess(state) {
      state.showSellInvestmentModal = false;
      state.isSellingInvestment = false;
      state.sellInvestmentFailed = false;
    },
    showSellInvestmentFailed(state) {
      state.isSellingInvestment = false;
      state.sellInvestmentFailed = true;
    },
    closeSellInvestmentModal(state) {
      state.showSellInvestmentModal = false;
      state.sellInvestmentData = undefined;
    },
    reset(state) {
      state = initialState;
    },
  },
});

export default panelsSlice;
