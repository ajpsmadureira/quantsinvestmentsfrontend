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

function SellInvestmentModal(props) {
  const isSellingInvestment = useSelector(
    (state) => state.panels.isSellingInvestment
  );

  const sellInvestmentFailed = useSelector(
    (state) => state.panels.sellInvestmentFailed
  );

  const sellInvestmentData = useSelector(
    (state) => state.panels.sellInvestmentData
  );

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

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

  const sellCostsInputRef = useRef();

  const handlerValidateSellCosts = function (e) {
    const sellCosts = sellCostsInputRef.current;
    const result = Model.validatePriceInput(sellCosts.value);
    if (result === false) {
      sellCosts.classList.remove(styles["field_ok"]);
      sellCosts.classList.add(styles["field_nok"]);
    } else {
      sellCosts.classList.remove(styles["field_nok"]);
      sellCosts.classList.add(styles["field_ok"]);
      sellCosts.value = result;
    }
  };

  const sellDateInputRef = useRef();

  const popUpRef = useRef();

  const handlerValidateSellDate = function (e) {
    const sellDate = sellDateInputRef.current;
    const result = Model.validateDateInput(
      props.appData.investments,
      props.appData.startDate,
      props.appData.endDate,
      sellDate.value,
      sellInvestmentData.id,
      true
    );

    if (result === 0) {
      sellDate.classList.remove(styles["field_nok"]);
      sellDate.classList.add(styles["field_ok"]);
      return;
    }

    if (result === 1) {
      renderIncorrectDateInput(sellDate, undefined, undefined);
      return;
    }

    if (result === 2) {
      renderIncorrectDateInput(
        sellDate,
        popUpRef.current,
        `Date has to be between ${Helpers.getDateStringFromDate(
          props.appData.startDate
        )} and ${Helpers.getDateStringFromDate(props.appData.endDate)}`
      );
      return;
    }

    if (result === 3) {
      renderIncorrectDateInput(
        sellDate,
        popUpRef.current,
        "Date cannot be a " +
          Helpers.getDayOfWeekFromDate(
            Helpers.getDateFromDateString(sellDate.value)
          )
      );
      return;
    }

    if (result === 4) {
      renderIncorrectDateInput(
        sellDate,
        popUpRef.current,
        "Sell date must be after buy date"
      );
      return;
    }
  };

  const startSellingInvestmentHandler = (event) => {
    if (sharesPriceInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (sellCostsInputRef.current.classList.contains(styles["field_nok"]))
      return;
    if (sellDateInputRef.current.classList.contains(styles["field_nok"]))
      return;

    dispatch(panelsSlice.actions.sellInvestment());
  };

  useEffect(() => {
    async function sellInvestment() {
      if (!isSellingInvestment) return;

      try {
        await Model.sellInvestment(
          sellInvestmentData.id,
          sellDateInputRef.current.value,
          sharesPriceInputRef.current.value,
          sellCostsInputRef.current.value,
          csrfToken
        );
        dispatch(panelsSlice.actions.showSellInvestmentSuccess());
        dispatch(appSlice.actions.unsetInvestmentsRetrieved());
        dispatch(panelsSlice.actions.highlight(undefined));
      } catch (err) {
        console.log(err);
        dispatch(panelsSlice.actions.showSellInvestmentFailed());
        return;
      }
    }
    sellInvestment();
  }, [
    isSellingInvestment,
    dispatch,
    csrfToken,
    props.appData.instruments,
    sellInvestmentData.id,
  ]);

  return (
    <ReactModal closeModalHandler={props.closeModalHandler}>
      <h5 style={{ marginBottom: "2rem" }}>
        Close your investment <br />
        in <span> {sellInvestmentData.symbol} </span>
      </h5>

      <p style={{ textAlign: "left", margin: "0rem" }}>
        Sell Date (MM/DD/YYYY)
      </p>

      <div className={styles["div_selldatepopup"]}>
        <input
          ref={sellDateInputRef}
          onBlur={handlerValidateSellDate}
          style={{ marginBottom: "1rem" }}
          autoComplete="off"
          type="text"
          className={`${styles.input} form-control`}
        />
        <span className={styles["span_selldatepopuptext"]} ref={popUpRef} />
      </div>

      <p style={{ textAlign: "left", margin: "0rem" }}>Sell Price (USD)</p>

      <input
        ref={sharesPriceInputRef}
        onBlur={handlerValidateSharesPrice}
        style={{ marginBottom: "1rem" }}
        autoComplete="off"
        type="text"
        className={`${styles.input} form-control`}
      />

      <p style={{ textAlign: "left", margin: "0rem" }}>Sell Costs (USD)</p>

      <input
        ref={sellCostsInputRef}
        onBlur={handlerValidateSellCosts}
        style={{ marginBottom: "1rem" }}
        autoComplete="off"
        type="text"
        className={`${styles.input} form-control`}
      />

      <div style={{ height: "50px" }}>
        {isSellingInvestment && <div className={`${loader.loader}`}></div>}
        {!isSellingInvestment && (
          <button
            onClick={startSellingInvestmentHandler}
            style={{ marginBottom: "1rem" }}
            type="button"
            className={`${button["submit_button"]} btn btn-block`}
          >
            {!sellInvestmentFailed ? "Close" : "Try again"}
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

export default SellInvestmentModal;
