import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";

const CancelModal = ({
  selectedReason,
  setSelectedReason,
  cancelReason,
  setCancelReason,
  dialogVisible,
  setDialogVisible,
  handleCancelBooking,
}) => {
  const employerCancellationOptions = [
    {
      key: "emergency",
      title: "Emergency Cancellation",
      name: "There is an emergency, and I need to cancel the booking.",
    },
    {
      key: "change",
      title: "Change of Plans",
      name: "I have a change of plans and need to cancel the booking.",
    },
    {
      key: "mistake",
      title: "Booking Mistake",
      name: "I made a mistake in the booking and need to cancel or reschedule.",
    },
    {
      key: "other",
      title: "Other Reason (Specify)",
      name: "(Other) Specify the reason for cancelling the booking.",
    },
  ];

  const footerCancelDialog = () => {
    return (
      <div className="flex justify-end gap-x-2">
        <Button
          label="Cancel"
          severity="secondary"
          className="p-button-sm"
          text
          onClick={() => setDialogVisible(false)}
        />
        <Button
          label="Cancel Booking"
          className="p-button-sm"
          severity="danger"
          disabled={selectedReason.key === "other" && cancelReason === ""}
          onClick={() => {
            handleCancelBooking();
          }}
        />
      </div>
    );
  };

  return (
    <Dialog
      visible={dialogVisible}
      onHide={() => setDialogVisible(false)}
      header="WHY ARE YOU CANCELLING THIS BOOKING?"
      modal
      className=""
      footer={footerCancelDialog}
    >
      <div className=" flex flex-column gap-3 w-full mt-1">
        {employerCancellationOptions.map((reason) => (
          <div className="flex items-center gap-2 text-sm ml-3 w-full">
            <RadioButton
              inputId={reason.key}
              name="reason"
              value={reason}
              onChange={(e) => setSelectedReason(e.value)}
              checked={selectedReason.key === reason.key}
            />
            <label htmlFor={reason.key} className="ml-2 text-base">
              {reason.name}
            </label>
          </div>
        ))}
        <div className="w-full">
          <InputTextarea
            id="reason"
            rows={5}
            // cols={10}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-11 ml-6 text-sm"
            // placeholder="Please specify the reason for cancelling the booking."
            disabled={selectedReason.key !== "other"}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CancelModal;
