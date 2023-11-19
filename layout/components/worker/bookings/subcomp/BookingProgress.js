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

    return Math.min(100, progress); // Ensure progress does not exceed 100%
  };

  const displayHeader = () => {
    const startDate = dayjs(booking.jobposting.job_start_date);
    const endDate = dayjs(booking.jobposting.job_end_date);
    const currentDate = dayjs();
    const duration = endDate.diff(startDate, "day");
    const daysElapsed = currentDate.diff(startDate, "day");
    const daysRemaining = duration - daysElapsed;
    const daysElapsedString = daysElapsed === 1 ? "day" : "days";
    const daysRemainingString = daysRemaining === 1 ? "day" : "days";

    return (
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base m-0">Booking Progress</h3>
        <p className="m-0">
          {daysElapsed}/{duration} {daysElapsedString} ({daysRemaining}{" "}
          {daysRemainingString} remaining)
        </p>
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
