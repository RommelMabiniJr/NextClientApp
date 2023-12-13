import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BookingService } from "@/layout/service/BookingService";
import { formatSalary } from "@/layout/components/utils/moneyFormatUtils";
import {
  capitalizeEveryWord,
  capitalizeFirstLetter,
} from "@/layout/components/utils/letterCasingUtils";
import dayjs from "dayjs";
import { Tag } from "primereact/tag";
import BookingStatus from "@/layout/components/employer/bookings/subcomp/BookingStatus";
import { Toast } from "primereact/toast";
import BookingProgress from "@/layout/components/employer/bookings/subcomp/BookingProgress";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Rating } from "primereact/rating";
import RatingAndReviewModal from "@/layout/components/employer/bookings/subcomp/RatingAndReviewModal";
import { RatingAndReviewService } from "@/layout/service/RatingAndReviewService";
import ReviewComments from "@/layout/components/employer/bookings/subcomp/ReviewComments";
import { displayTimeAsRange } from "@/layout/components/utils/dateUtils";

const BookingViewContent = () => {
  const router = useRouter();
  const toast = useRef(null);
  const { bookingId } = router.query;

  const [booking, setBooking] = useState(null);
  const [startConfirmationReceived, setStartConfirmationReceived] =
    useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewObject, setReviewObject] = useState({}); // {rating: 0, comment: ""}
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const fetchData = async () => {
    try {
      if (bookingId) {
        const data = await BookingService.getEmployerBookingRequestFull(
          bookingId
        );
        setBooking(data);

        // console.log(data);
        if (data.booking_info.booking_progress === "Completed") {
          // check and see if the employer has already left a review
          // if they have, then show the review
          const review = await RatingAndReviewService.getReviewOfBooking(
            bookingId
          );

          if (review) {
            setReviewObject(review);

            // also set the rating and comments
            setRating(review.rating);
            setComments(review.comments);
          } else {
            // open the review modal
            setShowReviewModal(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors if needed
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  const handleRatingChange = (e) => {
    setRating(e);
  };

  const handleCommentsChange = (e) => {
    setComments(e);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleCreateReview = async () => {
    // TODO: Save review to database
    const success = await RatingAndReviewService.setReviewOfBooking(bookingId, {
      rating: rating,
      comments: comments,
    });

    if (success) {
      toast.current.show({
        severity: "success",
        summary: "Review Saved",
        detail: "Your review has been saved.",
        life: 3000,
      });

      // close the modal
      setShowReviewModal(false);

      // refetch data
      fetchData();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error saving your review.",
        life: 3000,
      });
    }
  };

  const handleUpdateReview = async () => {
    const success = await RatingAndReviewService.updateReviewOfBooking(
      reviewObject.review_id,
      {
        rating: rating,
        comments: comments,
      }
    );

    console.log(success);

    if (success) {
      toast.current.show({
        severity: "success",
        summary: "Review Updated",
        detail: "Your review has been updated.",
        life: 3000,
      });

      // close the modal
      setShowReviewModal(false);

      // refetch data
      fetchData();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error updating your review.",
        life: 3000,
      });
    }
  };

  const handleCancelBooking = async () => {
    const success = await BookingService.cancelBookingRequest(bookingId);

    if (success) {
      toast.current.show({
        severity: "success",
        summary: "Booking Cancelled",
        detail: "The booking has been cancelled.",
        life: 3000,
      });

      setTimeout(() => {
        // refresh page
        router.reload();
      }, 3000);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error cancelling the booking.",
        life: 3000,
      });
    }
  };

  const markBookingStart = async () => {
    const result = await BookingService.markBookingStart(bookingId);

    console.log(result);

    if (result) {
      // refetch data
      fetchData();
      toast.current.show({
        severity: "success",
        summary: "Booking Started",
        detail: "The booking has been started.",
        life: 3000,
      });
    }
  };

  const markBookingComplete = async () => {
    const result = await BookingService.markBookingComplete(bookingId);

    console.log(result);

    if (result) {
      // refetch data
      fetchData();
      toast.current.show({
        severity: "success",
        summary: "Booking Completed",
        detail: "The booking has been completed.",
        life: 3000,
      });
    }
  };

  const confirmCompleteBooking = () => {
    confirmDialog({
      message: "Are you sure you want finish this booking?",
      header: "Confirm Booking Completion",
      icon: "pi pi-exclamation-triangle",
      // position: "right",
      accept: () => markBookingComplete(),
      reject: () => {},
    });
  };

  const renderAdditionalInfo = () => {
    const currentDate = dayjs();
    const scheduledStartDate = dayjs(booking.jobposting.job_start_date);
    const timeUntilStartDate = scheduledStartDate.diff(currentDate, "days");

    if (currentDate.isBefore(scheduledStartDate)) {
      // Display a message indicating the scheduled start date
      return (
        <div>
          <div className="flex flex-column justify-center items-center py-2 mb-2">
            <p className="font-bold text-center mb-1">Time Until Start:</p>
            {/* <Tag value={`${timeUntilStartDate} days`}></Tag> */}

            <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {`${timeUntilStartDate} days`}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderButtons = () => {
    const currentDate = dayjs();
    const scheduledStartDate = dayjs(booking.jobposting.job_start_date);
    const timeUntilStartDate = scheduledStartDate.diff(currentDate, "days");

    if (booking.booking_info.booking_progress.toLowerCase() === "cancelled") {
      return (
        <>
          <Button
            label="Booking Cancelled"
            className="w-full mt-2"
            severity="secondary"
            disabled
          />
          <Button
            label="Delete Booking"
            severity="danger"
            className="w-full mt-2"
            // disabled
            // outlined
            // size="small"
          />
        </>
      );
    }

    if (currentDate.isBefore(scheduledStartDate)) {
      // Display a message indicating the scheduled start date
      return (
        <>
          <Button
            label="Cancel Booking"
            className="w-full p-button-danger mt-2"
            onClick={() => handleCancelBooking()}
          />
        </>
      );
    }

    // Display buttons based on the booking status
    if (booking.booking_info.booking_progress.toLowerCase() == "confirmed") {
      return (
        <>
          {/* Display a button to prompt the start of work */}
          {!startConfirmationReceived ? (
            <Button
              label="Acknowledge Start"
              className="w-full"
              onClick={() => markBookingStart()}
              // outlined
              // size="small"
            />
          ) : (
            <p className="text-center">
              You have acknowledged the start of work.
            </p>
          )}
          <Button
            label="Cancel Booking"
            severity="danger"
            className="w-full mt-2"
            // outlined
            // size="small"
          />
        </>
      );
    } else if (
      booking.booking_info.booking_progress.toLowerCase() === "in progress"
    ) {
      return (
        <>
          {/* Display a "Mark as Complete" button */}
          <Button
            label="Mark as Complete"
            className="w-full"
            onClick={() => confirmCompleteBooking()}
          />
          <Button
            label="Cancel Booking"
            severity="danger"
            className="w-full mt-2"
          />
          {/* ... (other buttons) */}
        </>
      );
    } else if (
      booking.booking_info.booking_progress.toLowerCase() === "completed"
    ) {
      return (
        <>
          {/* Display a rating and leave a review button */}
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
          <div className="w-full mb-2 flex flex-column items-center">
            <label className="font-bold">Rating & Review </label>
            <Rating
              value={reviewObject.rating}
              cancel={false}
              className="my-2"
              readOnly
              pt={{
                onIcon: {
                  className: "text-orange-400",
                },
              }}
            />
            <ReviewComments comments={reviewObject.comments} />

            <Button
              label={(reviewObject.rating > 0
                ? "Edit Review"
                : "Leave a Review"
              ).toUpperCase()}
              className="w-full mt-2"
              onClick={() => setShowReviewModal(true)}
              outlined
              size="small"
            />
          </div>
        </>
      );
    } else {
      // Booking is completed, do not display any buttons
      return null;
    }
  };

  return (
    <div className="flex divide-x flex-column md:flex-row">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="divide-y px-6 py-4 md:w-3/4 ">
        <div className="pb-4 flex items-center gap-4">
          <Button
            // label="Back to Bookings"
            icon="pi pi-arrow-left"
            size="small"
            text
            className="p-button-secondary"
            onClick={() => router.push("/app/employer/bookings")}
          />
          <h3 className="font-bold m-0">
            {/* Nanny Needed For My Children In Waltham. */}
            {booking.jobposting.job_title}
          </h3>
        </div>
        <div className="pt-2">
          <div className="flex mb-4">
            <div className="flex pr-2 flex-1">
              <span className="my-2 mr-2">
                <i className="pi pi-calendar text-lg"></i>
              </span>
              <div className="my-1.5">
                <p className="m-0">Job Start Date:</p>
                <p className="m-0 font-medium">
                  <p className="m-0 font-medium">
                    {/* Mon, Oct 1, 2021 */}
                    {dayjs(booking.jobposting.job_start_date).format(
                      "ddd, MMM D, YYYY"
                    )}
                  </p>
                </p>
              </div>
            </div>
            <div className="flex px-2 flex-1">
              <span className="my-2 mr-2">
                <i className="pi pi-briefcase text-lg"></i>
              </span>
              <div className="my-1.5">
                <p className="m-0">Job & Service Type:</p>
                <p className="m-0 font-medium">
                  {/* Full-Time, Elder Care */}
                  {capitalizeFirstLetter(booking.jobposting.job_type)},{" "}
                  {booking.jobposting.service.service_name}
                </p>
              </div>
            </div>

            <div className="flex px-2 flex-1">
              <span className="my-2 mr-2">
                <i className="pi pi-map-marker text-lg"></i>
              </span>
              <div className="my-1.5">
                <p className="m-0">Work Location:</p>
                <p className="m-0 font-medium">
                  {/* Buntay, Abuyog, Leyte */}
                  {capitalizeEveryWord(booking.employer.street) +
                    ", " +
                    capitalizeFirstLetter(booking.employer.barangay) +
                    ", " +
                    capitalizeFirstLetter(booking.employer.city_municipality)}
                </p>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p className="font-bold mb-2">Job Description</p>
            <p className="m-0">
              {/* We are looking for a great nanny for 2 children in Waltham. We would
            prefer someone who could help out with light housekeeping, meal
            preparation and laundry. We would prefer a nanny who has their own
            car, who does not smoke, who is willing to drive children, who is
            comfortable with pets and who is CPR certified. */}
              {booking.jobposting.job_description}
            </p>
          </div>
          <div className="my-4">
            <p className="font-bold mb-2">Job Schedule</p>
            <div className="flex gap-8">
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-calendar text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Duration</p>
                  <p className="m-0 font-medium">
                    {/* Oct 1, 2021 - Nov 31, 2021 */}
                    {dayjs(booking.jobposting.job_start_date).format(
                      "MMM D, YYYY"
                    )}{" "}
                    -{" "}
                    {dayjs(booking.jobposting.job_end_date).format(
                      "MMM D, YYYY"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-clock text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Working Hours:</p>
                  <p className="m-0 font-medium">
                    {displayTimeAsRange(
                      booking.jobposting.job_start_time,
                      booking.jobposting.job_end_time
                    )}
                  </p>
                </div>
              </div>
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-home text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Living Arrangement:</p>
                  <p className="m-0 font-medium">
                    {/* Live-in with shared room */}
                    {booking.jobposting.living_arrangement}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p className="font-bold mb-2">Payment</p>
            <div className="flex gap-8">
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-wallet text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Salary:</p>
                  <p className="m-0 ">
                    <span className="font-medium">
                      {/* Php 10,000.00 */}
                      {formatSalary(booking.offer.salary)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-wallet text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Pay Frequency:</p>
                  <p className="m-0 ">
                    {/* Paid: Annually */}

                    <span className="font-medium">
                      {booking.offer.pay_frequency}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p className="font-bold mb-2">Offered Benefits</p>
            <div className="pl-4 gap-8">
              {booking.offer.benefits.map((benefit, index) => (
                <div className="flex" key={index}>
                  <span className="my-2 mr-2">
                    <i className="pi pi-check-circle text-lg"></i>
                  </span>
                  <div className="my-1.5">
                    <p className="m-0">
                      {/* Free wifi with occasional snacks */}
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-4">
          <BookingProgress booking={booking} />
        </div>
      </div>
      <div className="md:w-1/4 px-6 pt-5">
        {/* Static sidebar content */}
        <div className="sticky top-20">
          <div className="flex flex-column">
            <div className="flex justify-center">
              <img
                src={booking.worker.profile_url}
                alt="profile picture"
                className="h-24 w-24 rounded-full"
              />
            </div>
            <div className="flex flex-column justify-center items-center">
              <h3 className="font-bold text-center mb-2">
                {/* Maria Cristina */}
                {booking.worker.first_name + " " + booking.worker.last_name}
              </h3>
              <p className="text-center mb-2">
                <span className="mr-2">
                  <i className="pi pi-envelope"></i>
                </span>
                {/* maria.cristina@gmail */}
                {booking.worker.email}
              </p>
              <p className="text-center">
                <span className="mr-2">
                  <i className="pi pi-phone"></i>
                </span>
                {/* 09123456789 */}
                {booking.worker.phone}
              </p>
              <div className="flex flex-column justify-center items-center py-2 mb-2">
                <p className="font-bold text-center mb-1">Booking Status:</p>
                {/* <Tag value={booking.booking_info.booking_progress}></Tag> */}
                <BookingStatus status={booking.booking_info.booking_progress} />
              </div>

              {renderAdditionalInfo()}
            </div>
            {/* Actions */}
            <div className="flex flex-column justify-center items-center my-4">
              {renderButtons()}
            </div>
            {/* <div className="flex flex-column justify-center items-center my-4">
              <Button
                label="Send Message"
                className="w-full"
                onClick={() => router.push("/app/employer/messages")}
              />
              <Button
                label="Mark as Complete"
                className="w-full mt-2"
                // onClick={markAsComplete}
              />
              <Button
                label="Cancel Booking"
                className="w-full mt-2"
                severity="danger"
                onClick={() => router.push("/app/employer/bookings")}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingViewContent;
