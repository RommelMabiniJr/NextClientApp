const { ProgressBar } = require("primereact/progressbar");
const dayjs = require("dayjs");

const BookingProgress = ({ booking }) => {
  const calculateProgress = () => {
    const currentDate = dayjs();
    const startDate = dayjs(booking.jobposting.job_start_date);
    const endDate = dayjs(booking.jobposting.job_end_date);

    const totalDuration = endDate.diff(startDate, "days");
    const elapsedDuration = currentDate.diff(startDate, "days");
    const progress = (elapsedDuration / totalDuration) * 100;

    return Math.min(100, progress.toFixed(2)); // Round off progress to two decimals
  };

  const displayHeader = () => {
    const startDate = dayjs(booking.jobposting.job_start_date);
    const endDate = dayjs(booking.jobposting.job_end_date);
    const currentDate = dayjs();
    const duration = endDate.diff(startDate, "day");
    const daysUntilStart = startDate.diff(currentDate, "day");
    const daysElapsed = currentDate.diff(startDate, "day");
    const daysRemaining = duration - daysElapsed;

    const monthsRemaining = Math.floor(daysRemaining / 30);
    const weeksRemaining = Math.floor((daysRemaining % 30) / 7);
    const remainingDays = daysRemaining % 7;

    const daysElapsedString = daysElapsed === 1 ? "day" : "days";
    const monthsRemainingString = monthsRemaining === 1 ? "month" : "months";
    const weeksRemainingString = weeksRemaining === 1 ? "week" : "weeks";
    const remainingDaysString = remainingDays === 1 ? "day" : "days";

    let progressMessage = "";

    switch (booking.booking_info.booking_progress) {
      case "Pending":
        progressMessage = "Has not been accepted by worker";
        break;

      case "Confirmed":
        progressMessage = "Will start soon in " + daysUntilStart + " days";
        break;

      case "In Progress":
        progressMessage = `${daysElapsed}/${duration} ${daysElapsedString} (${monthsRemaining}{" "}
            ${monthsRemainingString}, ${weeksRemaining} ${weeksRemainingString},{" "}
        ${remainingDays} ${remainingDaysString} remaining)`;
        break;

      case "Completed":
        progressMessage = "Booking completed";
        break;

      case "Cancelled":
        progressMessage = "Booking cancelled";
        break;

      case "Declined":
        progressMessage = "Worker declined booking request";
        break;

      default:
        progressMessage = "Unknown booking progress";
        break;
    }

    return (
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base m-0">Booking Progress</h3>
        <p className="m-0">{progressMessage}</p>
      </div>
    );
  };

  return (
    <div>
      {displayHeader()}
      <ProgressBar style={{ height: "15px" }} value={calculateProgress()} />
    </div>
  );
};

export default BookingProgress;
