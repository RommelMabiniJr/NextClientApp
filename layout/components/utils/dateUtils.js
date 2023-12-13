import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Returns the relative time from the given date to the current time.
 * @param {Date} date - The date to calculate the relative time from.
 * @returns {string} The formatted relative time.
 */
export const getRelativeTimeFromNow = (date) => {
  const formattedTimestamp = dayjs(date).fromNow();
  return formattedTimestamp;
};

export const displaySimpleDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

// convert a string from the database to a date object
export const convertStringToDate = (date) => {
  return new Date(date);
};

// function to convert this date to mysql format using dayjs
// example 2023-12-24T16:00:00.000Z to 2023-12-24 16:00:00
export const convertDateToMySQLFormat = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

export const displayDatesAsRange = (d1, d2) => {
  const date1 = dayjs(d1).format("MMM D, YYYY");
  const date2 = dayjs(d2).format("MMM D, YYYY");

  return `${date1} - ${date2}`;
};

export const displayTimeAsRange = (t1, t2) => {
  const date = new Date(); // Create a new date object
  const time1 = new Date(date.toDateString() + " " + t1); // Convert t1 to a valid date object
  const time2 = new Date(date.toDateString() + " " + t2); // Convert t2 to a valid date object

  const formattedTime1 = dayjs(time1).format("h:mm A");
  const formattedTime2 = dayjs(time2).format("h:mm A");

  return `${formattedTime1} - ${formattedTime2}`;
};
