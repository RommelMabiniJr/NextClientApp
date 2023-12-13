import { Tag } from "primereact/tag";

const BookingStatus = ({ status }) => {
  const getSeverity = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    console.log(lowerCaseStatus);
    if (lowerCaseStatus === "confirmed") {
      return "success";
    } else if (lowerCaseStatus === "in progress") {
      return "info";
    } else if (lowerCaseStatus === "completed") {
      return "primary";
    } else if (lowerCaseStatus === "pending") {
      return "warning";
    } else if (
      lowerCaseStatus === "cancelled" ||
      lowerCaseStatus === "expired" ||
      lowerCaseStatus === "declined"
    ) {
      return "danger";
    }
  };

  return <Tag value={status} severity={getSeverity(status)}></Tag>;
};
export default BookingStatus;
