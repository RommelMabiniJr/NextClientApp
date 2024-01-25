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
import { RatingAndReviewService } from "@/layout/service/RatingAndReviewService";
import ReviewComments from "../subcomp/ReviewComments";
import BookingExtensionTable from "../subcomp/BookingExtensionTable";
import BookingButtons from "../subcomp/BookingButtons";

const BookingViewContent = ({ session }) => {
  const router = useRouter();
  const toast = useRef(null);
  const { bookingId } = router.query;

  const [booking, setBooking] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewObject, setReviewObject] = useState({}); // {rating: 0, comment: ""}
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const [showBookExtendModal, setShowBookExtendModal] = useState(false);
  const [bookingExtensions, setBookingExtensions] = useState([]); // [

  const fetchBookingData = async () => {
    try {
      if (bookingId) {
        const data = await BookingService.getWorkerBookingFull(bookingId);
        setBooking(data);

        // this checks if there is a review if the booking is completed
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

        // retrieve booking extensions
        const response = await BookingService.getBookingExtensions(bookingId);

        console.log(response.data);
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

  const handleCloseBookExtendModal = () => {
    setShowBookExtendModal(false);
  };

  const onDeleteBooking = async () => {
    const success = await BookingService.deleteRegBookingByWorker(bookingId);

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

      router.push("/app/worker/bookings");
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

  // const markBookingComplete = async () => {
  //   const result = await BookingService.markBookingComplete(bookingId);

  //   console.log(result);

  //   if (result) {
  //     // refetch data
  //     fetchData();
  //     toast.current.show({
  //       severity: "success",
  //       summary: "Booking Completed",
  //       detail: "The booking has been completed.",
  //       life: 3000,
  //     });
  //   }
  // };

  // const confirmCompleteBooking = () => {
  //   confirmDialog({
  //     message: "Are you sure you want to mark this booking as complete?",
  //     header: "Confirm Booking Completion",
  //     icon: "pi pi-exclamation-triangle",
  //     position: "right",
  //     accept: () => markBookingComplete(),
  //     reject: () => {},
  //   });
  // };

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
            onClick={() => router.push("/app/worker/bookings")}
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
              {booking.jobposting.benefits.map((benefit, index) => (
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
          {/* Show the booking extension requests */}
          <BookingExtensionTable
            booking={booking}
            bookingExtensions={bookingExtensions}
            onRefetchData={fetchBookingData}
          />

          <div className="py-4 flex flex-col items-center">
            <p className="font-bold mb-2 text-center">Employers's Profile</p>
            <div className="flex flex-col items-center my-4 gap-4 ">
              <img
                src={
                  // process.env.NEXT_PUBLIC_ASSET_URL + booking.worker.profile_url
                  booking.employer.profile_url // TODO: Change this to the above line when the backend is ready
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
                      {booking.employer.first_name +
                        " " +
                        booking.employer.last_name}
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
                      {booking.employer.email}
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
                        {booking.employer.phone}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-column justify-center my-4 items-center">
            <div className="flex flex-column justify-center items-center py-2 mb-2">
              <p className="font-bold text-center mb-1">Booking Status:</p>

              <BookingStatus status={booking.booking_info.booking_progress} />
            </div>

            {renderAdditionalInfo()}
          </div> */}
          <div className="w-10 mx-auto mb-2 flex items-center flex-column ">
            <label className="font-bold flex-1 mb-2">
              Employer's Rating & Review
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
                bookingExtensions={bookingExtensions}
                reviewObject={reviewObject}
                setShowReviewModal={setShowReviewModal}
                handleDeleteBooking={handleDeleteBooking}
                router={router}
                session={session}
                toast={toast}
                fetchBookingData={fetchBookingData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingViewContent;
