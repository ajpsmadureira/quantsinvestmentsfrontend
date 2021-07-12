import Logo from "./Logo";
import Item from "./Item";
import { useSelector } from "react-redux";
import loginSlice from "../../store/login-slice";
import panelsSlice from "../../store/panels-slice";
import appSlice from "../../store/app-slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import * as Model from "../../model";

function NavigationBar(props) {
  const loggedIn = useSelector((state) => state.login.loggedIn);

  const isLoggingOut = useSelector((state) => state.login.isLoggingOut);

  const appDataRetrieved = useSelector((state) => state.app.appDataRetrieved);

  const investmentsRetrieved = useSelector(
    (state) => state.app.investmentsRetrieved
  );

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const roles = useSelector((state) => state.app.roles);

  const dispatch = useDispatch();

  const startLogoutHandler = (event) => {
    dispatch(loginSlice.actions.startLoggingOut());
    dispatch(appSlice.actions.showPage("home"));
  };

  const showHomeHandler = (event) => {
    dispatch(appSlice.actions.showPage("home"));
  };

  const showDailyPicksHandler = (event) => {
    dispatch(panelsSlice.actions.highlight(undefined));
    dispatch(panelsSlice.actions.setIndexFirstTableElement(0));
    dispatch(appSlice.actions.showPage("dailypicks"));
  };

  const showInvestmentsHandler = (event) => {
    dispatch(panelsSlice.actions.highlight(undefined));
    dispatch(panelsSlice.actions.setIndexFirstTableElement(0));
    dispatch(appSlice.actions.showPage("investments"));
  };

  const showOperationsHandler = (event) => {
    dispatch(appSlice.actions.showPage("operations"));
  };

  useEffect(() => {
    if (!isLoggingOut) return;

    async function logout() {
      try {
        await Model.logout(csrfToken);
      } catch (err) {
        console.log(err);
      }
      dispatch(loginSlice.actions.loggedOut());
      dispatch(appSlice.actions.unsetInvestmentsRetrieved());
      dispatch(panelsSlice.actions.reset());
      dispatch(appSlice.actions.refreshSessionData());
    }
    logout();
  }, [isLoggingOut, dispatch, csrfToken]);

  return (
    <div className="navbar navbar-expand-lg bg-dark navbar-dark py-4">
      <div className="container">
        <Logo />
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            <Item itemKey="1" content="Home" clickHandler={showHomeHandler} />
          </ul>
          <ul className="navbar-nav">
            <Item
              itemKey="2"
              content="Daily Picks"
              clickHandler={
                appDataRetrieved ? showDailyPicksHandler : undefined
              }
            />
          </ul>
          {loggedIn && (
            <ul className="navbar-nav">
              <Item
                itemKey="3"
                content="Investments"
                clickHandler={
                  appDataRetrieved && investmentsRetrieved
                    ? showInvestmentsHandler
                    : undefined
                }
              />
            </ul>
          )}
          {loggedIn && roles.includes("ROLE_ADMIN") && (
            <ul className="navbar-nav">
              <Item
                itemKey="4"
                content="Operations"
                clickHandler={showOperationsHandler}
              />
            </ul>
          )}
          <ul className="navbar-nav ml-auto">
            {!loggedIn && (
              <Item
                itemKey="5"
                clickHandler={props.loginModalOpenHandler}
                content="Login"
              />
            )}
            {loggedIn && (
              <Item
                itemKey="6"
                clickHandler={startLogoutHandler}
                content={[
                  <i key="abc" className="fas fa-sign-out-alt"></i>,
                  " Logout",
                ]}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
