import styles from "./Panels.module.css";
import { useMediaPredicate } from "react-media-hook";
import { useEffect } from "react";
import Chart from "./Chart";
import News from "./News";
import { useSelector, useDispatch } from "react-redux";
import * as Model from "./../model";
import panelsSlice from "./../store/panels-slice";
import appSlice from "./../store/app-slice";
import RecommendationsLargerScreens from "./dailypicks/RecommendationsLargerScreens";
import RecommendationsSmallerScreens from "./dailypicks/RecommendationsSmallerScreens";
import InvestmentsLargerScreens from "./investments/InvestmentsLargerScreens";
import InvestmentsSmallerScreens from "./investments/InvestmentsSmallerScreens";
import MarketState from "./dailypicks/MarketState";

let chart;

let ticker;

let symbol;

let news;

const setChartReference = (ref) => {
  chart = ref;
};

function Panels(props) {
  const biggerThan767 = useMediaPredicate("(min-width: 767px)");

  const id = useSelector((state) => state.panels.highlightId);

  const graphDataAvailable = useSelector(
    (state) => state.panels.graphDataAvailable
  );

  const investmentsRetrieved = useSelector(
    (state) => state.app.investmentsRetrieved
  );

  const newsAvailable = useSelector((state) => state.panels.newsAvailable);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      (id === undefined && props.page === "dailypicks") ||
      (props.appData.investments === undefined &&
        props.page === "investments") ||
      (props.appData.investments?.length === 0 && props.page === "investments")
    )
      return;

    async function getGraphData() {
      try {
        if (props.page === "dailypicks") {
          ticker = await Model.getTicker(id);

          ticker = [
            {
              type: "line",
              dataPoints: ticker,
              color: "#1d8cf8",
              xValueType: "dateTime",
            },
          ];

          symbol =
            props.appData.instruments[
              props.appData.instruments
                .map((x) => x.id)
                .findIndex((x) => x === Number.parseInt(id))
            ].name;
          dispatch(panelsSlice.actions.setGraphDataAvailable());
        }
        if (props.page === "investments") {
          if (id !== undefined && investmentsRetrieved) {
            const investment = props.appData.investments.find(
              (e) => e.id === +id
            );

            ticker = [];

            for (let i = 0; i < investment.timestamps.length; i++) {
              ticker.push({
                x: investment.timestamps[i],
                y: investment.closes[i],
              });
            }

            ticker = [
              {
                type: "line",
                dataPoints: ticker,
                color: "#1d8cf8",
                xValueType: "dateTime",
              },
            ];
            symbol =
              props.appData.instruments[
                props.appData.instruments
                  .map((x) => x.id)
                  .findIndex(
                    (x) => x === Number.parseInt(investment.instrumentId)
                  )
              ].name;
            dispatch(panelsSlice.actions.setGraphDataAvailable());
          } else {
            if (!investmentsRetrieved) return;
            ticker = Model.getGlobalInvestmentsGraph(props.appData.investments);
            symbol = "";
            dispatch(panelsSlice.actions.setGraphDataAvailable());
          }
        }
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getGraphData();
  }, [
    dispatch,
    id,
    props.appData.instruments,
    props.page,
    props.appData.investments,
    investmentsRetrieved,
  ]);

  useEffect(() => {
    if (id === undefined) return;

    if (newsAvailable) return;

    async function getNews() {
      if (props.page === "investments" && id === undefined) return;
      try {
        if (props.page === "dailypicks") news = await Model.getNews(id);
        if (props.page === "investments") {
          const investment = props.appData.investments.find(
            (e) => e.id === +id
          );
          news = await Model.getNews(investment.instrumentId);
        }
        dispatch(panelsSlice.actions.setNewsAvailable());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getNews();
  }, [dispatch, id, newsAvailable, props.appData.investments, props.page]);

  useEffect(() => {
    if (graphDataAvailable === false) return;

    chart.options.data = ticker;

    chart.render();

    chart.title.set("text", symbol);
  }, [graphDataAvailable]);

  let panel1, panel2;

  if (props.page === "dailypicks") {
    panel1 = biggerThan767 ? (
      <RecommendationsLargerScreens appData={props.appData} />
    ) : (
      <RecommendationsSmallerScreens appData={props.appData} />
    );
    panel2 = biggerThan767 ? (
      <MarketState
        isMarketOpenNow={props.appData.realtimeData[0]}
        marketState={props.appData.marketState}
        minutesUntilMarketOpens={props.appData.realtimeData[1]}
      />
    ) : (
      []
    );
  }

  if (props.page === "investments") {
    if (!props.appData.investments) return;
    panel1 = biggerThan767 ? (
      <InvestmentsLargerScreens appData={props.appData} />
    ) : (
      <InvestmentsSmallerScreens appData={props.appData} />
    );
    panel2 = [];
  }

  return (
    <table className={styles.table_panels}>
      <tbody>
        <tr className={styles.tr_panels}>
          {/* <!-- Content inside panel 1 must be able to scale down --> */}
          <td className={styles.td_panel1}>
            <table className={styles.table_panel1}>{panel1}</table>
          </td>
          <td className={styles.td_panels23}>
            <table className={styles.table_panels23}>
              <tbody>
                <tr key="1">
                  <td className={styles.td_panel2}>{panel2}</td>
                </tr>
                <tr key="2">
                  <td className={styles.td_panel3}>
                    {" "}
                    <div className={styles.chartContainer}>
                      <Chart setChartReference={setChartReference} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          {!(props.page === "investments" && id === undefined) && (
            <td className={styles.td_panel4}>
              <div className={styles.div_news}>
                {biggerThan767 ? <News news={news} /> : []}
              </div>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
}

export default Panels;
