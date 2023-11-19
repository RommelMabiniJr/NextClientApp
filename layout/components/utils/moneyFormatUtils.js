// formats in php money format with decimal places
export const formatSalary = (salary) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(salary);
};
