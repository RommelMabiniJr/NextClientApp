import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DateConverter from "@/lib/dateConverter";
import WorkerNavbar from "@/layout/WorkerNavbar";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import { LocationService } from "@/layout/service/LocationService";
import {
  mapTimelineData,
  structureOfferTimeline,
} from "@/layout/components/utils/timelineUtils";
import { ApplicationTimelineService } from "@/layout/service/ApplicationTimelineService";
import DocumentPreview from "@/layout/components/worker/job-listings/job-application/DocumentPreview";
import ApplicationTimeline from "@/layout/components/worker/job-listings/job-application/ApplicationTimeline";
import { InterviewService } from "@/layout/service/InterviewService";
import { OfferService } from "@/layout/service/OfferService";
import { BookingService } from "@/layout/service/BookingService";

const JobApplicationView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useRef(null);
  const { applicationId, elementId, tabIndex } = router.query;

  // States
  const [timelineData, setTimelineData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [offerData, setOfferData] = useState(null); // Used to store the offer data
  const [offerEvents, setOfferEvents] = useState([]); // Used to store the offer events
  const [offerStatus, setOfferStatus] = useState(null); // Used to store the offer status [accepted, declined, pending, updated]
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState([]); // An array of URLs for the documents
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper functions or constants
  const dateConverter = DateConverter();
  const defaultAvatar = "/layout/profile-default.png";

  // Constants
  const PROVINCE = "LEYTE";
  const offerAction = {
    ACCEPT: "accepted the offer",
    DECLINE: "declined the offer",
    REASON: "declined the offer due to",
  };

  // Use the UTC plugin, as your timestamp is in UTC
  dayjs.extend(utc);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Function to handle navigation back to the job listing
  const handleBack = () => {
    // console.log(router.query);
    const query = {
      elementId: elementId, // Replace with the actual scroll position
      tabIndex: tabIndex, // Replace with the actual selected tab index
    };

    // Navigate back to page1 with URL parameters
    router.push({
      pathname: "/app/worker/job-listings",
      query,
    });
  };

  const handleAcceptOffer = async (item) => {
    confirmDialog({
      message: "Are you sure you want to accept this job offer?",
      header: "Accept Confirmation",
      icon: "pi pi-info-circle",
      position: "bottom",
      accept: async () => {
        const response = await OfferService.acceptOffer(
          applicationDetails.post.job_id,
          applicationId
        );
        console.log(response);

        if (response) {
          // create the event object
          // create the event
          const structuredTimeline = structureOfferTimeline(
            response.offer_id,
            "simple",
            offerAction.ACCEPT,
            session.user
          );

          // Add the event to the timeline
          const eventResponse = ApplicationStageServices.addOfferTimelineEvent(
            applicationId,
            structuredTimeline
          );

          if (eventResponse) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Job offer sent",
              life: 3000,
            });
          }

          // add new timeline event
          const timelineEvent = {
            event_description: "Job Offer Accepted",
            event_timestamp: dayjs.utc().format(),
          };

          // attach to timelineData
          const newTimelineData = [...timelineData, timelineEvent];

          // call mapTimelineData to update the timelineData
          setTimelineData(mapTimelineData(newTimelineData));

          // update the offer status
          setOfferStatus("accepted");

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Job offer accepted",
            life: 3000,
          });
        }
      },
    });
  };

  const handleDeclineOffer = async (selectedReason, declineReason) => {
    confirmDialog({
      message: "Are you sure you want to decline this job offer?",
      header: "Decline Confirmation",
      icon: "pi pi-info-circle",
      position: "bottom",
      accept: async () => {
        const response = await OfferService.declineOffer(applicationId);
        console.log(response);

        if (response) {
          // create the event object
          const declineDetails = structureOfferTimeline(
            response.offer_id,
            "simple",
            offerAction.DECLINE,
            session.user
          );

          // Add the event to the timeline
          await ApplicationStageServices.addOfferTimelineEvent(
            applicationId,
            declineDetails
          );

          // create another event object
          let declineReasonDetails = structureOfferTimeline(
            response.offer_id,
            "detailed",
            offerAction.REASON,
            session.user
          );

          // add a reason to the event object
          // if the reason is "other", add the reason to the object
          if (selectedReason.key === "other") {
            declineReasonDetails.content = declineReason
              ? declineReason
              : "No reason provided";
          } else {
            declineReasonDetails.content = selectedReason.name;
          }

          // Add the event to the timeline
          await ApplicationStageServices.addOfferTimelineEvent(
            applicationId,
            declineReasonDetails
          );

          // add the the two decline events to the offerEvents state
          // const newOfferEvents = [...offerEvents, declineDetails];
          setOfferEvents([
            ...offerEvents,
            declineDetails,
            declineReasonDetails,
          ]);

          // update the offer status
          setOfferStatus("declined");

          toast.current.show({
            severity: "success",
            summary: "Decline Success",
            detail: "Job offer declined",
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong",
            life: 3000,
          });
        }
      },
    });
  };

  useEffect(() => {
    // Function to fetch application details and update state
    const fetchApplicationDetails = async () => {
      try {
        // Fetch application details
        const applicationResponse = await axios.get(
          `${serverUrl}/worker/application/${applicationId}`
        );

        if (applicationResponse.data) {
          const applicationData = applicationResponse.data;

          // Set application details
          setApplicationDetails(applicationData);
          // Set documents
          setDocs(applicationData.workerDocs);

          // Fetch timeline data
          const timelineResponse =
            await ApplicationTimelineService.getApplicationTimeline(
              applicationData.job_id,
              applicationId
            );

          // Map API timeline data to client-side data
          const clientTimelineData = mapTimelineData(timelineResponse);

          // Set timeline data
          setTimelineData(clientTimelineData);

          // Get additional data if the application is in the interview stage
          if (
            clientTimelineData[clientTimelineData.length - 1]
              .event_description === "Interview Scheduled"
          ) {
            const interviewData = await InterviewService.getInterviewDetails(
              applicationData.job_id,
              applicationId
            );

            // console.log("Interview Data: ", interviewData); // [TODO] - remove console.log

            // Set interview data
            setInterviewData(interviewData);
          }

          // Get additional data if the application is in the job offer stage
          if (
            clientTimelineData[clientTimelineData.length - 1]
              .event_description === "Job Offer"
          ) {
            const offerData = await ApplicationStageServices.getOfferDetails(
              applicationData.job_id,
              applicationId
            );

            console.log("Offer Data: ", offerData); // [TODO] - remove console.log
            // Set offer data
            setOfferData(offerData);

            //Set offer status
            setOfferStatus(offerData.status);
          }
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching application details: ", error);
      } finally {
        // Set loading state to false, whether the request was successful or not
        setLoading(false);
      }
    };

    // Check if the application ID is valid
    if (applicationId) {
      // Set loading state to true
      setLoading(true);
      // Fetch application details
      fetchApplicationDetails();
    }
  }, [applicationId]);

  useEffect(() => {
    const fetchOfferEvents = async () => {
      if (!offerData) {
        return;
      }

      const offerTimelineEvents =
        await ApplicationStageServices.getOfferTimelineEvents(
          offerData.offer_id
        );

      if (!offerTimelineEvents) {
        return;
      }

      const structuredOfferTimelineEvents = offerTimelineEvents.map(
        (event) => ({
          offerId: event.offer_id,
          eventType: event.event_type,
          user: event.user,
          profile_url: event.profile_url,
          action: event.action,
          timestamp: event.timestamp,
          content: event.content,
        })
      );

      setOfferEvents(structuredOfferTimelineEvents);
    };

    fetchOfferEvents();
  }, [offerData]);

  if (loading) {
    return (
      <div className="grid justify-center bg-white">
        <div className="col-12 md:col-8">
          <div className="col-11 md:col-10 bg-white p-4 m-4 mx-auto flex flex-column justify-content-between rounded-md border-2 ">
            <div className="flex justify-center">
              <div className="loader">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // render only when application details are fetched
    applicationDetails && (
      <div className="">
        <WorkerNavbar session={session} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="grid justify-center bg-white">
          <div style={{ display: "grid" }} className="col-12 md-8">
            <div className="col-11 md:col-10 bg-white p-4 m-4 mx-auto flex flex-column justify-content-between rounded-md border-2 ">
              {/* <h5 className="ml-2 mb-5">Application Details</h5> */}
              <span className="col-12 flex flex align-items-center mb-4 ">
                <Button
                  icon="pi pi-arrow-left"
                  onClick={handleBack}
                  className="p-button-secondary p-button"
                  // link
                  text
                />
                <h3 className="inline font-bold m-0 ml-4">
                  Viewing Job Application
                </h3>
              </span>
              <div className="content px-8 flex flex-column gap-3">
                <div className="flex items-center">
                  <div className="ml-2 mr-4">
                    <Avatar
                      image={
                        applicationDetails.post.profile_url || defaultAvatar
                      }
                      alt="profile"
                      shape="circle"
                      className="h-5rem w-5rem shadow-2 cursor-pointer"
                    />
                  </div>
                  <div className="">
                    <h5 className="text-3xl mb-2">
                      {applicationDetails.post.job_title}
                    </h5>
                    {/* <p>Application Status: {applicationDetails.application_status}</p> */}
                    <div className="flex flex-wrap">
                      <div className="rate text-lg font-semibold">
                        <span className="text-600 font-medium">By: </span>
                        <span className="ml-2">
                          {applicationDetails.post.first_name}
                        </span>
                      </div>
                      <span className="mx-3"> | </span>
                      <div className="rate text-lg font-semibold">
                        <span className="pi pi-map-marker"></span>
                        <span className="ml-2">
                          {applicationDetails.post.city_municipality}
                        </span>
                      </div>
                      <span className="mx-3"> | </span>
                      <div className="rate text-lg font-semibold">
                        <span className="ml-2">
                          {applicationDetails.distance}
                        </span>
                        <span className="sitance-value"> Kilometers</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11">
                  <div className="grid w-full">
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium">
                        Service Type:{" "}
                      </span>
                      <Tag
                        // icon="pi pi-tag"
                        className="ml-2"
                        value={applicationDetails.post.services[0].service_name}
                      />
                    </div>
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium ">
                        Arrangement:{" "}
                      </span>
                      <Tag
                        className="ml-2"
                        // icon="pi pi-clock"
                        value={
                          applicationDetails.post.job_type
                            .charAt(0)
                            .toUpperCase() +
                          applicationDetails.post.job_type.slice(1)
                        }
                      />
                    </div>
                    <div className="grid w-full">
                      <div className="col mr-4 pl-3 pt-3 flex gap-4">
                        <span className="text-600 font-medium mr-1">
                          Job Dates:{" "}
                        </span>
                        <div className="text-900 font-medium">
                          {dateConverter.toNumbers(
                            applicationDetails.post.job_start_date
                          )}{" "}
                          -{" "}
                          {dateConverter.toNumbers(
                            applicationDetails.post.job_end_date
                          )}
                        </div>
                      </div>
                      <div className="col mr-4 pl-3 pt-3 flex gap-4">
                        <span className="text-600 font-medium mr-1">
                          Working Hours:{" "}
                        </span>
                        <div className="text-900 font-medium">
                          {applicationDetails.working_hours ||
                            "8:00 AM - 5:00PM"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="px-2 pb-4">
                  {applicationDetails.post.job_description}
                </p>
              </div>
              <div className="footer px-8">
                <div className="flex flex-wrap justify-content-start">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      label="Cancel Application"
                      className="p-button-danger p-button"
                      // outlined
                      size="small"
                    />
                    <Button
                      label="Message"
                      // icon="pi pi-envelope"
                      className=" p-button"
                      size="small"
                      severity="secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Timeline */}
            {/* Documents Shared */}
            <div className="col-11 md:col-10 bg-white p-4 m-4 mt-2 mx-auto rounded rounded-md border-2 ">
              <h5 className="ml-2 mb-5">- Attached Documents</h5>
              <div>
                {docs &&
                  docs.map((document, index) => (
                    <div key={index} className="col-12">
                      <div className="border-1 border-round border-400 p-4 flex align-content-center justify-content-between ">
                        <div>
                          <i
                            className="pi pi-link mr-3"
                            style={{ fontSize: "1.3rem" }}
                          ></i>
                          <span className="font-semibold">
                            {/* Capitalize each letter */}
                            {document.type.toUpperCase()}:{" "}
                          </span>
                          {/* <span>Unverified</span> */}
                        </div>
                        <ConfirmPopup />
                        <div>
                          {document.fileUrl && (
                            <a
                              // href={document.fileUrl}
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-500"
                              onClick={(e) => {
                                e.preventDefault();
                                // console.log(document.fileUrl);
                                setSelectedDocUrl(document.fileUrl); // stores an array of URLs
                                setDialogVisible(true);
                              }}
                            >
                              View Document
                              <i className="pi pi-arrow-up-right mx-3 text-base"></i>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Document Preview Dialog */}
              {dialogVisible && (
                <DocumentPreview
                  selectedDocUrl={selectedDocUrl}
                  onClose={() => setDialogVisible(false)}
                />
              )}
            </div>
            <div className="col-11 md:col-10 bg-white p-4 m-4 mt-2 mx-auto rounded-md border-2 ">
              <h5 className="ml-2 mb-5">- Application Progress</h5>
              <ApplicationTimeline
                applicationId={applicationId}
                offerEvents={offerEvents}
                offerStatus={offerStatus}
                timelineData={timelineData}
                handleAcceptOffer={handleAcceptOffer}
                handleDeclineOffer={handleDeclineOffer}
                offerData={offerData}
                interviewData={interviewData}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default JobApplicationView;
