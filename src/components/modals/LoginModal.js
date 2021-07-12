import ReactModal from "./ReactModal";
import styles from "./Modals.module.css";
import loader from "../Loader.module.css";
import button from "../buttons/SubmitButton.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import * as Model from "../../model";
import loginSlice from "../../store/login-slice";
import appSlice from "../../store/app-slice";

function LoginModal(props) {
  const isLoggingIn = useSelector((state) => state.login.isLoggingIn);

  const loginFailed = useSelector((state) => state.login.loginFailed);

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

  const startLoginHandler = (event) => {
    dispatch(loginSlice.actions.startLogin());
  };

  const loginInputRef = useRef();

  const passwordInputRef = useRef();

  useEffect(() => {
    async function login() {
      if (!isLoggingIn) return;

      if (loginInputRef.current.value.trim().length === 0) {
        dispatch(loginSlice.actions.showLoginFailed());
        return;
      }

      if (passwordInputRef.current.value.trim().length === 0) {
        dispatch(loginSlice.actions.showLoginFailed());
        return;
      }

      try {
        await Model.login(
          loginInputRef.current.value,
          passwordInputRef.current.value,
          csrfToken
        );
        dispatch(loginSlice.actions.showLoginSuccess());
        dispatch(appSlice.actions.refreshSessionData());
      } catch (err) {
        console.log(err);
        dispatch(loginSlice.actions.showLoginFailed());
        return;
      }
    }
    login();
  }, [isLoggingIn, dispatch, csrfToken]);

  return (
    <ReactModal closeModalHandler={props.closeModalHandler}>
      <div>
        <h5 className={styles.h5}>
          Login to register your investments <br /> and get specific advice
          about them
        </h5>

        <p className={styles.p}>Email</p>

        <input
          className={`${styles.input} ${styles.input} form-control`}
          autoComplete="off"
          placeholder="Your Email..."
          name="email"
          type="email"
          ref={loginInputRef}
        />

        <p className={styles.p}>Password</p>

        <input
          className={`${styles.input} ${styles.login} form-control`}
          autoComplete="off"
          placeholder="Your Password..."
          name="password"
          type="password"
          ref={passwordInputRef}
        />
      </div>

      <div style={{ height: "50px" }}>
        {isLoggingIn && <div className={`${loader.loader}`}></div>}

        {!isLoggingIn && (
          <button
            onClick={startLoginHandler}
            style={{ marginBottom: "1rem" }}
            type="button"
            className={`${button["submit_button"]} btn btn-block`}
          >
            {!loginFailed ? "Login" : "Try again"}
          </button>
        )}
      </div>

      <p style={{ textAlign: "center", margin: "0rem" }}>
        For now, registration is only by invitation. <br /> Contact us if
        interested.
      </p>
    </ReactModal>
  );
}

export default LoginModal;
