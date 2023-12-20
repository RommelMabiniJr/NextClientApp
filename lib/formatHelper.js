const FormatHelper = () => {
  const convertArrayToString = (arrayObj, itemName = "name") => {
    const stringArray = Array.isArray(arrayObj)
      ? arrayObj.map((item) => item[itemName])
      : [];

    return stringArray.join(", ");
  };

  const stringToArray = (string, separator = ",") => {
    return string.split(separator);
  };

  return {
    convertArrayToString,
    stringToArray,
  };
};

export default FormatHelper;
