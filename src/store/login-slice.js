import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginModal: false,
  isLoggingIn: false,
  loginFailed: false,
  loggedIn: false,
  isLoggingOut: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    showLoginModal(state) {
      state.isLoggingIn = false;
      state.showLoginModal = true;
      state.loginFailed = false;
      state.loggedIn = false;
      state.isLoggingOut = false;
    },
    closeLoginModal(state) {
      state.showLoginModal = false;
    },
    startLogin(state) {
      state.isLoggingIn = true;
    },
    showLoginFailed(state) {
      state.isLoggingIn = false;
      state.loginFailed = true;
    },
    showLoginSuccess(state) {
      state.isLoggingIn = false;
      state.showLoginModal = false;
      state.loginFailed = false;
      state.loggedIn = true;
    },
    startLoggingOut(state) {
      state.isLoggingOut = true;
    },
    loggedOut(state) {
      state.isLoggingOut = false;
      state.loggedIn = false;
    },
  },
});

export default loginSlice;
