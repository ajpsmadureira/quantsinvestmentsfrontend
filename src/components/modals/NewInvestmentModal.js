import ReactModal from "./ReactModal";
import styles from "./Modals.module.css";
import loader from "../Loader.module.css";
import button from "../buttons/SubmitButton.module.css";
import { useSelector, useDispatch } from "react-redux";
import panelsSlice from "../../store/panels-slice";
import appSlice from "../../store/app-slice";
import { useEffect, useRef } from "react";
import * as Model from "./../../model";
import * as Helpers from "./../../helpers";
import * as Config from "./../../config";

function NewInvestmentModal(props) {
  const isRegisteringNewInvestment = useSelector(
    (state) => state.panels.isRegisteringNewInvestment
  );

  const registeringNewInvestmentFailed = useSelector(
    (state) => state.panels.registeringNewInvestmentFailed
  );

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

  const symbolInputRef = useRef();

  const exchangeInputRef = useRef();

  const handlerValidateSymbol = function (e) {
    const symbol = symbolInputRef.current;
    const exchange = exchangeInputRef.current;
    const result = Model.validateSymbol(
      props.appData.instruments,
      symbol.value,
      exchange.value
    );
    if (result === false) {
      symbol.classList.remove(styles["field_ok"]);
      symbol.classList.add(styles["field_nok"]);
    } else {
      symbol.classList.remove(styles["field_nok"]);
      symbol.classList.add(styles["field_ok"]);
      symbol.value = result;
    }
  };

  const numberSharesInputRef = useRef();

  const handlerValidateNumberShares = function (e) {
    const numberShares = numberSharesInputRef.current;
    const result = Model.validateNumberSharesInput(numberShares.value);
    if (result === false) {
      numberShares.classList.remove(styles["field_ok"]);
      numberShares.classList.add(styles["field_nok"]);
    } else {
      numberShares.classList.remove(styles["field_nok"]);
      numberShares.classList.add(styles["field_ok"]);
      numberShares.value = result;
    }
  };

  const sharesPriceInputRef = useRef();

  const handlerValidateSharesPrice = function (e) {
    const sharesPrice = sharesPriceInputRef.current;
    const result = Model.validatePriceInput(sharesPrice.value);
    if (result === false) {
      sharesPrice.classList.remove(styles["field_ok"]);
      sharesPrice.classList.add(styles["field_nok"]);
    } else {
      sharesPrice.classList.remove(styles["field_nok"]);
      sharesPrice.classList.add(styles["field_ok"]);
      sharesPrice.value = result;
    }
  };

  const buyCostsInputRef = useRef();

  const handlerValidateBuyCosts = function (e) {
    const buyCosts = buyCostsInputRef.current;
    const result = Model.validatePriceInput(buyCosts.value);
    if (result === false) {
      buyCosts.classList.remove(styles["field_ok"]);
      buyCosts.classList.add(styles["field_nok"]);
    } else {
      buyCosts.classList.remove(styles["field_nok"]);
      buyCosts.classList.add(styles["field_ok"]);
      buyCosts.value = result;
    }
  };

  const buyDateInputRef = useRef();

  const popUpRef = useRef();

  const handlerValidateBuyDate = function (e) {
    const buyDate = buyDateInputRef.current;
    const result = Model.validateDateInput(
      props.appData.investments,
      props.appData.startDate,
      props.appData.endDate,
      buyDate.value,
      undefined,
      false
    );

    if (result === 0) {
      buyDate.classList.remove(styles["field_nok"]);
      buyDate.classList.add(styles["field_ok"]);
      return;
    }

    if (result === 1) {
      renderIncorrectDateInput(buyDate, undefined, undefined);
      return;
    }

    if (result === 2) {
      renderIncorrectDateInput(
        buyDate,
        popUpRef.current,
        `Date has to be between ${Helpers.getDateStringFromDate(
          props.appData.startDate
        )} and ${Helpers.getDateStringFromDate(props.appData.endDate)}`
      );
      return;
    }

    if (result === 3) {
      renderIncorrectDateInput(
        buyDate,
        popUpRef.current,
        "Date cannot be a " +
          Helpers.getDayOfWeekFromDate(
            Helpers.getDateFromDateString(buyDate.value)
          )
      );
      return;
    }

    if (result === 4) {
      renderIncorrectDateInput(
        buyDate,
        popUpRef.current,
        "Sell date must be after buy date"
      );
      return;
    }
  };

  const startRegisteringNewInvestmentHandler = (event) => {
    if (symbolInputRef.current.classList.contains(styles["field_nok"])) return;
    if (exchangeInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (numberSharesInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (sharesPriceInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (buyCostsInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (buyDateInputRef.current.classList.contains(styles["field_nok"])) return;

    dispatch(panelsSlice.actions.registerNewInvestment());
  };

  useEffect(() => {
    async function registerNewInvestment() {
      if (!isRegisteringNewInvestment) return;

      try {
        await Model.saveInvestment(
          props.appData.instruments,
          symbolInputRef.current.value,
          exchangeInputRef.current.value,
          buyDateInputRef.current.value,
          numberSharesInputRef.current.value,
          sharesPriceInputRef.current.value,
          buyCostsInputRef.current.value,
          csrfToken
        );
        dispatch(panelsSlice.actions.showRegisteringNewInvestmentSuccess());
        dispatch(appSlice.actions.unsetInvestmentsRetrieved());
        dispatch(panelsSlice.actions.highlight(undefined));
      } catch (err) {
        console.log(err);
        dispatch(panelsSlice.actions.showRegisteringNewInvestmentFailed());
        return;
      }
    }
    registerNewInvestment();
  }, [
    isRegisteringNewInvestment,
    dispatch,
    csrfToken,
    props.appData.instruments,
  ]);

  return (
    <ReactModal closeModalHandler={props.closeModalHandler}>
      <h5 style={{ marginBottom: "2rem" }}>Register your new investment</h5>

      <p style={{ textAlign: "left", margin: "0rem" }}>Symbol</p>

      <div style={{ display: "flex" }}>
        <input
          style={{ width: "100%", marginBottom: "1rem" }}
          autoComplete="off"
          type="text"
          className={`${styles.input} form-control`}
          ref={symbolInputRef}
          onBlur={handlerValidateSymbol}
        />

        <div style={{ width: "100%", display: "block", textAlign: "end" }}>
          <select
            style={{
              display: "inline",
              width: "75%",
              marginBottom: "1rem",
            }}
            className={`${styles["field_ok"]} ${styles.input} form-control`}
            type="text"
            ref={exchangeInputRef}
          >
            <option>NASDAQ</option>
            <option>NYSE</option>
          </select>
        </div>
      </div>

      <p style={{ textAlign: "left", margin: "0rem" }}>Number of Shares</p>

      <input
        onBlur={handlerValidateNumberShares}
        ref={numberSharesInputRef}
        style={{ marginBottom: "1rem" }}
        autoComplete="off"
        type="text"
        className={`${styles.input} form-control`}
      />

      <p style={{ textAlign: "left", margin: "0rem" }}>Buy Date (MM/DD/YYYY)</p>

      <div className={styles["div_buydatepopup"]}>
        <input
          ref={buyDateInputRef}
          onBlur={handlerValidateBuyDate}
          style={{ marginBottom: "1rem" }}
          autoComplete="off"
          type="text"
          className={`${styles.input} form-control`}
        />
        <span className={styles["span_buydatepopuptext"]} ref={popUpRef} />
      </div>

      <p style={{ textAlign: "left", margin: "0rem" }}>Share Price (USD)</p>

      <input
        ref={sharesPriceInputRef}
        onBlur={handlerValidateSharesPrice}
        style={{ marginBottom: "1rem" }}
        autoComplete="off"
        type="text"
        className={`${styles.input} form-control`}
      />

      <p style={{ textAlign: "left", margin: "0rem" }}>Buy Costs (USD)</p>

      <input
        ref={buyCostsInputRef}
        onBlur={handlerValidateBuyCosts}
        style={{ marginBottom: "1rem" }}
        autoComplete="off"
        type="text"
        className={`${styles.input} form-control`}
      />

      <div style={{ height: "50px" }}>
        {isRegisteringNewInvestment && (
          <div className={`${loader.loader}`}></div>
        )}
        {!isRegisteringNewInvestment && (
          <button
            onClick={startRegisteringNewInvestmentHandler}
            style={{ marginBottom: "1rem" }}
            type="button"
            className={`${button["submit_button"]} btn btn-block`}
          >
            {!registeringNewInvestmentFailed ? "Register" : "Try again"}
          </button>
        )}
      </div>
    </ReactModal>
  );
}

/**
 * Renders incorrect date input field.
 * @param {Element} inputElement element to be rendered.
 * @param {[Element]} popupElement optional popup element to be rendered with a message to the end user.
 * @param {[string]} errorMessage optional error message to be presented in a popup message to the end user.
 */
function renderIncorrectDateInput(inputElement, popupElement, errorMessage) {
  inputElement.classList.remove(styles["field_ok"]);
  inputElement.classList.add(styles["field_nok"]);
  if (popupElement && errorMessage) {
    popupElement.textContent = errorMessage;
    popupElement.classList.toggle(styles["show"]);
    setTimeout(function () {
      popupElement.classList.toggle(styles["show"]);
    }, 1000 * Config.POPUP_TIMEOUT_SECS);
  }
}

export default NewInvestmentModal;
