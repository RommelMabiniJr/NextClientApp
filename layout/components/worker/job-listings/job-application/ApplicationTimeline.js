import React, { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "primereact/timeline";
import { COLORS } from "../../../utils/timelineUtils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import OfferTimeline from "./subcomp/OfferTimeline";
import { useRouter } from "next/router";
import { BookingService } from "@/layout/service/BookingService";

// Use the UTC plugin, as your timestamp is in UTC
dayjs.extend(utc);

const ApplicationTimeline = ({
  applicationId,
  applicationDetails,
  offerData,
  offerStatus,
  offerEvents,
  interviewData,
  timelineData,
  handleAcceptOffer,
  handleDeclineOffer,
}) => {
  const [declineReasonDialogVisible, setDeclineReasonDialogVisible] =
    useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState("yes");
  const [bookingId, setBookingId] = useState("");
  const router = useRouter();

  useEffect(() => {
    // return if no applicationId
    if (!applicationId) return;

    const getBookingId = async () => {
      const bookingId = await BookingService.getBookingIdByApplicationId(
        applicationId
      );

      setBookingId(bookingId);
    };

    getBookingId();
  }, [applicationId, timelineData]);

  const declineReasonsCategories = [
    {
      key: "schedule",
      title: "Schedule Incompatibility",
      name: "The offered schedule does not align with my availability.",
    },

    {
      key: "commitments",
      title: "Personal or Family Commitments",
      name: "I have personal or family commitments that prevent me from taking on the job.",
    },
    {
      key: "opportunity",
      title: "Found Another Opportunity",
      name: "I have received another job offer that better suits my preferences.",
    },
    {
      key: "compensation",
      title: "Compensation and Benefits",
      name: "The offered salary or benefits package does not meet my expectations.",
    },
    {
      key: "other",
      title: "Other Reason (Specify)",
      name: "(Other) Specify the reason for declining the job offer.",
    },
  ];

  const onDeclineOffer = () => {
    setDeclineReasonDialogVisible(true);
  };

  const footerDeclineDialog = () => {
    return (
      <div className="flex justify-end gap-x-2">
        <Button
          label="Confirm"
          className="p-button-sm"
          severity="danger"
          onClick={() => {
            handleDeclineOffer(selectedReason, declineReason);
            setDeclineReasonDialogVisible(false);
          }}
        />
        <Button
          label="Cancel"
          severity="secondary"
          className="p-button-sm"
          onClick={() => setDeclineReasonDialogVisible(false)}
        />
      </div>
    );
  };

  const getEventDescriptionContent = (item) => {
    switch (item.event_description) {
      case "Interview Scheduled":
        return (
          <>
            <div className="mt-3 border-t ">
              <dl className="divide-y divide-gray-100 ">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Interview Date and Time:
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {dayjs
                      .utc(interviewData.scheduled_date)
                      .format("MMMM DD, YYYY")}{" "}
                    at{" "}
                    {dayjs(`2023-11-09T${interviewData.scheduled_time}`).format(
                      "h:mm A"
                    )}
                  </dd>
                </div>

                {/* Show the link of interview */}
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Interview Link:
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <a
                      href={interviewData.interview_link}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      {interviewData.interview_link}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </>
        );
        break;

      case "Job Offer":
        return (
          <>
            <div className="mt-3 border-t ">
              {offerData && (
                <dl className="divide-y divide-gray-100 ">
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Last Updated:
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <div className="flex w-full">
                        <div className="flex flex-col w-1/2 flex-1">
                          <div className="text-sm">
                            {offerData.updated_at
                              ? dayjs
                                  .utc(offerData.updated_at)
                                  .format("dddd, MMMM DD, YYYY [at] h:mmA")
                              : "Not updated yet"}
                          </div>
                        </div>

                        <div>
                          <span
                            className="cursor-pointer rounded-md hover:bg-gray-200 py-2 px-3"
                            onClick={() => setSidebarVisible(true)}
                          >
                            <i className="pi pi-history"></i>
                          </span>
                          <OfferTimeline
                            offerEvents={offerEvents}
                            setSidebarVisible={setSidebarVisible}
                            sidebarVisible={sidebarVisible}
                          />
                        </div>
                      </div>
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Deadline:
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {offerData.deadline} day(s) from now
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Proposed Salary (PHP):
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "PHP",
                      }).format(applicationDetails.post.salary)}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Payment Frequency:
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {applicationDetails.post.pay_frequency}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Benefits:
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <ul className="list-disc list-inside mb-4">
                        {applicationDetails.post.benefits.map(
                          (benefit, index) => (
                            <li key={index} className="text-gray-600 ml-3">
                              {benefit}
                            </li>
                          )
                        )}
                      </ul>
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Response
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {offerStatus === "accepted" ? (
                        <Button
                          label="Accepted"
                          size="small"
                          severity="success"
                          disabled
                        ></Button>
                      ) : null}

                      {offerStatus === "declined" ? (
                        <Button
                          label="Declined"
                          size="small"
                          severity="danger"
                          disabled
                          // className="font-bold py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                        ></Button>
                      ) : null}

                      {offerStatus === "updated" ||
                      offerStatus === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAcceptOffer(item)}
                            className="font-bold mr-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onDeclineOffer()}
                            className="font-bold py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Decline
                          </button>
                        </>
                      ) : null}
                      <Dialog
                        visible={declineReasonDialogVisible}
                        onHide={() => setDeclineReasonDialogVisible(false)}
                        header="PLEASE SELECT A REASON FOR DECLINING THE OFFER:"
                        modal
                        className=""
                        footer={footerDeclineDialog}
                      >
                        {/* <div className="font-semibold pb-3 ml-3">
                          Allow to recieve more offer updates?
                        </div>
                        <div className="p-fluid flex flex-column gap-3 ml-3 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <RadioButton
                              inputId="yes"
                              name="receiveUpdates"
                              value="yes"
                              onChange={(e) => setReceiveUpdates(e.value)}
                              checked={receiveUpdates === "yes"}
                            />
                            <label htmlFor="yes" className="ml-2">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <RadioButton
                              inputId="no"
                              name="receiveUpdates"
                              value="no"
                              onChange={(e) => setReceiveUpdates(e.value)}
                              checked={receiveUpdates === "no"}
                            />
                            <label htmlFor="no" className="ml-2">
                              No
                            </label>
                          </div>
                        </div> */}

                        {/* <div className="font-semibold pb-3 ml-3">
                          Please select a reason for declining the job offer:
                        </div> */}

                        <div className="p-fluid flex flex-column gap-3 w-full mt-1">
                          {declineReasonsCategories.map((reason) => (
                            <div className="flex items-center gap-2 text-sm ml-3 w-full">
                              <RadioButton
                                inputId={reason.key}
                                name="reason"
                                value={reason}
                                onChange={(e) => setSelectedReason(e.value)}
                                checked={selectedReason.key === reason.key}
                              />
                              <label
                                htmlFor={reason.key}
                                className="ml-2 text-base"
                              >
                                {reason.name}
                              </label>
                            </div>
                          ))}
                          <div className="w-full">
                            <InputTextarea
                              id="reason"
                              rows={3}
                              // cols={10}
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                              className="w-11 ml-6 text-sm"
                            />
                          </div>
                        </div>
                      </Dialog>
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </>
        );

        break;

      case "Job Offer Accepted":
        return (
          <div className="my-2">
            <Button
              size="small"
              label="View Booking"
              className="p-button-sm"
              onClick={() =>
                window.open(`/app/worker/bookings/view/${bookingId}`, "_blank")
              }
            />
          </div>
        );
      // Add more cases as needed for different event descriptions
      default:
        return <p></p>;
    }
  };

  const customizedMarker = (item) => {
    let iconClass = item.icon;
    if (item.icon == "pi pi-sync" && item.isCurrent) {
      // If the icon is a spinner and the last event, add the spin class
      iconClass += " pi-spin";
    }

    console.log(item);

    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={`${iconClass} `}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    let fontColor = "";

    // Define styles based on the status
    const statusStyle = item.isCurrent
      ? {
          fontWeight: "bold",
          // color: item.color, (if needed in the future)
        }
      : {
          color: COLORS.GREY,
        };

    return (
      <div className="p-grid">
        <div className={`p-col-12 mt-1 ${fontColor}`} style={statusStyle}>
          <div className="font-semibold">{item.event_description}</div>
        </div>
        <div className="p-col-12 mt-1 mb-4">
          {item.isCurrent && (
            <>
              <span className="text-color-secondary text-sm">
                {item.content}
              </span>
              {getEventDescriptionContent(item)}
            </>
          )}
          {!item.isCurrent && (
            <span className={`text-gray-500 text-sm ${fontColor}`}>
              {item.content}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Timeline
      value={timelineData}
      className="ml-4 max-w-5xl "
      opposite={(item) => (
        <small className="text-color-secondary">
          {dayjs.utc(item.event_timestamp).format("DD/MM/YYYY HH:mm")}
        </small>
      )}
      content={customizedContent}
      marker={customizedMarker}
      pt={{
        opposite: {
          className: "flex-none",
        },
      }}
    />
  );
};

export default ApplicationTimeline;
