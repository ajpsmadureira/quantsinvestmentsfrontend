import styles from "./../Panels.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as Config from "../../config";
import panelsSlice from "../../store/panels-slice";
import StockLogo from "../StockLogo";
import { useEffect } from "react";

function RecommendationsLargerScreens(props) {
  const isMarketOpenNow = props.appData.realtimeData.isMarketOpenNow;
  const recommendations = props.appData.recommendations;
  const instruments = props.appData.instruments;
  const recommendedStocksRecentTickerPrices =
    props.appData.realtimeData.recommendedStocksRecentTickerPrices;

  const indexFirstTableElement = useSelector(
    (state) => state.panels.indexFirstTableElement
  );

  const highlightId = useSelector((state) => state.panels.highlightId);

  const dispatch = useDispatch();

  const highlightClickHandler = function (e) {
    const node = e.target.closest("tbody tr");
    const id = node.childNodes[0].innerHTML;
    dispatch(panelsSlice.actions.highlight(id));
  };

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
    <tr key="-1">
      <td style={{ display: "none" }}></td>
      <td className={styles["table_td--dispensable"]}></td>
      <td className={styles["table_td--dispensable"]}></td>
      <td>Symbol</td>
      <td className="text-center">Last Week</td>
      <td className="text-center">Last Month</td>
      <td
        className="text-center"
        style={{ display: !isMarketOpenNow ? "none" : "block" }}
      >
        Last Price
      </td>
    </tr>
  );

  let count = 0;

  let highlighted = false;

  for (let i = indexFirstTableElement; i < recommendations.length; i++) {
    if (
      instruments[
        instruments
          .map((x) => x.id)
          .findIndex((x) => x === recommendations[i][0])
      ] === undefined
    )
      continue;

    let recentPrice;

    console.log(recommendedStocksRecentTickerPrices);

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

    if (recommendations[i][0] === parseInt(highlightId)) highlighted = true;

    innerHTML = [
      innerHTML,
      <tr
        key={count}
        className={`${styles.clickableRow} ${
          recommendations[i][0] === parseInt(highlightId)
            ? styles.highlight
            : ""
        }`}
        onClick={highlightClickHandler}
      >
        <td style={{ display: "none" }}>{recommendations[i][0]}</td>
        <td className={styles["table_td--dispensable"]}>
          {indexFirstTableElement + count}
        </td>
        <td className={styles["table_td--dispensable"]}>
          <StockLogo filename={recommendations[i][5]} />
        </td>
        <td>
          {
            instruments[
              instruments
                .map((x) => x.id)
                .findIndex((x) => x === recommendations[i][0])
            ].symbol
          }
        </td>
        <td
          className={`text-center ${
            recommendations[i][3] >= 0
              ? styles["green-light"]
              : styles["red-light"]
          }`}
        >
           {recommendations[i][3].toFixed(2)}%
        </td>
        <td
          className={`text-center ${
            recommendations[i][4] >= 0
              ? styles["green-light"]
              : styles["red-light"]
          }`}
        >
           {recommendations[i][4].toFixed(2)}%
        </td>
        <td
          className="text-center"
          style={{ display: !isMarketOpenNow ? "none" : "block" }}
        >
          {recentPrice ? "$" + recentPrice : "NA"}
        </td>
      </tr>,
    ];
  }

  while (count < Config.NUMBER_RESULTS_PER_PAGE) {
    ++count;
    innerHTML = [
      innerHTML,
      <tr key={count}>
        <td className={styles["table_td--dispensable"]}>
          {indexFirstTableElement + count}
        </td>
        <td className={styles["table_td--dispensable"]}></td>
        <td align="center"> - </td>
        <td align="center"> - </td>
        <td style={{ display: "none" }}> - </td>
        <td style={{ display: "none" }}> - </td>
        <td align="center"> - </td>
        <td style={{ display: !isMarketOpenNow ? "none" : "block" }}>-</td>
      </tr>,
    ];
  }

  innerHTML = [
    innerHTML,
    <tr key={count}>
      <td colSpan="7">
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

  useEffect(() => {
    if (!highlighted) {
      dispatch(
        panelsSlice.actions.highlight(
          recommendations[indexFirstTableElement][0]
        )
      );
    }
  }, [
    highlighted,
    highlightId,
    dispatch,
    recommendations,
    indexFirstTableElement,
  ]);

  return <tbody>{innerHTML}</tbody>;
}

export default RecommendationsLargerScreens;
