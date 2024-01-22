// BookingButtons.js
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import ReviewComments from "../subcomp/ReviewComments";
import dayjs from "dayjs";
import MessageContentDialog from "../../messages/MessageContentDialog";
import { BookingService } from "@/layout/service/BookingService";
import CancelModal from "./CancelModal";

const BookingButtons = ({
  booking,
  bookingExtensions,
  reviewObject,
  setShowReviewModal,
  router,
  handleDeleteBooking,
  fetchBookingData,
  session,
  toast,
}) => {
  const [msgPanelVisible, setMsgPanelVisible] = useState(false);
  const currentDate = dayjs();
  const scheduledStartDate = dayjs(booking.jobposting.job_start_date);
  const timeUntilStartDate = scheduledStartDate.diff(currentDate, "days");

  const [cancelReasonDialogVisible, setCancelReasonDialogVisible] =
    useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelBooking = async () => {
    const reason =
      selectedReason.key === "other" ? declineReason : selectedReason.name;

    const response = await BookingService.cancelBookingByWorker(
      booking.booking_info.booking_id,
      reason
    );

    if (response) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Booking cancelled",
        life: 3000,
      });

      setCancelReasonDialogVisible(false);

      // refetch data
      fetchBookingData();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  if (!booking.booking_info.booking_progress) {
    return null;
  }

  switch (booking.booking_info.booking_progress.toLowerCase()) {
    case "confirmed":
      return (
        <>
          {/* Display a "Mark as Complete" button */}
          <MessageContentDialog
            msgPanelVisible={msgPanelVisible}
            setMsgPanelVisible={setMsgPanelVisible}
            UUIDS={{
              senderUUID: session.user.uuid,
              receiverUUID: booking.employer.uuid,
            }}
            worker={booking.worker}
            employer={booking.employer}
            session={session}
          />
          <Button
            label="Send Message"
            icon="pi pi-envelope"
            className="w-full"
            size="small"
            raised
            onClick={() => setMsgPanelVisible(true)}
          />
          <div className="mt-2 w-full flex flex-column items-center">
            <CancelModal
              booking={booking}
              dialogVisible={cancelReasonDialogVisible}
              setDialogVisible={setCancelReasonDialogVisible}
              selectedReason={selectedReason}
              setSelectedReason={setSelectedReason}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              handleCancelBooking={handleCancelBooking}
            />
            <Button
              label="Cancel Booking"
              icon="pi pi-times-circle"
              severity="danger"
              className="w-full"
              size="small"
              raised
              onClick={() => setCancelReasonDialogVisible(true)}
            />
          </div>
        </>
      );
    case "in progress":
      return (
        <>
          {/* Display a "Mark as Complete" button */}
          <MessageContentDialog
            msgPanelVisible={msgPanelVisible}
            setMsgPanelVisible={setMsgPanelVisible}
            UUIDS={{
              senderUUID: session.user.uuid,
              receiverUUID: booking.employer.uuid,
            }}
            worker={booking.worker}
            employer={booking.employer}
            session={session}
          />
          <Button
            label="Send Message"
            icon="pi pi-envelope"
            className="w-full"
            size="small"
            raised
            onClick={() => setMsgPanelVisible(true)}
          />
          <div className="mt-2 w-full flex flex-column items-center">
            <CancelModal
              booking={booking}
              dialogVisible={cancelReasonDialogVisible}
              setDialogVisible={setCancelReasonDialogVisible}
              selectedReason={selectedReason}
              setSelectedReason={setSelectedReason}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              handleCancelBooking={handleCancelBooking}
            />
            <Button
              label="Cancel Booking"
              icon="pi pi-times-circle"
              severity="danger"
              className="w-full"
              size="small"
              raised
              onClick={() => setCancelReasonDialogVisible(true)}
            />
          </div>
        </>
      );
    case "completed":
      return (
        <>
          {/* Display a rating and leave a review button */}
          <div className="w-full mb-2 flex flex-column items-center">
            <MessageContentDialog
              msgPanelVisible={msgPanelVisible}
              setMsgPanelVisible={setMsgPanelVisible}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: booking.employer.uuid,
              }}
              employer={booking.employer}
              worker={booking.worker}
              session={session}
            />
            <Button
              label="Send Message"
              className="w-full mt-2"
              icon="pi pi-envelope"
              size="small"
              raised
              onClick={() => setMsgPanelVisible(true)}
            />
          </div>
          <div className="w-full mb-2 flex flex-column items-center">
            <Button
              icon="pi pi-trash"
              label="Delete Booking"
              severity="danger"
              className="w-full"
              size="small"
              raised
              onClick={() => handleDeleteBooking()}
            />
          </div>
        </>
      );
    case "cancelled":
      return (
        <>
          {/* Display a rating and leave a review button */}
          <div className="w-full mb-2 flex flex-column items-center">
            <MessageContentDialog
              msgPanelVisible={msgPanelVisible}
              setMsgPanelVisible={setMsgPanelVisible}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: booking.employer.uuid,
              }}
              employer={booking.employer}
              worker={booking.worker}
              session={session}
            />
            <Button
              label="Send Message"
              className="w-full mt-2"
              icon="pi pi-envelope"
              size="small"
              raised
              onClick={() => setMsgPanelVisible(true)}
            />
          </div>
          <div className="w-full mb-2 flex flex-column items-center">
            <Button
              icon="pi pi-trash"
              label="Delete Booking"
              severity="danger"
              className="w-full"
              size="small"
              raised
              onClick={() => handleDeleteBooking()}
            />
          </div>
        </>
      );
    default:
      return null;
  }
};

export default BookingButtons;
