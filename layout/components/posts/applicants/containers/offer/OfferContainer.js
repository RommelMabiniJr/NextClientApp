import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // Import Toast component
import { Dialog } from "primereact/dialog";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { structureOfferTimeline } from "@/layout/components/utils/timelineUtils";
import { InterviewService } from "@/layout/service/InterviewService";
import { OfferService } from "@/layout/service/OfferService";
import JobOverview from "./subcomp/JobOverview";
import OfferDetails from "./subcomp/OfferDetails";
import { JobsService } from "@/layout/service/JobsService";
import { JobPostService } from "@/layout/service/JobPostService";
import CandidSelect from "./subcomp/CandidSelect";
import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import OfferTimeline from "./subcomp/OfferTimeline";

const OfferContainer = ({ postId, applicants, interviewResults, session }) => {
  // console.log("session", session);
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

  const [postDetails, setPostDetails] = useState({}); // Details of the job post [title, description, etc.
  const [hasExistingOffer, setHasExistingOffer] = useState(false); // Check if there is an existing offer for the selected candidate
  const [offerEvents, setOfferEvents] = useState([]);
  const [candidatePool, setCandidatePool] = useState(interviewResults); // Pool is from the completed interviews
  const [selectedCandidate, setSelectedCandidate] = useState(); // Default to the first applicant in the list
  const [selectionVisible, setSelectionVisible] = useState(false); // For the dialog to select the best candidate
  const [sidebarVisible, setSidebarVisible] = useState(false); // For the sidebar
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [benefitInput, setBenefitInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [offerStatus, setOfferStatus] = useState("no offer"); // Status of the offer [pending, accepted, rejected, expired, no offer]

  const [loading, setLoading] = useState(false);

  const toast = useRef(null); // Reference to the Toast component
  const deadlineOptions = [
    { name: "1 day", value: "1" },
    { name: "2 days", value: "2" },
    { name: "3 days", value: "3" },
    { name: "4 days", value: "4" },
    { name: "5 days", value: "5" },
    { name: "6 days", value: "6" },
    { name: "7 days", value: "7" },
  ];
  const payFrequencyOptions = [
    { name: "Daily", value: "Daily" },
    { name: "Weekly", value: "Weekly" },
    {
      name: "Bi-weekly (every two weeks)",
      value: "Bi-weekly (every two weeks)",
    },
    {
      name: "Semi-monthly (twice a month)",
      value: "Semi-monthly (twice a month)",
    },
    { name: "Monthly", value: "Monthly" },
    {
      name: "Quarterly (every three months)",
      value: "Quarterly (every three months)",
    },
    {
      name: "Semi-annually (twice a year)",
      value: "Semi-annually (twice a year)",
    },
    { name: "Annually", value: "Annually" },
  ];

  const onEditJobDetails = () => {
    // do nothing for now
  };
  const handleSendOffer = async (applicant) => {
    setLoading(true);
    const result = await ApplicationStageServices.sendOffer(
      postId,
      applicant.application_id,
      tempOfferDetails
    );

    // console.log("Result:", result);

    if (result) {
      // create the event
      const timelineEvent = structureOfferTimeline(
        result.offer_id,
        "simple",
        "sent an offer to candidate",
        session.user
      );

      // Add the event to the timeline
      const eventResponse =
        await ApplicationStageServices.addOfferTimelineEvent(
          applicant.application_id,
          timelineEvent
        );

      if (eventResponse) {
        // Add the event to the timeline
        addTimelineEvent(timelineEvent);
      }

      setLoading(false);
      setIsEditMode(false);
      setHasExistingOffer(true);

      // update the offer status
      setOfferStatus("pending");

      // Show notification for successful offer submission
      showNotification("success", "Offer submitted successfully!");
    } else {
      // Show notification for failed offer submission
      showNotification("error", "Something went wrong. Please try again.");
    }
  };

  const onBestCandidateSelect = async (applicant) => {
    let result = ApplicationStageServices.setPassedInterview(
      postId,
      applicant.application_id
    );

    if (result) {
      await fetchOfferDetails(applicant);
      await handleSendOffer(applicant);

      setSelectedCandidate(applicant);
      setSelectionVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Best candidate has been selected.",
        life: 3000,
      });

      // reload the page
      // window.location.reload();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const result = await OfferService.updateOffer(
      postId,
      selectedCandidate.application_id,
      tempOfferDetails
    );

    if (result) {
      // create the event
      const timelineEvent = structureOfferTimeline(
        result.offer_id,
        "simple",
        "updated the offer details",
        session.user
      );

      // Add the event to the timeline
      const eventResponse =
        await ApplicationStageServices.addOfferTimelineEvent(
          selectedCandidate.application_id,
          timelineEvent
        );

      if (eventResponse) {
        // Add the event to the timeline
        addTimelineEvent(timelineEvent);
      }

      setLoading(false);
      setIsEditMode(false);
      setHasExistingOffer(true);

      // update the offer status
      setOfferStatus("updated");

      // Show notification for successful offer submission
      showNotification("success", "Offer updated successfully!");
    } else {
      // Show notification for failed offer submission
      showNotification("error", "Something went wrong. Please try again.");
    }
  };

  const handleSelectCandidate = () => {
    setSelectionVisible(true);
  };

  // Function to display the Toast notification
  const showNotification = (severity, detail) => {
    toast.current.show({
      severity,
      summary: "Notification",
      detail,
      life: 3000,
    });
  };

  const addTimelineEvent = (event) => {
    setOfferEvents((prevEvents) => [...prevEvents, event]);
  };

  const EmptyBestCandidate = () => {
    return (
      <div
        onClick={handleSelectCandidate}
        className="mt-2 mb-1 flex align-center gap-4 text-left w-full rounded-md text-lg px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold leading-6 text-gray-800 cursor-pointer"
      >
        <div className="my-auto">
          <span className="pi pi-plus rounded-full bg-gray-600 p-3"></span>
        </div>
        <div>
          <span className="m-0 font-medium">Select a Candidate</span>
          <p className="m-0 text-sm font-light leading-6 text-gray-500">
            No best candidate selected.
          </p>
        </div>
      </div>
    );
  };

  dayjs.extend(relativeTime);

  useEffect(() => {
    if (!applicants || !postId) {
      // ensure that applicants and postId are not null
      return;
    }

    const fetchScheduledInterviews = async () => {
      const scheduledInterviews = await InterviewService.getScheduledInterviews(
        postId
      );

      // attach the interview details to the applicants
      const applicantsWithInterviewDetails = scheduledInterviews.map(
        (schedInt) => {
          // find the index of the interview details
          const index = applicants.findIndex(
            (interview) => interview.application_id === schedInt.application_id
          );

          // if the applicant has an interview, attach the interview details
          const interview = {
            date: schedInt.scheduled_date,
            time: schedInt.scheduled_time,
            link: schedInt.interview_link,
            status: schedInt.status,
          };

          // attach the interview details to the applicant
          const structuredApplicant = applicants[index];

          structuredApplicant.interview = interview;

          // console.log("Structured Applicant:", structuredApplicant);

          return structuredApplicant;
        }
      );

      setCandidatePool(applicantsWithInterviewDetails);
    };

    const fetchPassedCandidate = async () => {
      const interviewDetails =
        await ApplicationStageServices.getPassedInterview(postId);

      // console.log("Interview Details:", interviewDetails);

      // check if there is a passed candidate
      if (!interviewDetails) {
        return;
      }

      // find the index of the passed candidate
      const index = applicants.findIndex(
        (applicant) =>
          applicant.application_id === interviewDetails.application_id
      );

      // get the passed candidate
      const passedCandidate = applicants[index];

      // attach interview details to the passed candidate
      passedCandidate.interview = {
        date: interviewDetails.scheduled_date,
        time: interviewDetails.scheduled_time,
        link: interviewDetails.interview_link,
        status: interviewDetails.status,
        isPassed: interviewDetails.is_passed,
      };

      // set the selected candidate to the passed candidate
      setSelectedCandidate(passedCandidate);
      fetchOfferDetails(passedCandidate);
    };

    const fetchPostDetails = async () => {
      const response = await JobPostService.getJobPostFull(postId);
      if (response.status === 200) {
        setPostDetails(response.data);
      }
    };

    fetchScheduledInterviews();
    fetchPassedCandidate();
    fetchPostDetails();
  }, [applicants, postId]);

  const fetchOfferDetails = async (offeredCandid) => {
    if (!offeredCandid) {
      return;
    }

    const response_offerDetails =
      await ApplicationStageServices.getOfferDetails(
        postId,
        offeredCandid.application_id
      );

    if (!response_offerDetails) {
      setHasExistingOffer(false);
      setIsEditMode(true); // Enable edit mode to allow the user to create an offer and automatically send it to the candidate
      return;
    }

    let structuredOfferDetails = {
      salary: response_offerDetails.salary,
      deadline: response_offerDetails.deadline,
      payFrequency: response_offerDetails.pay_frequency,
      benefits: response_offerDetails.benefits,
    };

    // console.log("Offer Details:", response_offerDetails);

    setOfferDetails(structuredOfferDetails);
    setTempOfferDetails(structuredOfferDetails);
    setHasExistingOffer(true);
    setIsEditMode(false); // Disable edit mode to prevent the user from editing the offer details

    // update the offer status
    setOfferStatus(response_offerDetails.status);

    const offerTimelineEvents =
      await ApplicationStageServices.getOfferTimelineEvents(
        response_offerDetails.offer_id
      );

    if (!offerTimelineEvents) {
      return;
    }

    const structuredOfferTimelineEvents = offerTimelineEvents.map((event) => ({
      offerId: event.offer_id,
      eventType: event.event_type,
      user: event.user,
      profile_url: event.profile_url,
      action: event.action,
      timestamp: event.timestamp,
      content: event.content,
    }));

    setOfferEvents(structuredOfferTimelineEvents);
  };

  const toggleTemplate = (options) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} px-1 justify-start items-center bg-white border-none`;
    const titleClassName = `${options.titleClassName} ml-2 text-primary`;
    const style = { fontSize: "1.25rem" };

    return (
      <div className={className}>
        <h2 className="text-lg font-semibold m-0">Interviewed </h2>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          {/* <Ripple /> */}
        </button>
      </div>
    );
  };

  const renderOfferBadge = (offerStatus) => {
    let badgeClass = "bg-gray-50";
    let badgeText = "Pending"; // Default status text

    switch (offerStatus) {
      case "accepted":
        badgeClass = "bg-green-50 text-green-700 ring-green-600/20";
        badgeText = "Accepted";
        break;
      case "declined":
        badgeClass = "bg-red-50 text-red-700 ring-red-600/10";
        badgeText = "Rejected";
        break;
      case "updated":
        badgeClass = "bg-blue-50 text-blue-700 ring-blue-600/10";
        badgeText = "Updated";
        break;
      case "no response":
        badgeClass = "bg-gray-50 text-gray-600 ring-gray-600/10";
        badgeText = "Expired";
        break;
      case "pending":
        badgeClass = "bg-yellow-50 text-yellow-800 ring-yellow-500/10";
        badgeText = "Pending";
        break;

      // Add more cases as needed

      // Default case for pending or other statuses
      default:
        badgeClass = "bg-gray-50 text-gray-600 ring-gray-500/10";
        badgeText = "No Offer";
    }

    return (
      <span
        className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeClass} ring-1 ring-inset ring-gray-500/10`}
      >
        {badgeText}
      </span>
    );
  };

  return (
    <div className="divide-y">
      <div className="mb-4">
        <Toast ref={toast} position="bottom-right" />
        <div className="flex items-center justify-between gap-2 mb-4 w-full">
          <h2 className="text-lg font-semibold m-0">
            Chosen Candidate: {renderOfferBadge(offerStatus)}
          </h2>

          <span
            className="cursor-pointer rounded-md hover:bg-gray-200 px-2"
            onClick={() => setSidebarVisible(true)}
          >
            <i className="pi pi-history"></i>
          </span>
          <OfferTimeline
            offerEvents={offerEvents}
            session={session}
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
          />
        </div>
        {selectedCandidate ? (
          <div className="rounded-lg flex items-center py-3 px-3 border-2 border-primary-300 ">
            <div className="applicant-container flex flex-column md:flex-row md:items-center justify-between flex-1">
              <div className="applicant-info flex items-center ">
                <img
                  className="h-12 flex-none rounded-full bg-gray-50 mr-3"
                  src={selectedCandidate.information.profile_url}
                  alt=""
                />
                <div className="mr-3">
                  <h3 className="text-lg font-medium mb-0 m-0">
                    {selectedCandidate.information.first_name}{" "}
                    {selectedCandidate.information.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 ">
                    {selectedCandidate.information.email}
                  </p>
                </div>
              </div>
              <div className="applicant-action mt-2 md:mt-0">
                <Button
                  onClick={handleSelectCandidate}
                  type="button"
                  size="small"
                  severity="primary"
                  label="Change Candidate"
                  className="py-2 mr-2"
                  // outlined
                />
              </div>
            </div>
          </div>
        ) : (
          <EmptyBestCandidate />
        )}
        <Dialog
          header="Select Candidate from Completed Interviews"
          visible={selectionVisible}
          onHide={() => setSelectionVisible(false)}
          className="md:w-1/2"
        >
          {candidatePool
            .filter((applicant) => applicant.interview.status === "completed")
            .map((applicant) => {
              return (
                <div
                  key={applicant.application_id}
                  className="flex items-center gap-x-4 py-4"
                  // onClick={() => setBestCandidate(applicant)}
                >
                  <img
                    className="h-12 flex-none rounded-full bg-gray-50"
                    src={applicant.information.profile_url}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <span className="flex flex-column">
                      <p className="m-0 mr-2 text-base font-semibold leading-6 text-gray-900">
                        {applicant.information.first_name +
                          " " +
                          applicant.information.last_name}
                      </p>
                      <span className="truncate text-xs leading-5 text-gray-500 align-middle">
                        {applicant.information.email}
                      </span>
                    </span>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-right">
                    {/* Change Button */}
                    <span
                      onClick={() => onBestCandidateSelect(applicant)}
                      className="rounded-md text-sm px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold leading-6 text-gray-800 cursor-pointer"
                    >
                      Change
                    </span>
                  </div>
                </div>
              );
            })}
        </Dialog>
      </div>
      <div className="flex flex-column md:flex-row gap-x-10 ">
        <JobOverview
          session={session}
          job={postDetails}
          onEditJobDetails={onEditJobDetails}
        />
        <div className="w-full md:w-4">
          <Panel
            header="Interviewed"
            toggleable
            className="border-none"
            headerTemplate={toggleTemplate}
            pt={{
              content: { className: "bg-white border-none px-4" },
            }}
          >
            <div className="divide-y">
              {/* <h2 className="text-lg font-semibold mb-4 mt-0">Interviewed </h2> */}
              {candidatePool
                .filter(
                  (applicant) => applicant.interview.status === "completed"
                )
                .map((applicant) => {
                  return (
                    <div
                      key={applicant.application_id}
                      className="flex items-center gap-x-4 py-3"
                    >
                      <img
                        className="h-12 flex-none rounded-full bg-gray-50"
                        src={applicant.information.profile_url}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <span className="flex flex-column">
                          <p className="m-0 mr-2 text-base font-semibold leading-6 text-gray-900">
                            {applicant.information.first_name +
                              " " +
                              applicant.information.last_name}
                          </p>
                          <span className="truncate text-xs leading-5 text-gray-500 align-middle">
                            {applicant.information.email}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Panel>
        </div>
        {/* <OfferDetails
          offerDetails={offerDetails}
          tempOfferDetails={tempOfferDetails}
          offerStatus={offerStatus}
          isEditMode={isEditMode}
          setTempOfferDetails={setTempOfferDetails}
          setIsEditMode={setIsEditMode}
          handleSendOffer={handleSendOffer}
          handleUpdate={handleUpdate}
          hasExistingOffer={hasExistingOffer}
          offerEvents={offerEvents}
          session={session}
        /> */}
      </div>
    </div>
  );
};

export default OfferContainer;
