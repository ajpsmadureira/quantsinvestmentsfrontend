import CanvasJSReact from "../libraries/canvasjs.react";
import { memo } from "react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Chart(props) {
  const options = {
    animationEnabled: true,
    backgroundColor: "#344675", // needs to be aligned with CSS
    zoomEnabled: true,
    title: {
      fontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      fontSize: 10,
      padding: 5,
      fontColor: "#f3f3f3",
    },
    legend: {
      fontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      fontSize: 10,
      fontColor: "#f3f3f3",
      verticalAlign: "top",
    },
    axisX: {
      margin: 20,
      gridColor: "#5e72e4",
      gridThickness: 0.2,
      tickColor: "#5e72e4",
      tickThickness: 0.2,
      lineColor: "#5e72e4",
      lineThickness: 0.2,
      titleFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      titleFontSize: 10,
      titleFontColor: "#f3f3f3",
      labelFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      labelFontSize: 10,
      labelFontColor: "#f3f3f3",
      valueFormatString: "UTC:MM-DD-YYYY",
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
        valueFormatString: "UTC:MM-DD-YYYY",
        labelFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
        labelFontSize: 10,
        labelBackgroundColor: "#344675",
        thickness: 1,
        color: "#5e72e4",
      },
    },
    toolTip: {
      enabled: false,
    },
    axisY: {
      margin: 20,
      gridColor: "#5e72e4",
      gridThickness: 0.2,
      tickColor: "#5e72e4",
      tickThickness: 0.2,
      lineColor: "#5e72e4",
      lineThickness: 0.2,
      titleFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      titleFontSize: 10,
      titleFontColor: "#f3f3f3",
      labelFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
      labelFontSize: 10,
      labelFontColor: "#f3f3f3",
      includeZero: false,
      valueFormatString: "$#0",
      crosshair: {
        enabled: true,
        valueFormatString: "$#",
        labelFontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
        labelFontSize: 10,
        labelBackgroundColor: "#344675",
        thickness: 1,
        color: "#5e72e4",
      },
    },
    data: [],
    subtitles: [
      {
        fontFamily: "'Poppins', sans-serif", // needs to be aligned with CSS
        fontSize: 14,
        padding: 5,
        fontColor: "#f3f3f3",
      },
    ],
  };

  return <CanvasJSChart options={options} onRef={props.setChartReference} />;
}

export default memo(Chart);
