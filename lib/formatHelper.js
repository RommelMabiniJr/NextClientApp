const FormatHelper = () => {
  const convertArrayToString = (array, itemName = "name") => {
    const stringArray = array.map((item) => item[itemName]);
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
