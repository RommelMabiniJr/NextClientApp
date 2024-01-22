// BookingButtons.js
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import ReviewComments from "../subcomp/ReviewComments";
import dayjs from "dayjs";
import MessageContentDialog from "../../messages/MessageContentDialog";
import { Divider } from "primereact/divider";
import { BookingService } from "@/layout/service/BookingService";
import CancelModal from "./CancelModal";

const DHBookingButtons = ({
  booking,
  reviewObject,
  setShowReviewModal,
  handleAcceptBookingRequest,
  handleDeclineBookingRequest,
  handleDeleteBooking,
  router,
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

    const response = await BookingService.cancelBookingRequestByWorker(
      booking.booking_info.dhb_id,
      reason
    );

    if (response) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Booking cancellation success",
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
          <div className="w-full flex flex-column items-center">
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
              icon="pi pi-envelope"
              className="w-full"
              size="small"
              raised
              onClick={() => setMsgPanelVisible(true)}
            />
          </div>
          <Button
            label="Cancel Booking"
            icon="pi pi-times-circle"
            severity="danger"
            className="w-full mt-2"
            size="small"
            raised
          />
        </>
      );

    case "pending":
      return (
        <>
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
              icon="pi pi-envelope"
              className="w-full"
              size="small"
              raised
              onClick={() => setMsgPanelVisible(true)}
            />
          </div>
          <Divider />
          <Button
            label="Accept Booking"
            className="w-full"
            size="small"
            onClick={() => handleAcceptBookingRequest()}
            outlined
            raised
          />
          <Button
            label="Decline Booking"
            severity="danger"
            className="w-full mt-2"
            size="small"
            onClick={() => handleDeclineBookingRequest()}
            outlined
            raised
          />
        </>
      );

    case "in progress":
      return (
        <>
          <div className="w-full flex flex-column items-center">
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
              icon="pi pi-envelope"
              className="w-full"
              size="small"
              raised
              onClick={() => setMsgPanelVisible(true)}
            />
          </div>
          <Button
            label="Cancel Booking"
            icon="pi pi-times-circle"
            severity="danger"
            className="w-full mt-2"
            size="small"
            raised
            onClick={() => setCancelReasonDialogVisible(true)}
          />
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
              icon="pi pi-envelope"
              className="w-full"
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
    case "declined":
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
              icon="pi pi-envelope"
              className="w-full"
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
              icon="pi pi-envelope"
              className="w-full"
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
    case "expired":
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
              icon="pi pi-envelope"
              className="w-full"
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

export default DHBookingButtons;
