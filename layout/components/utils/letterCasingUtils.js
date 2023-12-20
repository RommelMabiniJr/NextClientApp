// function to convert a string to capitalize the first letter of each word
export const capitalizeFirstLetter = (string) => {
  if (typeof string !== "string" || string.length === 0) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// function to convert  a string to capitalize the first letter of each word
export const capitalizeEveryWord = (string) => {
  if (typeof string !== "string" || string.length === 0) {
    return "";
  }

  return string.replace(/\b\w/g, (l) => l.toUpperCase());
};
