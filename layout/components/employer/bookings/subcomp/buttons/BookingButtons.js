// BookingButtons.js
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import ReviewComments from "../ReviewComments";
import RatingAndReviewModal from "../RatingAndReviewModal";
import BookingExtensionModal from "../BookingExtensionModal";
import dayjs from "dayjs";
import { SplitButton } from "primereact/splitbutton";
import MessageContent from "../../../messages/MessageContent";
import MessageContentDialog from "../../../messages/MessageContentDialog";
import { Divider } from "primereact/divider";
import CancelModal from "../CancelModal";
import { BookingService } from "@/layout/service/BookingService";

const BookingButtons = ({
  toast,
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

    const response = await BookingService.cancelBookingByEmployer(
      booking.booking_info.booking_id,
      reason
    );

    if (response) {
      toast.current.show({
        severity: "success",
        summary: "Decline Success",
        detail: "Job offer declined",
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

          <div className="w-full flex flex-column items-center">
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
          <div className="w-full flex flex-column items-center">
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
          <Divider />
          <div className="w-full mb-2 flex flex-column items-center">
            <BookingExtensionModal
              booking={booking}
              bookingExtensions={bookingExtensions}
              show={showBookExtendModal}
              handleClose={handleCloseBookExtendModal}
              onRefetchData={fetchBookingData}
            />
            <Button
              label="Extend Booking"
              icon="pi pi-external-link"
              className="w-full"
              onClick={() => setShowBookExtendModal(true)}
              size="small"
              outlined
              raised
            />
          </div>
        </>
      );
    case "completed":
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
          <Divider />
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
              raised
              size="small"
            />
          </div>
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
    // End
    default:
      return <></>;
  }
};

export default BookingButtons;
