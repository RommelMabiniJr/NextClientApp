import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import dayjs from "dayjs";
import { BookingService } from "@/layout/service/BookingService";
import { convertDateToMySQLFormat } from "@/layout/components/utils/dateUtils";

const BookingExtensionModal = ({
  booking,
  bookingExtensions,
  handleClose,
  onRefetchData,
  show,
}) => {
  const [dates, setDates] = useState([]); // [start, end]
  const [minDate, setMinDate] = useState(null);
  const [salaryIncrease, setSalaryIncrease] = useState(
    booking.jobposting.salary
  );

  useEffect(() => {
    const finalMinDate = new Date(
      Math.max(
        dayjs(booking.jobposting.job_end_date).valueOf(),
        dayjs().valueOf(),
        ...bookingExtensions.map((extension) =>
          dayjs(extension.extended_end_date).valueOf()
        )
      ) +
        24 * 60 * 60 * 1000
    );

    // setDates([finalMinDate, finalMinDate]);
    setMinDate(finalMinDate);
  }, [booking, bookingExtensions]);

  const handleExtend = async () => {
    const response = await BookingService.extendBooking(
      booking.booking_info.booking_id,
      convertDateToMySQLFormat(dates[0]), // start date
      convertDateToMySQLFormat(dates[1]), // end date
      salaryIncrease
    );

    if (response) {
      await onRefetchData();
      handleClose();
    }
  };

  const footerContent = (
    <div>
      <Button
        className="small"
        label="Cancel"
        // icon="pi pi-times"
        onClick={handleClose}
        severity="secondary"
        text
      />

      <Button
        className="small"
        label="Extend Booking"
        // icon="pi pi-check"
        onClick={handleExtend}
      />
    </div>
  );

  const headerTemplate = (
    <div className="flex flex-column align-items-center gap-2">
      <h5 className="m-0 font-bold text-2xl">Extend Booking</h5>
      <p className="font-normal text-sm">How long would you like to extend?</p>
    </div>
  );

  return (
    <Dialog
      header={headerTemplate}
      visible={show}
      //   style={{ width: "50vw" }}
      className="w-screen lg:w-30rem"
      onHide={handleClose}
      footer={footerContent}
      pt={{
        headerIcons: {
          className: "hidden",
        },
      }}
    >
      <div className="p-fluid flex flex-column">
        <div className="p-field flex flex-column w-full p-2 mb-4">
          <p className="font-medium mb-2">Schedule</p>
          <Calendar
            className="w-full"
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            dateFormat="M dd, yy"
            readOnlyInput
            touchUI
            // compare end date of job, end date of latest book extension and current date if end date is less than current date and set it as min date
            minDate={minDate}
          />
        </div>
        <div className="p-field flex flex-column w-full p-2 mb-4">
          <p className="font-medium mb-2">Salary Increase (Optional)</p>
          <InputNumber
            value={salaryIncrease}
            showButtons
            onChange={(e) => setSalaryIncrease(e.value)}
            mode="currency"
            currency="PHP"
            step={100}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default BookingExtensionModal;
