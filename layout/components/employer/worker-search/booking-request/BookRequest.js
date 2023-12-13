import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import JobOverview from "./subcomp/JobOverview";
import OfferDetails from "@/layout/components/employer/worker-search/booking-request/subcomp/OfferDetails";
import { buildAddressString } from "@/layout/components/utils/addressUtils";
import { BookingService } from "@/layout/service/BookingService";
import { convertDateToMySQLFormat } from "@/layout/components/utils/dateUtils";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";

const BookRequest = ({
  session,
  worker,
  workerId,
  formik,
  jobDetails,
  onEditJobDetails,
}) => {
  const router = useRouter();
  const toast = useRef(null);
  const [hasExistingOffer, setHasExistingOffer] = useState(false);
  const [offerEvents, setOfferEvents] = useState([]); // offer events from the database
  const [offerDetails, setOfferDetails] = useState({
    salary: "",
    benefits: "",
    deadline: "",
    payFrequency: "",
  }); // original offer details from the database
  const [tempOfferDetails, setTempOfferDetails] = useState({
    salary: "",
    benefits: "",
    deadline: "",
    payFrequency: "",
  }); // temporary offer details for editing
  const [isEditMode, setIsEditMode] = useState(false);
  const [offerStatus, setOfferStatus] = useState("no offer"); // Status of the offer [pending, accepted, rejected, expired, no offer]

  const breadcrumbItems = [
    { label: "Worker Search" },
    { label: "Booking Request" },
  ];

  const onBack = () => {};

  const handleSendOffer = async () => {
    // make sure that living arrangement is a string and not an object
    // make sure date and time are in the correct format for the database, use dayjs
    const modifiedJobDetails = {
      ...jobDetails,
      jobStartDate: convertDateToMySQLFormat(jobDetails.jobStartDate),
      jobEndDate: convertDateToMySQLFormat(jobDetails.jobEndDate),
      jobStartTime: convertDateToMySQLFormat(jobDetails.jobStartTime),
      jobEndTime: convertDateToMySQLFormat(jobDetails.jobEndTime),
    };

    // send booking request to the database
    const response = await BookingService.setBookingRequest(
      modifiedJobDetails,
      tempOfferDetails,
      workerId,
      session.user.uuid
    );

    if (response) {
      toast.current.show({
        severity: "success",
        summary: "Booking request sent!",
        detail: "Your booking request has been sent to the worker.",
        life: 3000,
      });

      setTimeout(() => {
        router.push("/app/employer/bookings");
      }, 3000);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Booking request failed!",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const handleUpdateOffer = () => {
    // update offer details to the database
  };

  return (
    <div className="book-request mx-5">
      <Toast ref={toast} />
      <div className="divide-y">
        <div className="">
          <BreadCrumb
            model={breadcrumbItems}
            home={{ icon: "pi pi-home" }}
            pt={{
              root: {
                className: "border-0",
              },
              menu: {
                className: "gap-3",
              },
            }}
            className="pl-1 pb-2 hidden md:block"
          />
          <div className="flex flex-column md:flex-row gap-x-10 mb-3">
            <div className="flex flex-1 items-center gap-2 ">
              <Button
                icon="pi pi-arrow-left"
                text
                onClick={onBack}
                severity="secondary"
                className="block md:hidden"
              />
              <h2 className="text-4xl font-bold m-0 ">Booking Request For:</h2>
            </div>
            <div className="flex items-center gap-3 ml-6 w-full md:w-6 lg:w-5 pt-4">
              {/* Display Profile */}
              <img
                className="rounded "
                style={{ width: "3rem", height: "3rem" }}
                src={worker.profile_url}
                alt={worker.first_name + " " + worker.last_name}
              />
              <div>
                <h2 className="text-2xl font-semibold m-0 ">
                  {worker.first_name} {worker.last_name}
                </h2>
                <p className="text-sm m-0">
                  Kasambahay |{" "}
                  {buildAddressString(
                    worker.street,
                    worker.barangay,
                    worker.city_municipality
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-column md:flex-row gap-x-10 ">
          <JobOverview
            onEditJobDetails={onEditJobDetails}
            job={jobDetails}
            session={session}
          />
          <OfferDetails
            offerDetails={offerDetails}
            tempOfferDetails={tempOfferDetails}
            setTempOfferDetails={setTempOfferDetails}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleUpdateOffer={handleUpdateOffer}
            handleSendOffer={handleSendOffer}
            hasExistingOffer={hasExistingOffer}
            offerStatus={offerStatus}
            offerEvents={offerEvents}
            session={session}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRequest;
