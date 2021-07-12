import { useSelector, useDispatch } from "react-redux";
import * as Config from "../../config";
import panelsSlice from "../../store/panels-slice";
import StockLogo from "../StockLogo";
import * as Helpers from "../../helpers";
import styles from "./../Panels.module.css";

function RecommendationsSmallerScreens(props) {
  const marketState = props.appData.marketState;
  const isMarketOpenNow = props.appData.realtimeData.isMarketOpenNow;
  const recommendations = props.appData.recommendations;
  const instruments = props.appData.instruments;
  const minutesUntilMarketOpens = props.appData.realtimeData[1];
  const recommendedStocksRecentTickerPrices =
    props.appData.realtimeData.recommendedStocksRecentTickerPrices;

  let indexFirstTableElement = useSelector(
    (state) => state.panels.indexFirstTableElement
  );

  const dispatch = useDispatch();

  const clickPreviousPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE < 0
        ? 0
        : indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
  };

  const clickNextPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE <
      recommendations.length
        ? indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE
        : recommendations.length;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
  };

  let innerHTML = (
    <tr key="1">
      <td style={{ width: "40%" }}></td>
      <td style={{ width: "30%" }}></td>
      <td style={{ width: "30%" }}></td>
    </tr>
  );

  innerHTML = [
    innerHTML,
    <tr key="2">
      <td style={{ textAlign: "center" }} colSpan="3">
        {" "}
        <i style={{ fontSize: "40pt" }} className="fab fa-buffer"></i>
      </td>
    </tr>,
  ];

  innerHTML = [
    innerHTML,
    <tr key="3">
      <td style={{ paddingBottom: "2rem", textAlign: "center" }} colSpan="3">
        {" "}
        <h4>Daily Best Stock Picks</h4>
      </td>
    </tr>,
  ];

  if (indexFirstTableElement === undefined) indexFirstTableElement = 0;

  let count = 0;

  for (let i = indexFirstTableElement; i < recommendations.length; i++) {
    let recentPrice;

    if (isMarketOpenNow && recommendedStocksRecentTickerPrices) {
      const recommendedStock = recommendedStocksRecentTickerPrices.find(
        function (e) {
          return e.id === recommendations[i][0];
        }
      );
      if (recommendedStock) recentPrice = recommendedStock.close.toFixed(2);
    } else recentPrice = null;

    if (count === Config.NUMBER_RESULTS_PER_PAGE) break;

    ++count;

    const instrument =
      instruments[
        instruments
          .map((x) => x.id)
          .findIndex((x) => x === recommendations[i][0])
      ];

    innerHTML = [
      innerHTML,
      <tr key="4">
        <td colSpan="3" style={{ paddingBottom: "2rem", textAlign: "center" }}>
          {indexFirstTableElement + count} .&nbsp;&nbsp; {instrument.name}{" "}
          <br />
          <div style={{ display: "inline-block", verticalAlign: "middle" }}>
            <StockLogo filename={recommendations[i][5]} />
          </div>
          <span>
            &nbsp;&nbsp;{instrument.symbol}
            {", "}
            {instrument.exchange}
          </span>
          {isMarketOpenNow && recentPrice && "Last Price: $" + recentPrice
            ? "&nbsp;&nbsp;&nbsp;&nbsp;$" + recentPrice
            : ""}
          <br />
          <small>
            {" "}
            Last Week:{" "}
            <span
              className={
                recommendations[i][3] >= 0
                  ? styles["green-light"]
                  : styles["red-light"]
              }
            >
              {recommendations[i][3] >= 0 ? "+" : ""}{" "}
              {recommendations[i][3].toFixed(2)}%
            </span>{" "}
            Last Month:{" "}
            <span
              className={
                recommendations[i][4] >= 0
                  ? styles["green-light"]
                  : styles["red-light"]
              }
            >
              {recommendations[i][4] >= 0 ? "+" : ""}{" "}
              {recommendations[i][4].toFixed(2)}%
            </span>
          </small>
        </td>
      </tr>,
    ];
  }

  innerHTML = [
    innerHTML,
    <tr key="5">
      <td colSpan="3" style={{ paddingBottom: "2rem" }}>
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
              recommendations.length
                ? "none"
                : "block",
          }}
        >
          {` Page ${
            Math.trunc(
              indexFirstTableElement / Config.NUMBER_RESULTS_PER_PAGE
            ) + 2
          }`}{" "}
          &#8594;
        </div>
      </td>
    </tr>,
  ];

  innerHTML = [
    innerHTML,
    <tr key="6">
      <td style={{ textAlign: "center" }} colSpan="3">
        {" "}
        Markets Performance:{" "}
      </td>
    </tr>,
  ];

  const todaysEpoch = Date.now();
  const todaysDay = Helpers.getDayOfWeekFromEpoch(todaysEpoch);
  const yesterdaysDay = Helpers.getDayOfWeekFromEpoch(todaysEpoch - 86400000);

  const labels = new Array(4);

  if (
    marketState[marketState.length - 1].timestamp >
    todaysEpoch - 5 * 86400000
  ) {
    for (let i = marketState.length - 1; i >= marketState.length - 4; i--) {
      let label;

      const dayOfWeek = Helpers.getDayOfWeekFromEpoch(marketState[i].timestamp);

      if (dayOfWeek === todaysDay) {
        label = "Today";
      } else if (dayOfWeek === yesterdaysDay) {
        label = "Yesterday";
      } else {
        label = Helpers.getDayOfWeekFromEpoch(marketState[i].timestamp);
      }

      labels[i - marketState.length + 4] = label;

      switch (marketState[i].state) {
        case 0:
          label = (
            <i
              className={`${styles["green-light"]} fas fa-arrow-circle-up`}
            ></i>
          );
          break;
        case 1:
          label = (
            <i
              className={`${styles["blue-light"]} fas fa-arrow-circle-right`}
            ></i>
          );
          break;
        case 2:
          label = (
            <i
              className={`${styles["red-light"]} fas fa-arrow-circle-down`}
            ></i>
          );
          break;
        default:
          break;
      }
      innerHTML = [
        innerHTML,
        <tr key="7">
          <td></td>
          <td> {labels[i - marketState.length + 4]} </td>
          <td> {label} </td>
        </tr>,
      ];
    }
  }

  const days = Math.floor(minutesUntilMarketOpens / 60 / 24);
  const hours = Math.floor((minutesUntilMarketOpens - days * 24 * 60) / 60);
  const minutes = minutesUntilMarketOpens - days * 24 * 60 - hours * 60;

  if (isMarketOpenNow)
    innerHTML = [
      innerHTML,
      <tr key="8">
        <td style={{ textAlign: "center" }} colSpan="3">
          <i className="far fa-clock"></i> Markets are now open
        </td>
      </tr>,
    ];
  else {
    if (minutes !== 0 || hours !== 0 || days !== 0) {
      let label = "Markets will open in ";
      if (days > 1) label += days + " days";
      if (days === 1) label += "1 day";
      if (
        (days !== 0 && hours !== 0 && minutes === 0) ||
        (days !== 0 && hours === 0 && minutes !== 0)
      )
        label += " and ";
      if (days !== 0 && hours !== 0 && minutes !== 0) label += ", ";
      if (hours > 1) label += hours + " hours";
      if (hours === 1) label += "1 hour";
      if (hours !== 0 && label !== 0) label += " and ";
      if (minutes === 1) label += " 1 minute";
      if (minutes > 1) label += minutes + " minutes";
      innerHTML = [
        innerHTML,
        <tr key="9">
          <td style={{ textAlign: "center" }} colSpan="3">
            <i className="far fa-clock"></i> {label}
          </td>
        </tr>,
      ];
    }
  }

  return <tbody>{innerHTML}</tbody>;
}

export default RecommendationsSmallerScreens;
