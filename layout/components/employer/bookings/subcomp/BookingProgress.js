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
    const daysElapsed = currentDate.diff(startDate, "day");
    const daysRemaining = duration - daysElapsed;

    const monthsRemaining = Math.floor(daysRemaining / 30);
    const weeksRemaining = Math.floor((daysRemaining % 30) / 7);
    const remainingDays = daysRemaining % 7;

    const daysElapsedString = daysElapsed === 1 ? "day" : "days";
    const monthsRemainingString = monthsRemaining === 1 ? "month" : "months";
    const weeksRemainingString = weeksRemaining === 1 ? "week" : "weeks";
    const remainingDaysString = remainingDays === 1 ? "day" : "days";

    return (
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base m-0">Booking Progress</h3>
        {calculateProgress() < 100 ? (
          <p className="m-0">
            {daysElapsed}/{duration} {daysElapsedString} ({monthsRemaining}{" "}
            {monthsRemainingString}, {weeksRemaining} {weeksRemainingString},{" "}
            {remainingDays} {remainingDaysString} remaining)
          </p>
        ) : (
          <p className="m-0">Booking completed!</p>
        )}
      </div>
    );
  };

  return (
    <div>
      {displayHeader()}
      <ProgressBar
        style={{ height: "18px" }}
        value={calculateProgress()}
        pt={{
          value: {
            className: "text-sm",
          },
        }}
      />
    </div>
  );
};

export default BookingProgress;
