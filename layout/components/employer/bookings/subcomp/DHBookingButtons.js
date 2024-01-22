// BookingButtons.js
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import ReviewComments from "../subcomp/ReviewComments";
import RatingAndReviewModal from "../subcomp/RatingAndReviewModal";
import BookingExtensionModal from "../subcomp/BookingExtensionModal";
import dayjs from "dayjs";
import { SplitButton } from "primereact/splitbutton";
import MessageContent from "../../messages/MessageContent";
import MessageContentDialog from "../../messages/MessageContentDialog";
import { BookingService } from "@/layout/service/BookingService";
import CancelModal from "./CancelModal";

const DHBookingButtons = ({
  booking,
  reviewObject,
  setShowReviewModal,
  handleCloseReviewModal,
  handleCreateReview,
  handleUpdateReview,
  handleRatingChange,
  handleCommentsChange,
  handleDeleteBooking,
  rating,
  comments,
  showBookExtendModal,
  showReviewModal,
  setShowBookExtendModal,
  handleCloseBookExtendModal,
  bookingExtensions,
  fetchBookingData,
  router,
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

    const response = await BookingService.cancelBookingRequestByEmployer(
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
          {/* Display a "Mark as Complete" button */}
          <MessageContentDialog
            msgPanelVisible={msgPanelVisible}
            setMsgPanelVisible={setMsgPanelVisible}
            UUIDS={{
              senderUUID: session.user.uuid,
              receiverUUID: booking.worker.uuid,
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
    case "in progress":
      return (
        <>
          {/* Display a "Mark as Complete" button */}
          <MessageContentDialog
            msgPanelVisible={msgPanelVisible}
            setMsgPanelVisible={setMsgPanelVisible}
            UUIDS={{
              senderUUID: session.user.uuid,
              receiverUUID: booking.worker.uuid,
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
                receiverUUID: booking.worker.uuid,
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
              onClick={() => setMsgPanelVisible(true)}
              outlined
            />
          </div>
          <div className="w-full mb-2 flex flex-column items-center">
            <RatingAndReviewModal
              show={showReviewModal}
              hasReview={reviewObject.rating > 0}
              handleClose={handleCloseReviewModal}
              handleCreate={handleCreateReview}
              handleUpdate={handleUpdateReview}
              handleRatingChange={handleRatingChange}
              handleCommentsChange={handleCommentsChange}
              rating={rating}
              comments={comments}
            />

            <Button
              label={reviewObject.rating > 0 ? "Edit Review" : "Leave a Review"}
              icon="pi pi-star"
              className="w-full "
              onClick={() => setShowReviewModal(true)}
              outlined
              size="small"
            />
          </div>
        </>
      );
    case "pending":
      return (
        <>
          {/* Display a "Mark as Complete" button */}
          <MessageContentDialog
            msgPanelVisible={msgPanelVisible}
            setMsgPanelVisible={setMsgPanelVisible}
            UUIDS={{
              senderUUID: session.user.uuid,
              receiverUUID: booking.worker.uuid,
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
    case "cancelled":
      return (
        <>
          <div className="w-full mb-2 flex flex-column items-center">
            <MessageContentDialog
              msgPanelVisible={msgPanelVisible}
              setMsgPanelVisible={setMsgPanelVisible}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: booking.worker.uuid,
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
              onClick={() => setMsgPanelVisible(true)}
              // outlined
              raised
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
          <div className="w-full mb-2 flex flex-column items-center">
            <MessageContentDialog
              msgPanelVisible={msgPanelVisible}
              setMsgPanelVisible={setMsgPanelVisible}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: booking.worker.uuid,
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
              onClick={() => setMsgPanelVisible(true)}
              // outlined
              raised
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
          <div className="w-full mb-2 flex flex-column items-center">
            <MessageContentDialog
              msgPanelVisible={msgPanelVisible}
              setMsgPanelVisible={setMsgPanelVisible}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: booking.worker.uuid,
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
              onClick={() => setMsgPanelVisible(true)}
              // outlined
              raised
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
