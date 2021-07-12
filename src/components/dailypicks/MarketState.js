import * as Helpers from "./../../helpers";
import styles from "./../Panels.module.css";

function MarketState(props) {
  const marketState = props.marketState;
  const minutesUntilMarketOpens = props.minutesUntilMarketOpens;
  const isMarketOpenNow = props.isMarketOpenNow;

  const todaysEpoch = Date.now();
  const todaysDay = Helpers.getDayOfWeekFromEpoch(todaysEpoch);
  const yesterdaysDay = Helpers.getDayOfWeekFromEpoch(todaysEpoch - 86400000);

  const labels = new Array(4);

  let innerHTML;

  if (
    marketState[marketState.length - 1].timestamp >
    todaysEpoch - 5 * 86400000
  ) {
    for (let i = marketState.length - 4; i < marketState.length; i++) {
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
    }

    for (let i = marketState.length - 4; i < marketState.length; i++) {
      let label;
      switch (marketState[i].state) {
        case 0:
          label = (
            <i
              key={i}
              className={`${styles["green-light"]} fas fa-arrow-circle-up`}
            ></i>
          );
          break;
        case 1:
          label = (
            <i
              key={i}
              className={`${styles["blue-light"]} fas fa-arrow-circle-right`}
            ></i>
          );
          break;
        case 2:
          label = (
            <i
              key={i}
              className={`${styles["red-light"]} fas fa-arrow-circle-down`}
            ></i>
          );
          break;
        default:
          break;
      }
      innerHTML = [
        innerHTML,
        " ",
        labels[i - marketState.length + 4],
        " ",
        label,
      ];
    }
  } else {
    innerHTML = "";
  }

  innerHTML = (
    <p key="1" style={{ textAlign: "center" }}>
      {" "}
      Markets Performance: {innerHTML}{" "}
    </p>
  );

  const days = Math.floor(minutesUntilMarketOpens / 60 / 24);
  const hours = Math.floor((minutesUntilMarketOpens - days * 24 * 60) / 60);
  const minutes = minutesUntilMarketOpens - days * 24 * 60 - hours * 60;

  if (isMarketOpenNow) {
    innerHTML = [
      innerHTML,
      <p key="2" style={{ textAlign: "center" }}>
        {" "}
        Markets are now open{" "}
      </p>,
    ];
  } else {
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
      innerHTML = [innerHTML, label];
    }
  }

  return innerHTML;
}

export default MarketState;
