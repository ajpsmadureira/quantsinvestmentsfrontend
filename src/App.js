import styles from "./App.module.css";
import NavigationBar from "./components/navigation_bar/NavigationBar";
import LoginModal from "./components/modals/LoginModal";
import NewInvestmentModal from "./components/modals/NewInvestmentModal";
import SellInvestmentModal from "./components/modals/SellInvestmentModal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import loginSlice from "./store/login-slice";
import appSlice from "./store/app-slice";
import panelsSlice from "./store/panels-slice";
import * as Model from "./model";
import Panels from "./components/Panels";
import Operations from "./components/operations/Operations";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";

let appData = {};

function App() {
  const showLoginModal = useSelector((state) => state.login.showLoginModal);

  const showNewInvestmentModal = useSelector(
    (state) => state.panels.showNewInvestmentModal
  );

  const showSellInvestmentModal = useSelector(
    (state) => state.panels.showSellInvestmentModal
  );

  const loggedIn = useSelector((state) => state.login.loggedIn);

  const retrieveSessionData = useSelector(
    (state) => state.app.retrieveSessionData
  );

  const performanceDataRetrieved = useSelector(
    (state) => state.app.performanceDataRetrieved
  );

  const dataRetrievingFailed = useSelector(
    (state) => state.app.dataRetrievingFailed
  );

  const pageToPresent = useSelector((state) => state.app.pageToPresent);

  const appDataRetrieved = useSelector((state) => state.app.appDataRetrieved);

  const investmentsRetrieved = useSelector(
    (state) => state.app.investmentsRetrieved
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (appDataRetrieved || !performanceDataRetrieved) return;

    async function getAdditionalData() {
      try {
        appData.marketState = await Model.getMarketState();
        appData.recommendations = await Model.getRecommendations();
        [appData.instruments, appData.startDate, appData.endDate] =
          await Model.getInstruments();
        dispatch(appSlice.actions.setAppDataRetrieved());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getAdditionalData();
  }, [appDataRetrieved, dispatch, performanceDataRetrieved]);

  useEffect(() => {
    if (!loggedIn) {
      appData.investments = undefined;
      return;
    }

    if (investmentsRetrieved) return;

    async function getInvestments() {
      try {
        appData.investments = await Model.getInvestments();
        dispatch(appSlice.actions.setInvestmentsRetrieved());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getInvestments();
  }, [dispatch, investmentsRetrieved, loggedIn]);

  const loginModalOpenHandler = (event) => {
    dispatch(loginSlice.actions.showLoginModal());
  };

  const loginModalCloseHandler = (event) => {
    dispatch(loginSlice.actions.closeLoginModal());
  };

  const registerNewInvestmentModalCloseHandler = (event) => {
    dispatch(panelsSlice.actions.closeRegisterNewInvestmentModal());
  };

  const sellInvestmentModalCloseHandler = (event) => {
    dispatch(panelsSlice.actions.closeSellInvestmentModal());
  };

  useEffect(() => {
    if (!retrieveSessionData) return;

    async function getSessionData() {
      try {
        const sessionData = await Model.getSessionData();
        dispatch(appSlice.actions.setSessionData(sessionData));
        dispatch(appSlice.actions.sessionDataRefreshed());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getSessionData();
  }, [retrieveSessionData, dispatch]);

  useEffect(() => {
    async function getPerformanceData() {
      try {
        const performanceData = await Model.getPerformanceAndBenchmarks();
        appData.performanceData = performanceData;
        dispatch(appSlice.actions.setPerformanceDataRetrieved());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getPerformanceData();
  }, [dispatch]);

  const realtimeInformationRefreshed = useSelector(
    (state) => state.app.realtimeInformationRefreshed
  );

  useEffect(() => {
    if (realtimeInformationRefreshed) return;

    async function getRealTimeInformation() {
      try {
        const realtimeData = await Model.getRealTimeInformation();
        appData.realtimeData = realtimeData;
        dispatch(appSlice.actions.setRealtimeDataRefreshed());
      } catch (err) {
        appData.realtimeData = [null, null, []];
      }
    }
    getRealTimeInformation();
    setTimeout(() => {
      dispatch(appSlice.actions.refreshRealtimeData());
    }, 5000);
  }, [realtimeInformationRefreshed, dispatch]);

  const serverOkUI = (
    <div className={styles.App}>
      {showLoginModal && (
        <LoginModal closeModalHandler={loginModalCloseHandler} />
      )}
      {showNewInvestmentModal && (
        <NewInvestmentModal
          appData={appData}
          closeModalHandler={registerNewInvestmentModalCloseHandler}
        />
      )}
      {showSellInvestmentModal && (
        <SellInvestmentModal
          appData={appData}
          closeModalHandler={sellInvestmentModalCloseHandler}
        />
      )}
      <NavigationBar loginModalOpenHandler={loginModalOpenHandler} />
      <div className={styles["dark-overlay"]}>
        <div className={styles["div_content"]}>
          {pageToPresent === "home" && (
            <Home performanceData={appData.performanceData} />
          )}
          {pageToPresent === "dailypicks" && (
            <Panels page={pageToPresent} appData={appData} />
          )}
          {pageToPresent === "investments" && (
            <Panels page={pageToPresent} appData={appData} />
          )}
          {pageToPresent === "operations" && <Operations />}
        </div>
      </div>
      <Footer />
    </div>
  );

  const serverNokUI = (
    <h1>
      <center>
        <br />
        <br />
        Maintenance work ongoing in Quants.Investments. <br /> Please come back
        later.
      </center>
    </h1>
  );

  return !dataRetrievingFailed ? serverOkUI : serverNokUI;
}

export default App;
