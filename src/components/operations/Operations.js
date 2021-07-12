import Chart from "../Chart";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, Fragment } from "react";
import * as Model from "../../model";
import appSlice from "../../store/app-slice";
import operationsSlice from "../../store/operations-slice";

let schedulerProcessesChart = undefined;

let refreshDataChart = undefined;

let metrics = undefined;

const setSchedulerProcessesChartReference = (ref) => {
  schedulerProcessesChart = ref;
};

const setRefreshDataChartReference = (ref) => {
  refreshDataChart = ref;
};

function Operations() {
  const graphDataAvailable = useSelector(
    (state) => state.operations.graphDataAvailable
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function getGraphData() {
      try {
        console.log("getting graph data");
        metrics = await Model.getMetrics();
        dispatch(operationsSlice.actions.setGraphDataAvailable());
      } catch (err) {
        console.log(err);
        dispatch(appSlice.actions.setDataRetrievingFailed());
        return;
      }
    }
    getGraphData();
  }, [dispatch]);

  useEffect(() => {
    if (!graphDataAvailable) return;

    console.log("rendering graph");

    schedulerProcessesChart.options.axisY.title = "Miliseconds";

    schedulerProcessesChart.options.axisY.logarithmic = true;

    schedulerProcessesChart.options.axisY.valueFormatString = "#0";

    schedulerProcessesChart.options.data = [];

    schedulerProcessesChart.options.data.push({
      type: "column",
      showInLegend: true,
      name: "Recommended Symbols",
      color: "gold",
      yValueFormatString: "#",
      xValueType: "dateTime",
      dataPoints: metrics.datapointsRecommendedSymbols,
    });

    schedulerProcessesChart.options.data.push({
      type: "column",
      showInLegend: true,
      name: "State Investments",
      color: "#1d8cf8",
      yValueFormatString: "#",
      xValueType: "dateTime",
      dataPoints: metrics.datapointsStateInvestments,
    });

    schedulerProcessesChart.options.data.push({
      type: "column",
      showInLegend: true,
      name: "Update Traders",
      color: "rgb(119, 236, 117)",
      yValueFormatString: "#",
      xValueType: "dateTime",
      dataPoints: metrics.datapointsListTraders,
    });

    schedulerProcessesChart.options.data.push({
      type: "column",
      showInLegend: true,
      name: "Update Stock News",
      color: "rgb(253, 89, 98)",
      yValueFormatString: "#",
      xValueType: "dateTime",
      dataPoints: metrics.datapointsStockNews,
    });

    schedulerProcessesChart.render();

    refreshDataChart.options.axisY.title = "Number of Stocks";

    refreshDataChart.options.axisY.valueFormatString = "#0";

    Array.of(
      {
        data: metrics.datapointsNumberDataIsFaulty,
        label: "numberDataIsFaulty",
      },
      { data: metrics.datapointsNumberStockNoData, label: "numberStockNoData" },
      {
        data: metrics.datapointsNumberStockConversionForex,
        label: "numberStockConversionForex",
      },
      {
        data: metrics.datapointsNumberStockIsDiscontinuous,
        label: "numberStockIsDiscontinuous",
      },
      {
        data: metrics.datapointsNumberStockIsPartiallyLinear,
        label: "numberStockIsPartiallyLinear",
      },
      { data: metrics.datapointsNumberErrors, label: "numberErrors" },
      {
        data: metrics.datapointsNumberStockDataIsStillFresh,
        label: "numberStockDataIsStillFresh",
      },
      { data: metrics.datapointsNumberOk, label: "numberOk" },
      { data: metrics.datapointsNumberNok, label: "numberNok" }
    ).forEach((e) => {
      refreshDataChart.options.data.push({
        type: "stackedColumn",
        showInLegend: true,
        name: e.label,
        xValueFormatString: "UTC: hh:mm DD/MM",
        yValueFormatString: "#",
        xValueType: "dateTime",
        dataPoints: e.data,
      });
    });

    refreshDataChart.render();
  }, [graphDataAvailable]);

  let innerHTML = (
    <Fragment>
      <div
        className="p-4 box"
        style={{ backgroundColor: "#344675", color: "white" }}
      >
        <h3 className="px-3">Scheduler Processes</h3>
        <button className="btn py-0 btn-outline-primary px-2" type="button">
          Clear
        </button>
        <div align="center">
          <div className="p-3 w-80">
            <div>
              <Chart setChartReference={setSchedulerProcessesChartReference} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="p-4 box"
        style={{ backgroundColor: "#344675", color: "white" }}
      >
        <h3 className="px-3">Refresh Data</h3>
        <button className="btn py-0 btn-outline-primary px-2" type="button">
          Clear
        </button>
        <div align="center">
          <div className="p-3 w-80">
            <div>
              <Chart setChartReference={setRefreshDataChartReference} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

  return innerHTML;
}

export default Operations;
