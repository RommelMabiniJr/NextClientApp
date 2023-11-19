// function to convert a string to capitalize the first letter of each word
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// function to convert  a string to capitalize the first letter of each word
export const capitalizeEveryWord = (string) => {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
};
