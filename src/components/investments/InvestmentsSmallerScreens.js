import { useSelector, useDispatch } from "react-redux";
import * as Config from "../../config";
import panelsSlice from "../../store/panels-slice";
import appSlice from "../../store/app-slice";
import StockLogo from "../StockLogo";
import * as Helpers from "../../helpers";
import styles from "./../Panels.module.css";
import * as Model from "./../../model";
import { useRef } from "react";

function InvestmentsSmallerScreens(props) {
  const investments = props.appData.investments;

  const instruments = props.appData.instruments;

  const indexFirstTableElement = useSelector(
    (state) => state.panels.indexFirstTableElement
  );

  const sortedInvestments = Helpers.getSortedInvestments(investments);

  const tableRef = useRef();

  // create vector of timestamps

  let minimumTimestamp, maximumTimestamp, timestamps, balances;

  if (sortedInvestments.length > 0) {
    minimumTimestamp = investments
      .flatMap((e) => e.ticker)
      .reduce(
        (agg, ele) => (ele.x < agg ? ele.x : agg),
        Helpers.getEpochFromDateString(
          Helpers.getDateStringFromDate(new Date())
        )
      );

    maximumTimestamp = investments
      .flatMap((e) => e.ticker)
      .reduce(
        (agg, ele) => (ele.x > agg ? ele.x : agg),
        Helpers.getEpochFromDateString("01/01/2018")
      );

    timestamps = Array(
      (maximumTimestamp - minimumTimestamp) / (24 * 3600 * 1000) + 1
    )
      .fill()
      .map((_, idx) => minimumTimestamp + idx * (24 * 3600 * 1000))
      .filter((e) => Helpers.isEpochWeekday(e));

    // calculate total balance taking into account all investments and their state

    balances = new Array(timestamps.length).fill(0);

    timestamps.forEach(function (timestamp, idx) {
      investments.forEach(function (investment) {
        investment.ticker.forEach(function (ticker) {
          if (
            (investment.state !== 4 ||
              timestamp < investment.selling_timestamp) &&
            ticker.x === timestamp &&
            investment.buying_timestamp !== timestamp
          )
            balances[idx] +=
              ticker.y - investment.buying_price * investment.buying_number;
        });
        if (investment.state === 4 && timestamp >= investment.selling_timestamp)
          balances[idx] +=
            (investment.selling_price - investment.buying_price) *
            investment.buying_number;
      });
    });
  }

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

  const clickPreviousPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE < 0
        ? 0
        : indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
    tableRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const clickNextPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE <
      sortedInvestments.length
        ? indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE
        : sortedInvestments.length;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
    tableRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const clickDeleteInvestmentHandler = async function (e) {
    e.stopPropagation();
    const id = e.currentTarget.closest("tbody tr")?.cells[0].innerHTML;
    await Model.deleteInvestment(id, csrfToken);
    dispatch(appSlice.actions.unsetInvestmentsRetrieved());
  };

  const clickNewInvestmentHandler = async function (e) {
    dispatch(panelsSlice.actions.showNewInvestmentModal());
  };

  const clickSellInvestmentModal = (e) => {
    const investment = e.currentTarget.closest("tbody tr");
    const id = Number.parseInt(investment.cells[0].innerHTML);
    const instrumentId = props.appData.investments.filter(
      (x) => x.id === Number.parseInt(id)
    )[0].instrumentId;
    const symbol = props.appData.instruments.filter(
      (x) => x.id === Number.parseInt(instrumentId)
    )[0].symbol;
    dispatch(panelsSlice.actions.showSellInvestmentModal({ id, symbol }));
  };

  let innerHTML = (
    <tr key="-5">
      <td style={{ display: "none" }}></td>
      <td style={{ width: "40%" }}></td>
      <td style={{ width: "30%" }}></td>
      <td style={{ width: "30%" }}></td>
    </tr>
  );

  innerHTML = [
    innerHTML,
    <tr key="-4">
      <td style={{ display: "none" }}></td>
      <td style={{ textAlign: "center" }} colSpan="3">
        <i style={{ fontSize: "40pt" }} className="fas fa-solar-panel"></i>
      </td>
    </tr>,
  ];

  innerHTML = [
    innerHTML,
    <tr key="-3">
      <td style={{ display: "none" }}></td>
      <td style={{ paddingBottom: "2rem", textAlign: "center" }} colSpan="3">
        <h4>Investments Panel</h4>
      </td>
    </tr>,
  ];

  if (sortedInvestments.length > 0)
    innerHTML = [
      innerHTML,
      <tr key="-2">
        <td style={{ display: "none" }}></td>
        <td style={{ paddingBottom: "2rem", textAlign: "center" }} colSpan="3">
          <h4>
            {`Yield: ${balances[balances.length - 1] >= 0 ? "+" : "-"}
            ${Math.round(balances[balances.length - 1])} USD`}
          </h4>
        </td>
      </tr>,
    ];

  innerHTML = [
    innerHTML,
    <tr key="-1">
      <td style={{ display: "none" }}></td>
      <td style={{ paddingBottom: "2rem" }} colSpan="3">
        <div
          onClick={clickNewInvestmentHandler}
          className={`${styles["div_button--newinvestment"]} btn mr-2`}
        >
          New investment
        </div>
      </td>
    </tr>,
  ];

  let count = 0;

  for (let i = indexFirstTableElement; i < sortedInvestments.length; i++) {
    if (count === Config.NUMBER_RESULTS_PER_PAGE) break;

    ++count;

    const gain = (
      ((sortedInvestments[i].ticker[sortedInvestments[i].ticker.length - 1].y -
        sortedInvestments[i].ticker[0].y) /
        sortedInvestments[i].ticker[0].y) *
      100
    ).toFixed(2);

    const recommendation = Helpers.getRecommendation(
      sortedInvestments[i].state
    );

    const instrument =
      instruments[
        instruments
          .map((x) => x.id)
          .findIndex((x) => x === sortedInvestments[i].instrumentId)
      ];

    innerHTML = [
      innerHTML,
      <tr key={count.toString()}>
        <td style={{ display: "none" }}> {sortedInvestments[i].id} </td>
        <td colSpan="3" style={{ paddingBottom: "2rem", textAlign: "center" }}>
          {`${indexFirstTableElement + count}`} &nbsp;&nbsp; {instrument.name}
          <br />
          <div style={{ display: "inline-block", verticalAlign: "middle" }}>
            <StockLogo filename={sortedInvestments[i].logo}></StockLogo>
          </div>
          &nbsp;&nbsp;{instrument.symbol}, {instrument.exchange} <br />
          {sortedInvestments[i].buying_number}
          {sortedInvestments[i].buying_number === 1 ? " share" : " shares"} at $
          {sortedInvestments[i].buying_price} USD/share <br />
          on $
          {Helpers.getDateStringFromEpoch(
            sortedInvestments[i].buying_timestamp
          )}
          <br />
          Yield:&nbsp;
          <span
            className={gain >= 0 ? styles["green-light"] : styles["red-light"]}
          >
            {gain >= 0 ? "+" : ""} {gain}%
          </span>
          &nbsp;-&nbsp;{recommendation} <br />
          <button
            onClick={clickSellInvestmentModal}
            type="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Close"
            style={{ fontSize: "12pt" }}
            className={`${styles["button_edit"]} ${
              sortedInvestments[i].state === 4 ? "hidden" : ""
            } btn btn-sm rounded-0`}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            onClick={clickDeleteInvestmentHandler}
            type="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            style={{ fontSize: "12pt" }}
            className={`${styles["button_delete"]} ${
              sortedInvestments[i].state === 4 ? "hidden" : ""
            } btn btn-sm rounded-0`}
          >
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>,
    ];
  }

  innerHTML = [
    innerHTML,
    <tr key={(count + 1).toString()}>
      <td style={{ display: "none" }}></td>
      <td colSpan="3">
        <div
          onClick={clickPreviousPageHandler}
          className={`${styles["div_previouspage"]} btn`}
          style={{ display: indexFirstTableElement === 0 ? "none" : "block" }}
        >
          &#8592;
          {` Page ${Math.trunc(
            indexFirstTableElement / Config.NUMBER_RESULTS_PER_PAGE
          )}`}
        </div>
        <div
          onClick={clickNextPageHandler}
          className={`${styles["div_nextpage"]} btn`}
          style={{
            display:
              indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE >=
              sortedInvestments.length
                ? "none"
                : "block",
          }}
        >
          {`Page ${
            Math.trunc(
              indexFirstTableElement / Config.NUMBER_RESULTS_PER_PAGE
            ) + 2
          } `}{" "}
          &#8594;
        </div>
      </td>
    </tr>,
  ];

  return <tbody ref={tableRef}>{innerHTML}</tbody>;
}

export default InvestmentsSmallerScreens;
