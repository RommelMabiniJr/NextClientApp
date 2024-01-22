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
import BookingStatus from "../subcomp/BookingStatus";
import { Toast } from "primereact/toast";
import BookingProgress from "../subcomp/BookingProgress";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Rating } from "primereact/rating";
import RatingAndReviewModal from "../subcomp/RatingAndReviewModal";
import { RatingAndReviewService } from "@/layout/service/RatingAndReviewService";
import ReviewComments from "../subcomp/ReviewComments";
import BookingExtensionModal from "../subcomp/BookingExtensionModal";
import BookingExtensionTable from "../subcomp/BookingExtensionTable";
import BookingButtons from "../subcomp/buttons/BookingButtons";

const BookingViewContent = ({ session }) => {
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

  const [showBookExtendModal, setShowBookExtendModal] = useState(false);
  const [bookingExtensions, setBookingExtensions] = useState([]); // [{start_date: "", end_date: ""} ...]

  const fetchBookingData = async () => {
    try {
      if (bookingId) {
        const data = await BookingService.getEmployerBookingFull(bookingId);
        setBooking(data);

        // if completed, check if there is a review
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

        // retrieve the booking extensions
        const response = await BookingService.getBookingExtensions(bookingId);

        if (response.data.length > 0) {
          setBookingExtensions(response.data);
        } else {
          setBookingExtensions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors if needed
    }
  };

  useEffect(() => {
    fetchBookingData();
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
      fetchBookingData();
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
      fetchBookingData();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error updating your review.",
        life: 3000,
      });
    }
  };

  const onDeleteBooking = async () => {
    const success = await BookingService.deleteRegBookingByEmployer(bookingId);

    if (success) {
      toast.current.show({
        severity: "success",
        summary: "Booking Deleted",
        detail: "The booking has been deleted.",
        life: 3000,
      });

      setTimeout(() => {
        // refresh page
        router.reload();
      }, 3000);

      router.push("/app/employer/bookings");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error deleting the booking.",
        life: 3000,
      });
    }
  };

  const handleDeleteBooking = async () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirm Booking Deletion",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary p-button-text",
      accept: () => onDeleteBooking(),
      reject: () => {},
    });
  };

  const handleCloseBookExtendModal = () => {
    setShowBookExtendModal(false);
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

    if (booking.booking_info.booking_progress === "Cancelled") {
      // Display who cancelled, the reason, and the date
      return (
        <div>
          <div className="flex flex-column justify-center items-center py-2 mb-2">
            <p className="font-bold text-center mb-1">Cancellation Info:</p>
            <p className="text-center">
              {booking.booking_info.cancelled_initiator === "employer"
                ? "Cancelled by Employer"
                : "Cancelled by Kasambahay"}
            </p>
          </div>
        </div>
      );
    }

    return null;
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
          <p className="text-xl m-0">|</p>
          <BookingStatus status={booking.booking_info.booking_progress} />
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
                  {booking.jobposting.service &&
                    booking.jobposting.service.service_name}
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
                  <p className="m-0 font-medium">8:00 AM - 5:00 PM</p>
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
                      {formatSalary(booking.jobposting.salary)}
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
                      {booking.jobposting.pay_frequency}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p className="font-bold mb-2">Offered Benefits</p>
            <div className="pl-4 gap-8">
              {booking.jobposting.benefits &&
                booking.jobposting.benefits.map((benefit, index) => (
                  <div className="flex" key={index}>
                    <span className="my-2 mr-2">
                      <i className="pi pi-check-circle text-lg"></i>
                    </span>
                    <div className="my-1.5">
                      <p className="m-0">{benefit}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {booking.booking_info.booking_progress == "Cancelled" && (
          <div className="py-4">
            <div className="my-4">
              <p className="font-bold mb-2">Cancellation Details</p>
              <div className="grid gap-3">
                <div className="col flex">
                  <span className="my-2 mr-2">
                    <i className="pi pi-user text-lg"></i>
                  </span>
                  <div className="my-1.5">
                    <p className="m-0">Cancelled By:</p>
                    {console.log(booking)}
                    <p className="m-0 font-medium">
                      {booking.booking_info.cancellation_initiator == "employer"
                        ? "Household Employer"
                        : "Kasambahay"}
                    </p>
                  </div>
                </div>
                <div className="col flex">
                  <span className="my-2 mr-2">
                    <i className="pi pi-calendar text-lg"></i>
                  </span>
                  <div className="my-1.5">
                    <p className="m-0">Cancelled On:</p>
                    <p className="m-0 font-medium">
                      {dayjs(booking.booking_info.cancellation_date).format(
                        "ddd, MMM D, YYYY"
                      )}
                    </p>
                  </div>
                </div>
                <div className="col flex">
                  <span className="my-2 mr-2">
                    <i className="pi pi-home text-lg"></i>
                  </span>
                  <div className="my-1.5">
                    <p className="m-0">Reason:</p>
                    <p className="m-0 font-medium">
                      {/* Live-in with shared room */}
                      {booking.booking_info.cancellation_reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="py-4">
          {/* <BookingProgress booking={booking} /> */}

          {/* Show the booking extension requests */}
          <BookingExtensionTable
            booking={booking}
            bookingExtensions={bookingExtensions}
            onRefetchData={fetchBookingData}
          />
        </div>
        <div className="py-4 flex flex-col items-center">
          <p className="font-bold mb-2 text-center">Kasambahay's Profile</p>
          <div className="flex flex-col items-center my-4 gap-4 ">
            <img
              src={
                // process.env.NEXT_PUBLIC_ASSET_URL + booking.worker.profile_url
                booking.worker.profile_url // TODO: Change this to the above line when the backend is ready
              }
              alt="profile picture"
              className="h-7rem w-7rem rounded-full"
            />
            <div className="flex gap-8">
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-user text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Full Name</p>
                  <p className="m-0 font-semibold text-lg text-center">
                    {/* Name: */}
                    {booking.worker.first_name + " " + booking.worker.last_name}
                  </p>
                </div>
              </div>
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-envelope text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Email:</p>
                  <p className="m-0 font-medium">
                    {/* Email: */}
                    {booking.worker.email}
                  </p>
                </div>
              </div>
              <div className="flex">
                <span className="my-2 mr-2">
                  <i className="pi pi-phone text-lg"></i>
                </span>
                <div className="my-1.5">
                  <p className="m-0">Phone:</p>
                  <p className="m-0 font-medium">
                    {/* Live-in with shared room */}
                    <p className="m-0 font-medium">
                      {/* Phone: */}
                      {booking.worker.phone}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-10 mx-auto mb-2 flex items-center flex-column ">
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

            <label className="font-bold flex-1 mb-2">
              Your Rating & Review
            </label>
            <Rating
              value={reviewObject.rating}
              cancel={false}
              className="my-2"
              readOnly
              pt={{
                onIcon: {
                  className: "text-orange-400",
                  style: { width: "1.3rem", height: "1.3rem" },
                },
                offIcon: {
                  className: "",
                  style: { width: "1.3rem", height: "1.3rem" },
                },
              }}
            />
            <ReviewComments comments={reviewObject.comments} />
          </div>
        </div>
      </div>
      <div className="md:w-1/4 px-6 pt-5">
        {/* Static sidebar content */}
        <div className="sticky top-20">
          <div className="flex flex-column">
            {/* Actions */}
            <div className="flex flex-column justify-center items-center my-4">
              <BookingButtons
                booking={booking}
                reviewObject={reviewObject}
                setShowReviewModal={setShowReviewModal}
                handleCloseReviewModal={handleCloseReviewModal}
                handleCreateReview={handleCreateReview}
                handleUpdateReview={handleUpdateReview}
                handleRatingChange={handleRatingChange}
                handleDeleteBooking={handleDeleteBooking}
                handleCommentsChange={handleCommentsChange}
                rating={rating}
                comments={comments}
                showBookExtendModal={showBookExtendModal}
                setShowBookExtendModal={setShowBookExtendModal}
                handleCloseBookExtendModal={handleCloseBookExtendModal}
                bookingExtensions={bookingExtensions}
                fetchBookingData={fetchBookingData}
                router={router}
                showReviewModal={showReviewModal}
                session={session}
                toast={toast}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingViewContent;
