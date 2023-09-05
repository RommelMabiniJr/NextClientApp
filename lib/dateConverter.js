const DateConverter = () => {
  const convertDateToReadable = (isoDate) => {
    let newDate = new Date(isoDate);
    return newDate.toLocaleDateString();
  };

  const toNumbers = (isoDate) => {
    let newDate = new Date(isoDate);
    return newDate.toLocaleDateString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const convertDateToReadableDetailed = (isoDate) => {
    let newDate = new Date(isoDate);
    return newDate.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const convertDateToMySQL = (isoDate) => {
    return new Date(isoDate).toISOString().slice(0, 10);
  };

  const convertTimeToReadable = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
      timeStyle: "short",
    });
  };

  return {
    toNumbers,
    convertDateToReadable,
    convertTimeToReadable,
    convertDateToReadableDetailed,
    convertDateToMySQL,
  };
};

export default DateConverter;
