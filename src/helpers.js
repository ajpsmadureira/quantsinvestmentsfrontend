import * as Config from "./config.js";

/**
 * Sends a generic request to the server.
 * @param {string} url - URL of the request.
 * @param {string} method - Method of the request (POST or GET).
 * @param {string} addParams - Parameters that should be added to the request.
 * @param {string} csrfToken - CSRF token that should be added to the request.
 * @return {Object} Object returned from the server.
 * @throws Will throw an error if there are problems contacting the server.
 */
export async function callServer(url, method, addParams, csrfToken) {
  try {
    let params;

    if (method === "POST") {
      params = `_csrf=${csrfToken}`;
      if (addParams) params += addParams;
    }

    const res = await fetch(`${Config.BACKEND_SERVER_URL}${url}`, {
      credentials: "include",
      method: method,
      headers:
        method === "POST"
          ? {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          : undefined,
      body: method === "POST" ? params : undefined,
    });

    if (method === "POST") {
      if (res.status !== 200) throw new Error(Config.ERROR_CONTACTING_SERVER);
      else return;
    } else {
      const json = await res.json();

      return json;
    }
  } catch (err) {
    throw new Error(Config.ERROR_CONTACTING_SERVER);
  }
}

/**
 * Generic function to validate an email.
 * @param {String} mail - Email to be validated
 * @return {Boolean} True if email is ok. False otherwise.
 */
export function validateEmail(email) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  )
    return true;

  return false;
}

/**
 * Checks if a Date is in a working day.
 * @param {Date} date - date to be checked.
 * @return {boolean} True if date is a work day. False if date is in the weekend.
 */
export function isDateWeekDay(date) {
  return date.getUTCDay() !== 6 && date.getUTCDay() !== 0;
}

/**
 * Checks if an epoch is in a working day.
 * @param {number} epoch - epoch to be checked.
 * @return {boolean} True if date is a work day. False if date is in the weekend.
 */
export function isEpochWeekday(epoch) {
  return isDateWeekDay(new Date(epoch));
}

/**
 * Returns day of week of an epoch (e.g. "Tuesday").
 * @param {number} epoch - epoch to be checked.
 * @return {string} Day of week as string (e.g. "Tuesday")
 */
export function getDayOfWeekFromEpoch(epoch) {
  return getDayOfWeekFromDate(new Date(epoch));
}

/**
 * Returns day of week (e.g. "Tuesday") of a Date.
 * @param {Date} date - date to be checked.
 * @return {string} Day of week as string (e.g. "Tuesday")
 */
export function getDayOfWeekFromDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/**
 * Converts an epoch timestamp in miliseconds to a formatted UTC date string (MM/DD/YYYY).
 * @param {number} epoch - epoch to be converted.
 * @return {Date} Converted date string (MM/DD/YYYY).
 */
export function getDateStringFromEpoch(epoch) {
  return getDateStringFromDate(new Date(epoch));
}

/**
 * Converts a Date to a formatted UTC date string (MM/DD/YYYY).
 * @param {Date} date - epoch to be converted.
 * @return {Date} Converted date string (MM/DD/YYYY).
 */
export function getDateStringFromDate(date) {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return [month, day, year].join("/");
}

// converts a date string in format mm/dd/yyyy to Date
// returns null if error is detected

/**
 * Converts a date string in format MM/DD/YYYY to Date.
 * @param {Date} date - date to be converted.
 * @return {Date} Converted Date or null if an error occurs.
 */
export function getDateFromDateString(date) {
  try {
    const parts = date.split("/").map((p) => parseInt(p, 10));

    parts[0] -= 1;

    if (parts[0] < 0 || parts[0] >= 12 || parts[1] < 1 || parts[1] > 31)
      return null;

    const processedDate = new Date(
      Date.UTC(parts[2], parts[0], parts[1], Config.HOUR_CLOSING)
    );

    if (
      processedDate.getUTCMonth() === parts[0] &&
      processedDate.getUTCDate() === parts[1] &&
      processedDate.getUTCFullYear() === parts[2]
    )
      return processedDate;
  } catch (err) {
    console.log(err);
    return null;
  }

  return null;
}

/**
 * Converts a date string in format MM/DD/YYYY to epoch in miliseconds.
 * @param {Date} date - date to be converted.
 * @return {Date} Epoch or null if an error occurs.
 */
export function getEpochFromDateString(date) {
  return getDateFromDateString(date)?.getTime();
}

/**
 * Sorts the investments. First the open investments by buying date (from newer to older). Second the closed investments by buying date (from newer to older).
 * @param {Array} investments array to be sorted.
 * @returns {Array} array with the sorted investments.
 */
export function getSortedInvestments(investments) {
  const sortedOpenInvestments = investments
    .filter((e) => e.state !== 4)
    .sort((a, b) => b.buying_timestamp - a.buying_timestamp);

  const sortedClosedInvestments = investments
    .filter((e) => e.state === 4)
    .sort((a, b) => b.buying_timestamp - a.buying_timestamp);

  let sortedInvestments = [
    ...sortedOpenInvestments,
    ...sortedClosedInvestments,
  ];

  return sortedInvestments;
}

/**
 * Controller for getting a literal description of the recommendation for an investment.
 * @param {string} state numeric code indicating the recommendation for an investment.
 */
export function getRecommendation(state) {
  switch (state) {
    case 0:
    case 1:
      return "Hold";
    case 2:
      return "Sell";
    case 3:
      return "Closed";
    default:
      break;
  }
}
