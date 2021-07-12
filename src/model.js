import * as Helpers from "./helpers.js";
import * as Config from "./config";

/**
 * Gets session data from server
 * @return {Object} Object returned from the server.
 * @throws Will throw an error if there are problems contacting the server.
 */
export async function getSessionData() {
  return await Helpers.callServer("/rest/hello", "GET", null, null);
}

/**
 * Logs in the user
 * @param {string} username - Login username. It can be empty.
 * @param {string} password - Login password. It can be empty.
 * @param {string} csrfToken - csrfToken to be passed to the server.
 * @return {boolean} True (if login ok) or false (if login failed)
 */
export async function login(username, password, csrfToken) {
  const params = `&username=${username}&password=${password}`;
  await Helpers.callServer("/rest/login", "POST", params, csrfToken);
}

/**
 * Logs out the user
 * @param {string} csrfToken - csrfToken to be passed to the server.
 */
export async function logout(csrfToken) {
  await Helpers.callServer("/rest/logout", "POST", undefined, csrfToken);
}

/**
 * Logs in the user
 * @param {string} email - Email to be registered. It can be empty.
 * @param {string} csrfToken - csrfToken to be passed to the server.
 */
export async function registerEmail(email, csrfToken) {
  if (!Helpers.validateEmail(email)) throw new Error("Email not valid");

  const params = `&email=${email}`;

  await Helpers.callServer("/rest/registeremail", "POST", params, csrfToken);
}

/**
 * Gets data about performance of the solution
 * @returns {Array} array with data about performance of solution and benchmark data.
 */
export async function getPerformanceAndBenchmarks() {
  try {
    const performanceAndBenchmarks = await Helpers.callServer(
      "/rest/getperformance",
      "GET",
      undefined
    );

    const performance = performanceAndBenchmarks.performance;

    const sp500 = performanceAndBenchmarks.sp500.map((e) => {
      return {
        x: e.x,
        y:
          Config.PERFORMANCE_BOOK_VALUE *
          (e.y / performanceAndBenchmarks.sp500[0].y - 1),
      };
    });

    const dji = performanceAndBenchmarks.dji.map((e) => {
      return {
        x: e.x,
        y:
          Config.PERFORMANCE_BOOK_VALUE *
          (e.y / performanceAndBenchmarks.dji[0].y - 1),
      };
    });

    return [performance, sp500, dji];
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets the symbols synchronously from the server, and updates the application state accordingly.
 * @returns {Array} Array with symbols, earliest date of tickers, latest date of tickers
 */
export async function refreshRealTimeInformation() {
  try {
    const realtimeInformation = await Helpers.callServer(
      "/rest/getrealtimeinformation",
      "GET",
      undefined
    );

    const isMarketOpenNow = realtimeInformation.isMarketOpenNow;

    const minutesUntilMarketOpens = realtimeInformation.minutesUntilMarketOpens;

    const recommendedStocksRecentTickerPrices =
      realtimeInformation.userRecommendedInstrumentsRecentTickerPrices;

    return [
      isMarketOpenNow,
      minutesUntilMarketOpens,
      recommendedStocksRecentTickerPrices,
    ];
  } catch (err) {
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets market state (status) data from the server.
 * @returns {Array} array with market state (status) data.
 */
export async function getMarketState() {
  try {
    return await Helpers.callServer("/rest/getmarketstate", "GET", undefined);
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets recommendations data from the server, and updates application state accordingly.
 * @returns {Array} array with recommendations data.
 */
export async function getRecommendations() {
  let jsonData;

  try {
    jsonData = await Helpers.callServer(
      "/rest/getrecommendations",
      "GET",
      undefined
    );
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }

  const recommendations = [];

  if (jsonData.length > 0) {
    jsonData.forEach((e) =>
      recommendations.push([
        e.instrumentId,
        e.occurrences,
        e.correlation,
        e.lastWeek,
        e.lastMonth,
        e.logo,
      ])
    );
  }

  return recommendations;
}

/**
 * Gets the instruments synchronously from the server
 * @returns {Array} Array with instruments, earliest date of tickers, latest date of tickers
 */
export async function getInstruments() {
  try {
    const instruments = await Helpers.callServer("/rest/getinstruments", "GET");

    const dates = await Helpers.callServer(
      "/rest/getticker/" + instruments[0].id,
      "GET"
    );

    const startDate = new Date(dates[0].x);

    const endDate = new Date(dates[dates.length - 1].x);

    return [instruments, startDate, endDate];
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets ticker from the server.
 * @param {string} id id of the ticker to be retrieved.
 * @returns {Array} array with ticker data.
 */
export async function getTicker(id) {
  try {
    return await Helpers.callServer("/rest/getticker/" + id, "GET");
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets news about an instrument.
 * @param {param} id id of the instrument to be retrieved.
 * @returns {Object} array with news data.
 */
export async function getNews(id) {
  try {
    return await Helpers.callServer("/rest/getinstrumentnews/" + id, "GET");
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Gets investments data from the server, and updates application state accordingly.
 * @returns {Array} array with investments data.
 */
export async function getInvestments() {
  try {
    return await Helpers.callServer("/rest/getinvestments", "GET");
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Get the global investments graph.
 * @param {Array} investments array with investments to be used to render the graph.
 * @returns {Object} object with the graph data.
 */
export function getGlobalInvestmentsGraph(investments) {
  const data = [];

  // create vector of timestamps

  let minimumTimestamp = investments
    .flatMap((e) => e.ticker)
    .reduce(
      (agg, ele) => (ele.x < agg ? ele.x : agg),
      Helpers.getEpochFromDateString(Helpers.getDateStringFromDate(new Date()))
    );

  const maximumTimestamp = investments
    .flatMap((e) => e.ticker)
    .reduce(
      (agg, ele) => (ele.x > agg ? ele.x : agg),
      Helpers.getEpochFromDateString("01/01/2018")
    );

  let timestamps = Array(
    (maximumTimestamp - minimumTimestamp) / (24 * 3600 * 1000) + 1
  )
    .fill()
    .map((_, idx) => minimumTimestamp + idx * (24 * 3600 * 1000))
    .filter((e) => Helpers.isEpochWeekday(e));

  // calculate total balance taking into account all investments and their state

  const balances = new Array(timestamps.length).fill(0);

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

  // prepare dataset and chart

  let dataPoints = [];

  for (let i = 0; i < timestamps.length; i++) {
    dataPoints.push({
      x: timestamps[i],
      y: balances[i],
    });
  }

  data.push({
    type: "line",
    dataPoints: dataPoints,
    color: "#1d8cf8",
    xValueType: "dateTime",
  });

  // plot buys and sells

  const buys = new Array(timestamps.length).fill(null);

  const sells = new Array(timestamps.length).fill(null);

  timestamps.forEach(function (timestamp, idx) {
    investments.forEach((investment) => {
      if (investment.buying_timestamp === timestamp) buys[idx] = balances[idx];
      if (investment.state === 4 && investment.selling_timestamp === timestamp)
        sells[idx] = balances[idx];
    });
  });

  dataPoints = [];

  timestamps.forEach((timestamp, idx) => {
    if (sells[idx] === null)
      dataPoints.push({
        x: timestamp,
        y: buys[idx],
      });
  });

  data.push({
    type: "scatter",
    dataPoints: dataPoints,
    color: "rgb(119, 236, 117)",
    xValueType: "dateTime",
    showInLegend: true,
    legendText: "buys",
  });

  dataPoints = [];

  timestamps.forEach((timestamp, idx) => {
    if (buys[idx] === null)
      dataPoints.push({
        x: timestamp,
        y: sells[idx],
      });
  });

  data.push({
    type: "scatter",
    dataPoints: dataPoints,
    color: "rgb(253, 89, 98)",
    xValueType: "dateTime",
    showInLegend: true,
    legendText: "sells",
  });

  dataPoints = [];

  timestamps.forEach((timestamp, idx) => {
    if (buys[idx] !== null && sells[idx] !== null)
      dataPoints.push({
        x: timestamp,
        y: buys[idx],
      });
  });

  data.push({
    type: "scatter",
    dataPoints: dataPoints,
    color: "white",
    xValueType: "dateTime",
    showInLegend: true,
    legendText: "buys and sells",
  });

  return data;
}

/**
 * Deletes an investment in the server.
 * @param {string} id id of the investment.
 */
export async function deleteInvestment(id, csrfToken) {
  const params = `&id=${id}`;

  try {
    await Helpers.callServer(
      "/rest/deleteinvestment",
      "POST",
      params,
      csrfToken
    );
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Validating input for symbol when registering a new investment.
 * @param {string} symbol input (symbol) to be validated.
 * @param {string} exchange input (exchange) to be validated.
 * @returns {string|boolean} false if validation fails. Otherwise returns processed symbol value (i.e. in uppercase).
 */
export function validateSymbol(instruments, symbol, exchange) {
  if (symbol === "") return false;

  const processedValue = symbol.toUpperCase();

  if (exchange !== "NASDAQ" && exchange !== "NYSE") return false;

  if (
    instruments.map((x) => x.symbol).findIndex((x) => x === processedValue) ===
    -1
  )
    return false;

  return processedValue;
}

/**
 * Validating numeric input. To be used when validating a price, a cost, of number of shares inputs from the end user.
 * @param {string} input input (numeric) to be validated.
 * @param {boolean} includeZero true if input field allows the value 0, and false otherwise.
 * @param {number} nDecimals number of decimals digits desired in the processed return value.
 * @returns {number|boolean} false if validation fails. Otherwise it returns the processed numeric input.
 */
export function validateNumericInput(input, includeZero, nDecimals) {
  if (input === "" || isNaN(input)) return false;

  const processedValue = (+input).toFixed(nDecimals).toString();

  if (!includeZero ? +processedValue <= 0 : +processedValue < 0) return false;

  return processedValue;
}

/**
 * Validating input for number of shares when registering a new investment.
 * Number of shares equal to 0 is not allowed.
 * @param {string} input input (number of shares) to be validated.
 * @returns {number|boolean} false if validation fails. Otherwise returns processed number of shares value with 0 decimal digits.
 */
export function validateNumberSharesInput(input) {
  return validateNumericInput(input, false, 0);
}

/**
 * Validating input for costs when registering a new or selling an investment.
 * Costs equal to 0 is allowed.
 * @param {string} input input (costs) to be validated.
 * @returns {number|boolean} false if validation fails. Otherwise returns processed costs value with 3 decimal digits.
 */
export function validateCostInput(input) {
  return validateNumericInput(input, true, 3);
}

/**
 * Validating input for price when registering a new or selling an investment.
 * Price equal to 0 not is allowed.
 * @param {string} input input (costs) to be validated.
 * @returns {number|boolean} false if validation fails. Otherwise returns processed price value with 3 decimal digits.
 */
export function validatePriceInput(input) {
  return validateNumericInput(input, false, 3);
}

/**
 * Validates date to be used when buying or selling an investment.
 * @param {String} date date input field to be validated.
 * @param {string} investmentId investment id, which is required for validating the input in case Model needs to fetch the buy date (in case isSell is true)
 * @param {boolean} isSell true in case validation is of a selling date (instead of buying date). If true, the selling date is also validated against the buying date.
 * @returns {number} result of the validation: 0 is ok, 1 is nok (date cannot be interpreted), 2 is nok (date is not within the allowed limits as data is not available for the date), 3 is nok (date is in a weekend), and 4 is nok (selling date before buying date)
 */
export function validateDateInput(
  investments,
  startDate,
  endDate,
  date,
  investmentId,
  isSell
) {
  const processedDate = Helpers.getDateFromDateString(date);

  if (processedDate === null) return 1;

  if (processedDate < startDate || processedDate > endDate) return 2;

  if (!Helpers.isEpochWeekday(processedDate)) return 3;

  if (isSell) {
    const buyDate = new Date(
      investments.find((e) => e.id === +investmentId).buying_timestamp
    );
    if (processedDate < buyDate) return 4;
  }

  return 0;
}

/**
 * Saves an investment in the server. Data has to be validated prior. Application state is not updated.
 * @param {string} symbol symbol of the new investment.
 * @param {string} exchange exchange of the new investment.
 * @param {string} number number of shares of the new investment.
 * @param {string} date buying date of the new investment.
 * @param {string} price buying price of the new investment.
 * @param {string} costs buying costs of the new investment.
 */
export async function saveInvestment(
  instruments,
  symbol,
  exchange,
  date,
  number,
  price,
  costs,
  csrfToken
) {
  const instrument = instruments.find(
    (x) => x.symbol === symbol && x.exchange === exchange
  );

  if (instrument === undefined) throw new Error(Config.ERROR_UNEXPECTED_ERROR);

  const params = `&id=${
    instrument.id
  }&buying_timestamp=${Helpers.getEpochFromDateString(
    date
  )}&buying_price=${price}&buying_number=${number}&buying_costs=${costs}`;

  try {
    await Helpers.callServer("/rest/saveinvestment", "POST", params, csrfToken);
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Registers the selling of an investment in the server. Data has to be validated prior. Application state is not updated.
 * @param {string} id id of the investment sold.
 * @param {string} sellDate selling date of the investment.
 * @param {string} sellPrice selling price of the investment.
 * @param {string} sellCosts selling costs of the investment.
 * @param {View} view view that calls this controller as handler.
 */
export async function sellInvestment(
  id,
  sellDate,
  sellPrice,
  sellCosts,
  csrfToken
) {
  const params = `&id=${id}&selling_timestamp=${Helpers.getEpochFromDateString(
    sellDate
  )}&selling_price=${sellPrice}&selling_costs=${sellCosts}`;

  try {
    await Helpers.callServer(
      "/rest/closeinvestment",
      "POST",
      params,
      csrfToken
    );
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Gets operational metrics from the server.
 * @returns {Array} array with metrics
 */
export async function getMetrics() {
  let jsonData;

  try {
    jsonData = await Helpers.callServer("/rest/getmetrics", "GET");
  } catch (err) {
    console.error(err);
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }

  // {"start":1611194400000,"end":1611194400089,"type":1}
  // {"type":4,"endTimestamp":1621265097448,"value":-1,"startTimestamp":1621264951527}

  const metrics = {};

  const datapointsRecommendedSymbols = jsonData
    .filter((e) => e.type === Config.SCHEDULER_PROCESS_RECOMMENDED_SYMBOLS)
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.endTimestamp - e.startTimestamp,
    }));

  metrics["datapointsRecommendedSymbols"] = datapointsRecommendedSymbols;

  const datapointsStateInvestments = jsonData
    .filter((e) => e.type === Config.SCHEDULER_PROCESS_STATE_INVESTMENTS)
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.endTimestamp - e.startTimestamp,
    }));

  metrics["datapointsStateInvestments"] = datapointsStateInvestments;

  const datapointsListTraders = jsonData
    .filter((e) => e.type === Config.SCHEDULER_PROCESS_LIST_TRADERS)
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.endTimestamp - e.startTimestamp,
    }));

  metrics["datapointsListTraders"] = datapointsListTraders;

  const datapointsStockNews = jsonData
    .filter((e) => e.type === Config.SCHEDULER_PROCESS_STOCK_NEWS)
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.endTimestamp - e.startTimestamp,
    }));

  metrics["datapointsStockNews"] = datapointsStockNews;

  const datapointsNumberDataIsFaulty = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_DATA_IS_FAULTY
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberDataIsFaulty"] = datapointsNumberDataIsFaulty;

  const datapointsNumberStockNoData = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_NO_DATA
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberStockNoData"] = datapointsNumberStockNoData;

  const datapointsNumberStockConversionForex = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_CONVERSION_FOREX
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberStockConversionForex"] =
    datapointsNumberStockConversionForex;

  const datapointsNumberStockIsDiscontinuous = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_IS_DISCONTINUOUS
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberStockIsDiscontinuous"] =
    datapointsNumberStockIsDiscontinuous;

  const datapointsNumberStockIsPartiallyLinear = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_IS_PARTIALLY_LINEAR
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberStockIsPartiallyLinear"] =
    datapointsNumberStockIsPartiallyLinear;

  const datapointsNumberErrors = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_NUMBER_ERRORS
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberErrors"] = datapointsNumberErrors;

  const datapointsNumberStockDataIsStillFresh = jsonData
    .filter(
      (e) =>
        e.type ===
        Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_ERROR_DATA_IS_STILL_FRESH
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberStockDataIsStillFresh"] =
    datapointsNumberStockDataIsStillFresh;

  let datapointsNumberOk = jsonData
    .filter(
      (e) => e.type === Config.SCHEDULER_PROCESS_REFRESH_DATA_METRIC_TYPE_OK
    )
    .map((e) => ({
      x: new Date(e.startTimestamp),
      y: e.value,
    }));

  metrics["datapointsNumberOk"] = datapointsNumberOk;

  const maximum = datapointsNumberOk
    .map(
      (e, idx) =>
        e.y +
        datapointsNumberStockDataIsStillFresh[idx].y +
        datapointsNumberErrors[idx].y +
        datapointsNumberStockIsPartiallyLinear[idx].y +
        datapointsNumberStockIsDiscontinuous[idx].y +
        datapointsNumberStockConversionForex[idx].y +
        datapointsNumberStockNoData[idx].y +
        datapointsNumberDataIsFaulty[idx].y
    )
    .reduce((agg, ele) => (ele > agg ? ele : agg), 0);

  metrics["maximum"] = maximum;

  return metrics;
}
