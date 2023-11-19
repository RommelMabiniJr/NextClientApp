import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast"; // Import Toast component
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import OfferTimeline from "./subcomp/OfferTimeline";
import { structureOfferTimeline } from "@/layout/components/utils/timelineUtils";

const OfferContainer = ({ postId, applicants, interviewResults, session }) => {
  // console.log("session", session);
  const [offerDetails, setOfferDetails] = useState({
    salary: "",
    benefits: "",
    deadline: "",
    payFrequency: "",
  });
  const [hasExistingOffer, setHasExistingOffer] = useState(false); // Check if there is an existing offer for the selected candidate
  const [offerEvents, setOfferEvents] = useState([]);
  const [candidatePool, setCandidatePool] = useState(interviewResults); // Pool is from the completed interviews
  const [selectedCandidate, setSelectedCandidate] = useState(); // Default to the first applicant in the list
  const [selectionVisible, setSelectionVisible] = useState(false); // For the dialog to select the best candidate
  const [sidebarVisible, setSidebarVisible] = useState(false); // For the sidebar
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [benefitInput, setBenefitInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [offerStatus, setOfferStatus] = useState("accepted"); // Status of the offer [pending, accepted, rejected, expired, no offer]

  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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

  const onBestCandidateSelect = (applicant) => {
    let result = ApplicationStageServices.setPassedInterview(
      postId,
      applicant.application_id
    );

    if (result) {
      setSelectedCandidate(applicant);
      setSelectionVisible(false);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Best candidate has been selected.",
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };
  const handleSave = () => {
    setIsEditMode(false);
    // Additional logic to save the edited details
  };
  const handleCancel = () => {
    setIsEditMode(false);
    // Additional logic to cancel the edit and revert changes
  };
  const handleUpdate = async () => {
    return;
  };

  const handleSendOffer = async () => {
    setLoading(true);
    const result = await ApplicationStageServices.sendOffer(
      postId,
      selectedCandidate.application_id,
      offerDetails
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
      const eventResponse = ApplicationStageServices.addOfferTimelineEvent(
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

      // Show notification for successful offer submission
      showNotification("success", "Offer submitted successfully!");
    } else {
      // Show notification for failed offer submission
      showNotification("error", "Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (e, name) => {
    // console.log(e.target.value);
    const { value } = e.target;
    setOfferDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBenefitAdd = () => {
    // Get the current value from the input
    const newBenefit = document.getElementById("benefitInput").value;

    // Check if the input is not empty
    if (newBenefit.trim() !== "") {
      setOfferDetails((prevDetails) => ({
        ...prevDetails,
        benefits: [...prevDetails.benefits, newBenefit.trim()],
      }));

      // Clear the input
      document.getElementById("benefitInput").value = "";
    }
  };

  const handleDeadlineChange = (e) => {
    // console.log(e.target.value);
    const { value } = e.target;
    setOfferDetails((prevDetails) => ({ ...prevDetails, deadline: value }));
  };

  const handlePayFrequencyChange = (e) => {
    const { value } = e.target;
    setOfferDetails((prevDetails) => ({ ...prevDetails, payFrequency: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle offer submission, e.g., send details to the backend
    console.log("Offer Details:", offerDetails);

    // Show notification for successful offer submission
    showNotification("success", "Offer submitted successfully!");
  };

  const handleSelectCandidate = () => {
    // setSelectedCandidate(applicant);
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

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(salary);
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

  const renderOfferBadge = (offerStatus) => {
    let badgeClass = "bg-gray-50";
    let badgeText = "Pending"; // Default status text

    switch (offerStatus) {
      case "accepted":
        badgeClass = "bg-green-50 text-green-700 ring-green-600/20";
        badgeText = "Accepted";
        break;
      case "rejected":
        badgeClass = "bg-red-50 text-red-700 ring-red-600/10";
        badgeText = "Rejected";
        break;
      case "expired":
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

  dayjs.extend(relativeTime);

  useEffect(() => {
    if (!applicants || !postId) {
      // ensure that applicants and postId are not null
      return;
    }

    const fetchScheduledInterviews = async () => {
      const scheduledInterviews =
        await ApplicationStageServices.getScheduledInterviews(postId);

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

      console.log("Offer Details:", response_offerDetails);

      setOfferDetails(structuredOfferDetails);
      setHasExistingOffer(true);

      const offerTimelineEvents =
        await ApplicationStageServices.getOfferTimelineEvents(
          response_offerDetails.offer_id
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
        })
      );

      setOfferEvents(structuredOfferTimelineEvents);
    };

    fetchScheduledInterviews();
    fetchPassedCandidate();
  }, [applicants, postId]);

  const handleSelectApplicant = (action) => {
    if (action === "prev") {
      setCurrentCandidateIndex((prevIndex) => prevIndex - 1);
      setSelectedCandidate(applicants[currentCandidateIndex - 1]);
    } else if (action === "next") {
      setCurrentCandidateIndex((prevIndex) => prevIndex + 1);
      setSelectedCandidate(applicants[currentCandidateIndex + 1]);
    }
  };

  return (
    <div className="divide-y">
      <div className="mb-4 ">
        <Toast ref={toast} position="bottom-right" />
        <h2 className="text-xl font-semibold mb-4 mt-0">Chosen Candidate </h2>
        {selectedCandidate ? (
          <div className="flex items-center gap-x-4">
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
                  severity="warning"
                  label="Change Candidate"
                  className="py-2 mr-2"
                  // outlined
                />
              </div>
            </div>
            {/* <div>
              <Button
                size="small"
                type="button"
                icon="pi pi-chevron-left"
                className="p-button-secondary"
                text
                onClick={() => handleSelectApplicant("prev")}
                // disabled={currentCandidateIndex === 0}
              />
              <Button
                size="small"
                type="button"
                icon="pi pi-chevron-right"
                className="p-button-secondary"
                text
                onClick={() => handleSelectApplicant("next")}
                // disabled={currentCandidateIndex === applicants.length - 1}
              />
            </div> */}
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
        <div className="flex-1 mt-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Job Overview</h3>
          </div>
          <div className="mb-4">
            <h3 className="text-sm text-primary-400 font-medium mb-2">Title</h3>
            <p className="text-xl font-medium m-0 mb-1">
              Part-time Nanny for 2 children
            </p>
            <div className="">
              <Tag value="Part-time" className="mr-2 text-xs"></Tag>
              <Tag
                value="Child Care"
                className=" text-xs"
                severity="warning"
              ></Tag>
            </div>
          </div>
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Description
          </h3>
          <p className="text-sm font-base mb-4 text-justify">
            We are looking for a part-time nanny for our 2 children. We are
            looking for someone who can work 3 days a week from 8am to 5pm. We
            are looking for someone who can help with light housework and meal
            preparation for the children.
          </p>
          <div style={{ display: "grid" }} className="grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Location
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-map-marker mr-2"></span> */}
                  General Luna St, Buntay, Abuyog, Leyte
                </p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Arrangement
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-calendar mr-2"></span> */}
                  Live-in with shared room
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "grid" }} className="grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Dates
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-calendar mr-2"></span> */}
                  October 1 - November 30, 2021
                </p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Working Hours
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-clock mr-2"></span> */}
                  8am - 5pm
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-6 lg:w-5 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium mb-2">
              Offer Status: {renderOfferBadge(offerStatus)}
            </h3>
            <span
              className="cursor-pointer rounded-md hover:bg-gray-200 py-2 px-3"
              onClick={() => setSidebarVisible(true)}
            >
              <i className="pi pi-history"></i>
            </span>
          </div>
          <div className="Offer-Section mt-2">
            {!isEditMode ? (
              <div>
                <div style={{ display: "grid" }} className="grid-cols-2 mb-4">
                  <div className="flex-1 mr-4 ">
                    <label className="text-sm text-primary-400 font-medium mb-2">
                      Deadline:
                    </label>
                    <div className="py-2">
                      {offerDetails.deadline ? (
                        <span className="text-lg font-bold text-grey-600">
                          {offerDetails.deadline} day(s) from now
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-gray-600">
                          No deadline set
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-primary-400 font-medium mb-2">
                      Proposed Salary {"(PHP)"}:
                    </label>
                    <div className="py-2 font-bold">
                      {offerDetails.salary ? (
                        <span className="text-lg font-bold text-grey-600">
                          {formatSalary(offerDetails.salary)}
                        </span>
                      ) : (
                        <span className="text-lg font-medium text-gray-400">
                          No salary set
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-primary-400 font-medium mb-2">
                    Payment Frequency
                  </label>
                  <div className="py-2">
                    {offerDetails.payFrequency ? (
                      <span className="text-lg font-bold text-grey-600">
                        {offerDetails.payFrequency}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        No payment frequency set
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Benefits
                  </label>
                  <div className="mb-3">
                    <ul className="">
                      {offerDetails.benefits ? (
                        offerDetails.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="text-base text-gray-700 mb-1 m-2 ml-4 "
                            style={{ listStyleType: "disc" }}
                            // disabled={!isEditMode}
                          >
                            <div className="flex items-center justify-between">
                              <span className="mr-2">{benefit}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <span className="text-lg text-gray-600">
                          No benefits set
                        </span>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center w-full gap-2">
                  <Button
                    type="button"
                    outlined
                    label="Edit Offer"
                    className="p-button-secondary w-full flex-1"
                    onClick={handleEdit}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex w-full mb-4">
                  <div className="mr-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <Dropdown
                      value={offerDetails.deadline}
                      onChange={(e) => handleDeadlineChange(e)}
                      options={deadlineOptions}
                      optionLabel="name"
                      placeholder="Select a Deadline"
                      className="w-full mt-2"
                      // disabled={!isEditMode}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Proposed Salary {"(PHP)"}
                    </label>
                    <InputNumber
                      inputId="currency-ph"
                      value={offerDetails.salary}
                      onValueChange={(e) => handleInputChange(e, "salary")}
                      mode="currency"
                      currency="PHP"
                      locale="en-US"
                      className="mt-2 rounded-md w-full"
                      placeholder="e.g. 15,000"
                      // disabled={!isEditMode}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Frequency
                  </label>
                  <Dropdown
                    value={offerDetails.payFrequency}
                    onChange={(e) => handlePayFrequencyChange(e)}
                    options={payFrequencyOptions}
                    optionLabel="name"
                    placeholder="Select a Deadline"
                    className="w-full mt-2"
                    // disabled={!isEditMode}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Benefits
                  </label>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Separate benefits by pressing Add Button
                    </p>
                  </div>
                  <div className="mb-3">
                    <ul className="pl-5">
                      {offerDetails.benefits &&
                        offerDetails.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="text-base text-gray-700 mb-1 m-2"
                            style={{ listStyleType: "disc" }}
                            // disabled={!isEditMode}
                          >
                            <div className="flex items-center justify-between">
                              <span className="mr-2">{benefit}</span>
                              <Button
                                text
                                type="button"
                                size="small"
                                // disabled={!isEditMode}
                                className="pi pi-trash text-red-800 cursor-pointer"
                                onClick={() => {
                                  setOfferDetails((prevDetails) => ({
                                    ...prevDetails,
                                    benefits: prevDetails.benefits.filter(
                                      (b) => b !== benefit
                                    ),
                                  }));
                                }}
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="flex">
                    <InputText
                      id="benefitInput"
                      className="mt-1 border border-gray-300 rounded-md w-full"
                      // disabled={!isEditMode}
                    />
                    <Button
                      type="button"
                      // label="Add"
                      icon="pi pi-plus"
                      className="ml-2 w-4rem"
                      onClick={handleBenefitAdd}
                      // disabled={!isEditMode}
                    />
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  {hasExistingOffer ? (
                    <div className="flex w-full">
                      <Button
                        type="button"
                        label="Update"
                        className="p-button-primary mr-2 w-8rem flex-1"
                        onClick={handleUpdate}
                      />
                      <Button
                        type="button"
                        label="Cancel"
                        className="p-button-secondary w-8rem flex-1"
                        onClick={handleCancel}
                      />
                    </div>
                  ) : (
                    <div className="flex w-full">
                      <Button
                        type="button"
                        label="Submit Offer"
                        className="p-button-primary w-full"
                        onClick={handleSendOffer}
                      />
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          <Sidebar
            position="right"
            className="w-full md:w-8 lg:w-6"
            visible={sidebarVisible}
            onHide={() => setSidebarVisible(false)}
          >
            <OfferTimeline offerEvents={offerEvents} session={session} />
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default OfferContainer;
