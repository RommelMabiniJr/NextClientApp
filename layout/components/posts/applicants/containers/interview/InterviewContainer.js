import { Calendar } from "primereact/calendar";
import { Rating } from "primereact/rating";
import { useState, useRef, useEffect } from "react";
import DateConverter from "@/lib/dateConverter";
import * as dayjs from "dayjs";
import Link from "next/link";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import styles from "./InterviewContainer.module.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { VirtualScroller } from "primereact/virtualscroller";
import { classNames } from "primereact/utils";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import { ScreeningService } from "@/layout/service/ScreeningService";
import { InterviewService } from "@/layout/service/InterviewService";
import { SelectButton } from "primereact/selectbutton";

export default function InterviewContainer({
  applicants,
  postId,
  session,
  distances,
  setInterviewResults,
  setHasInterview,
}) {
  const MAX_VISIBLE_ITEMS = 3;
  const [bestCandidate, setBestCandidate] = useState();
  const [completedApplicants, setCompletedApplicants] = useState([]); // TODO: filter applicants based on interview date and time
  const [scheduledApplicants, setScheduledApplicants] = useState([]); // TODO: filter applicants based on interview date and time
  const [unScheduledApplicants, setUnScheduledApplicants] = useState([]); // TODO: filter applicants based on interview date and time
  const [nonInterviewedApplicants, setNonInterviewedApplicants] = useState([]); // TODO: filter applicants based on interview date and time
  const [interviewedApplicants, setInterviewedApplicants] = useState([]); // TODO: filter applicants based on interview date and time
  const [visibleApplicants, setVisibleApplicants] = useState(
    applicants.slice(0, MAX_VISIBLE_ITEMS)
  ); // TODO: filter applicants based on interview date and time
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLink, setInterviewLink] = useState("");

  const [candidateForInterview, setCandidateForInterview] = useState(null);
  const [candidateForCancel, setCandidateForCancel] = useState(null);
  const [candidateForComplete, setCandidateForComplete] = useState(null);

  const [scheduleIntVisible, setScheduleIntVisible] = useState(false);
  const [bestCandidateVisible, setBestCandidateVisible] = useState(false);
  const [currentView, setCurrentView] = useState("scheduled"); // Default to "scheduled"

  const [showAll, setShowAll] = useState(false);
  const [interviewType, setInterviewType] = useState("Google Meet");

  const dateConverter = DateConverter();
  const op = useRef(null);
  const menuRef = useRef(null);
  const toastRef = useRef(null);

  const applicantMenuItems = [
    {
      label: "Mark Complete",
      icon: "pi pi-check",
      command: () => {
        onCompleteInterview();
      },
    },
    {
      label: "Cancel Interview",
      icon: "pi pi-times",
      command: () => {
        onCancelInterview();
      },
    },
    {
      label: "View Profile",
      icon: "pi pi-user",
    },
  ];

  const completedMenuItems = [
    {
      label: "Cancel Completion",
      icon: "pi pi-times",
      command: () => {
        onCancelInterview();
      },
    },
    {
      label: "View Profile",
      icon: "pi pi-user",
    },
  ];

  const interviewCallOptions = [
    { icon: "pi pi-google", value: "Google Meet" },
    { icon: "pi pi-video", value: "KasambahayKo" },
  ];

  const handleBestCandidateChange = () => {
    setBestCandidateVisible(true);
  };

  const handleDateChange = (event) => {
    setInterviewDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setInterviewTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle form submission
  };

  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  const handleInterviewTypeChange = () => {
    console.log(candidateForInterview);

    // toggle interview type
    setInterviewType((prevType) =>
      prevType === "Google Meet" ? "KasambahayKo" : "Google Meet"
    );

    // reset interview link
    setInterviewLink("");

    // if kasambahayko, set interview link to kasambahayko link
    if (interviewType === "Google Meet") {
      const ranId = randomID(6);

      // generate a unique link for the interview
      const link = `${process.env.NEXT_PUBLIC_KASAMBAHAYKO_URL}/app/interview/${ranId}`;

      setInterviewLink(link);
    }
  };
  const handleMenuRef = (event, candidate) => {
    // console.log("Canceling interview for: ", index);
    setCandidateForCancel(candidate);
    setCandidateForComplete(candidate);
    menuRef.current.toggle(event);
  };

  const onCancelInterview = () => {
    // console.log("Canceling interview for: ", candidateForCancel);

    let result = ApplicationStageServices.deleteInterviewSchedule(
      postId,
      candidateForCancel.application_id
    );

    if (result) {
      // check if interview is the best candidate
      if (
        bestCandidate &&
        bestCandidate.application_id === candidateForCancel.application_id
      ) {
        setBestCandidate(null);
      }

      // remove applicant from scheduled applicants
      const newScheduledApplicants = scheduledApplicants.filter(
        (scheduledApplicant) =>
          scheduledApplicant.information.email !==
          candidateForCancel.information.email
      );
      setScheduledApplicants(newScheduledApplicants);

      // add applicant to unscheduled applicants
      setUnScheduledApplicants([...unScheduledApplicants, candidateForCancel]);

      // reset candidate for cancel
      setCandidateForCancel(null);

      // if there is no at least one completed interview, disallow moving to next stage
      if (
        !scheduledApplicants.some(
          (applicant) => applicant.interview.status === "completed"
        )
      ) {
        setHasInterview(false);
      }

      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Interview has been canceled.",
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const onCompleteInterview = () => {
    // console.log("Completing interview for: ", candidateForCancel);

    let result = ApplicationStageServices.markInterviewAsCompleted(
      postId,
      candidateForComplete.application_id
    );

    if (result) {
      // find applicant in scheduled applicants
      const candidateIndex = scheduledApplicants.findIndex(
        (scheduledApplicant) =>
          scheduledApplicant.information.email ===
          candidateForComplete.information.email
      );

      // update applicant status
      scheduledApplicants[candidateIndex].interview.status = "completed";

      // send interview results to parent
      setInterviewResults(scheduledApplicants);

      // reset candidate for cancel
      setCandidateForComplete(null);

      // allow moving to next stage if at least one interview has been completed
      setHasInterview(true);

      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Interview has been marked as complete.",
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const onBestCandidateSelect = (applicant) => {
    let result = ApplicationStageServices.setPassedInterview(
      postId,
      applicant.application_id
    );

    if (result) {
      setBestCandidate(applicant);
      setBestCandidateVisible(false);

      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Best candidate has been selected.",
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const onResetBestCandidate = () => {
    if (!bestCandidate) return; // check if there is a best candidate

    const result = ApplicationStageServices.resetPassedInterview(
      postId,
      bestCandidate.application_id
    );

    if (result) {
      setBestCandidate(null);

      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Best candidate has been reset.",
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const toggleVisibility = () => {
    if (showAll) {
      setVisibleApplicants(scheduledApplicants.slice(0, MAX_VISIBLE_ITEMS));
    } else {
      setVisibleApplicants(scheduledApplicants);
    }
    setShowAll(!showAll);
  };

  const toggleView = () => {
    setCurrentView((prevView) =>
      prevView === "scheduled" ? "completed" : "scheduled"
    );
  };

  const getMinimumDate = () => {
    // Calculate the minimum date (today)
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    return minDate;
  };

  /**
   * Formats the interview time for display.
   *
   * @param {string | Date} time - The interview time, either as a string in "HH:mm:ss" format or a Date object.
   * @returns {string} - The formatted time in "h:mm A" format.
   */
  const formatInterviewTime = (time) => {
    if (typeof time === "string") {
      return dayjs(`2023-11-09T${time}`).format("h:mm A");
    } else {
      return dayjs(time).format("h:mm A");
    }
  };

  /**
   * Returns an object with structured interview data based on the provided scheduled applicant.
   *
   * @param {Object} scheduledApplicant - The scheduled applicant object.
   * @param {string} scheduledApplicant.scheduled_date - The scheduled date of the interview.
   * @param {string} scheduledApplicant.scheduled_time - The scheduled time of the interview.
   * @param {string} scheduledApplicant.interview_link - The link to the interview.
   * @param {string} scheduledApplicant.status - The status of the interview.
   * @param {boolean} scheduledApplicant.is_passed - Whether the interview has passed or not.
   * @returns {Object} An object with structured interview data.
   */
  function structureInterviewData(scheduledApplicant) {
    return {
      date: scheduledApplicant.scheduled_date,
      time: scheduledApplicant.scheduled_time,
      link: scheduledApplicant.interview_link,
      status: scheduledApplicant.status,
      isPassed: scheduledApplicant.is_passed,
    };
  }

  const fetchScheduledApplicants = async () => {
    if (!postId && !applicants && applicants.length === 0) {
      return;
    }

    // Fetch the latest scheduled applicants from the database/API
    const schedApplicants = await InterviewService.getScheduledInterviews(
      postId
    ); // This only returns interview date details

    // assign applicants information to scheduled applicants
    // assign interview date and time to applicants
    schedApplicants.forEach((scheduledApplicant, index) => {
      const applicant = applicants.find(
        (applicant) =>
          applicant.application_id === scheduledApplicant.application_id
      );

      if (applicant) {
        // structure interview data
        const interviewData = structureInterviewData(scheduledApplicant);
        applicant.interview = interviewData;

        // Update the properties of the found scheduled applicant
        schedApplicants[index] = applicant;
      }
    });

    // set scheduled applicants
    setScheduledApplicants([...schedApplicants]);

    // Fetch the latest screening results from the database/API
    const screenedResults = await ScreeningService.getScreeningResults(postId);

    // check the applicants that passed the screening stage
    const passedApplicants = screenedResults.filter(
      (screenedResult) => screenedResult.result === "passed"
    );

    // Logic for getting unscheduled applicants
    // Get the applicants that passed the screening stage but are not yet scheduled for interview
    const unscheduledPassedScreeningApplicants = passedApplicants.filter(
      (passedApplicant) =>
        !schedApplicants.some(
          (scheduledApplicant) =>
            scheduledApplicant.information.email == passedApplicant.worker.email
        )
    );

    // console.log(screenedResults);

    // get the information of the unscheduled applicants from the applicants list using the unscheduled passed screening applicants
    const finalUnscheduledApplicants = unscheduledPassedScreeningApplicants.map(
      (unscheduledPassedScreeningApplicant) => {
        return applicants.find(
          (applicant) =>
            applicant.information.email ===
            unscheduledPassedScreeningApplicant.worker.email
        );
      }
    );

    setUnScheduledApplicants(finalUnscheduledApplicants);
  };

  useEffect(() => {
    // Fetch scheduled applicants when the component mounts
    fetchScheduledApplicants();
  }, [postId, applicants]);

  useEffect(() => {
    if (!showAll) {
      setVisibleApplicants(scheduledApplicants);
    } else {
      setVisibleApplicants(scheduledApplicants.slice(0, MAX_VISIBLE_ITEMS));
    }
  }, [scheduledApplicants]);

  const handleScheduleInterview = async (applicant) => {
    // console.log("Scheduling interview for: ", applicant);

    const interviewResults = {
      date: interviewDate,
      time: interviewTime,
      link: interviewLink,
    };

    const result = await ApplicationStageServices.setInterviewSchedule(
      postId,
      applicant.application_id,
      interviewResults
    );

    if (result) {
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Applicant has been scheduled for interview.",
        life: 3000,
      });

      //add interview date and time and link to applicant
      applicant.interview = {
        date: interviewDate,
        time: interviewTime,
        link: interviewLink,
        status: "scheduled",
        isPassed: false,
      };

      setScheduledApplicants([...scheduledApplicants, applicant]);

      // remove applicant from unscheduled applicants
      const newUnscheduledApplicants = unScheduledApplicants.filter(
        (unscheduledApplicant) =>
          unscheduledApplicant.information.email !== applicant.information.email
      );

      setUnScheduledApplicants(newUnscheduledApplicants);

      // reset interview date, time, and candidate
      setInterviewDate("");
      setInterviewTime("");
      setInterviewLink("");
      setCandidateForInterview(null);

      // close dialog
      setScheduleIntVisible(false);
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const handleScheduleInterviewInOverlay = async (applicant) => {
    // console.log("Scheduling interview for: ", applicant);

    const interviewResults = {
      date: interviewDate,
      time: interviewTime,
      link: interviewLink,
    };

    const result = await ApplicationStageServices.setInterviewSchedule(
      postId,
      applicant.application_id,
      interviewResults
    );

    if (result) {
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Applicant has been scheduled for interview.",
        life: 3000,
      });

      //add interview date, time and link to applicant
      applicant.interview = {
        date: interviewDate,
        time: interviewTime,
        link: interviewLink,
        status: "scheduled",
        isPassed: false,
      };

      setScheduledApplicants([...scheduledApplicants, applicant]);

      // remove applicant from unscheduled applicants
      const newUnscheduledApplicants = unScheduledApplicants.filter(
        (unscheduledApplicant) =>
          unscheduledApplicant.information.email !== applicant.information.email
      );

      setUnScheduledApplicants(newUnscheduledApplicants);

      // reset interview date, time, and candidate
      setInterviewDate("");
      setInterviewTime("");
      setInterviewLink("");
      setCandidateForInterview(null);

      // close overlay panel
      op.current.hide();
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const EmptyMessage = ({ message }) => (
    <div className="text-center py-5 mt-2">
      <p>{message}</p>
    </div>
  );

  const dateTemplate = (date) => {
    if (date.selectable === false) {
      return <span style={{ textDecoration: "line-through" }}>{date.day}</span>;
    }

    // console.log(scheduledApplicants);

    // check if date has interview by matching day and month and year
    // const hasInterview = scheduledApplicants.some(
    //   (applicant) =>
    //     dayjs(applicant.interview.date).format("D") == date.day &&
    //     dayjs(applicant.interview.date).format("M") == date.month + 1 &&
    //     dayjs(applicant.interview.date).format("YYYY") == date.year
    // );

    // get the interview details of the applicant
    const applicant = scheduledApplicants.find(
      (applicant) =>
        dayjs(applicant.interview.date).format("D") == date.day &&
        dayjs(applicant.interview.date).format("M") == date.month + 1 &&
        dayjs(applicant.interview.date).format("YYYY") == date.year
    );

    // check if applicant has interview and interview is not yet completed
    if (applicant && applicant.interview.status !== "completed") {
      return (
        <div className="flex flex-column items-center border-none">
          <span className="text-base">{date.day}</span>
          <i
            style={{ fontSize: "0.4rem" }}
            className="pi pi-circle-fill text-pink-500 absolute top-1 right-0"
          ></i>
        </div>
      );
    }

    return <span className="">{date.day}</span>;
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-column gap-y-2">
        <Button
          // label="Schedule an Interview"
          icon="pi pi-calendar-plus"
          size="small"
          className="w-full"
          onClick={(e) => {
            setCandidateForInterview(rowData);
            op.current.toggle(e);
          }}
        />
      </div>
    );
  };

  const profileTemplate = (rowData) => {
    return (
      <div className="flex items-center">
        <img
          className="h-10 flex-none rounded-full bg-gray-50 mr-4"
          src={rowData?.information?.profile_url}
          alt=""
        />
        <div className="min-w-0 flex-auto flex flex-column">
          <span className="flex">
            <p className="m-0 mr-2 text-sm font-semibold leading-6 text-gray-900">
              {rowData?.information?.first_name +
                " " +
                rowData?.information?.last_name}
            </p>
          </span>
          <span className="truncate text-xs leading-5 text-gray-500 align-middle">
            {rowData?.information?.email}
          </span>
        </div>
      </div>
    );
  };

  const activeStatusTemplate = (rowData) => {
    return (
      <div className="mt-1 flex items-center gap-x-1.5">
        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
        </div>
        <p className="text-xs leading-5 text-gray-500">Online</p>
      </div>
    );
  };

  const selectionToInterviewTemplate = (applicant, options) => {
    const className = classNames("flex align-items-center p-2 ", {
      //   "surface-hover": options.odd,
      "bg-gray-300":
        applicant.information.email ===
        candidateForInterview?.information.email,
    });

    return (
      <div
        index={options.index}
        className={className + " cursor-pointer hover:bg-gray-300"}
        onClick={() => setCandidateForInterview(applicant)}
      >
        <img
          className="h-7 flex-none rounded-full bg-gray-50 mr-2"
          src={applicant.information.profile_url}
          alt=""
        />
        {applicant.information.first_name +
          " " +
          applicant.information.last_name}
      </div>
    );
  };

  const ScheduleSection = ({ applicant }) => {
    // Parse the interview date using dayjs directly
    const interviewDate = dayjs(applicant.interview.date);

    // Combine date and time for comparison
    const interviewDateTime = dayjs(
      interviewDate.format("YYYY-MM-DD") + " " + applicant.interview.time
    );

    const isInterviewPassed = interviewDateTime.isBefore(dayjs());

    // Apply a CSS class conditionally based on whether the interview has passed and has been marked as passed
    const dateClassName =
      isInterviewPassed && applicant.interview.status !== "completed"
        ? "text-red-300"
        : "text-gray-500";

    // console.log(isInterviewPassed);

    return (
      <p
        className={`mt-1 truncate text-sm leading-5 align-middle ${dateClassName}`}
      >
        <span>
          <i className="pi pi-calendar pr-2"></i>
        </span>
        {interviewDate.format("MMMM D, YYYY")} at{" "}
        {formatInterviewTime(applicant.interview.time)}
      </p>
    );
  };

  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No applicants yet.</p>
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toastRef} position="bottom-right" />
      {/* <div className="bg-primary-100 flex items-center justify-between p-2 pl-3 rounded-md mb-3">
        <p className=" text-lg font-bold m-0">
          <i className="pi pi-check-square mr-3 text-green-700"></i>
          ALL INTERVIEWS COMPLETED!
        </p>
        <Button
          label="Move to Offer Stage"
          size="small"
          className="align-middle"
          icon="pi pi-chevron-right"
          iconPos="right"
          // disabled
          // onClick={handleMoveToNextTab}
        />
      </div> */}
      <div className="flex flex-column md:flex-row gap-x-5">
        <div className="flex-grow divide-y-2">
          <div className="pb-2">
            <div className="flex justify-between">
              <span className="text-base font-semibold leading-6 text-gray-900">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)}{" "}
                Interviews (
                {scheduledApplicants.length !== 0 &&
                  visibleApplicants.filter((applicant) =>
                    currentView === "scheduled"
                      ? applicant.interview.status === "scheduled"
                      : applicant.interview.status === "completed"
                  ).length}
                )
              </span>
              <span
                className="pi pi-arrow-right-arrow-left ml-2 cursor-pointer mr-4"
                onClick={toggleView}
              ></span>
            </div>
            {scheduledApplicants.length === 0 ? (
              <EmptyMessage message="No scheduled applicants found." />
            ) : (
              <div>
                <ul role="list" className="divide-y divide-gray-100">
                  {/* map every applicants in applicants */}
                  {visibleApplicants.filter((applicant) =>
                    currentView === "scheduled"
                      ? applicant.interview.status === "scheduled"
                      : applicant.interview.status === "completed"
                  ).length > 0 ? (
                    visibleApplicants
                      .filter((applicant) =>
                        currentView === "scheduled"
                          ? applicant.interview.status === "scheduled"
                          : applicant.interview.status === "completed"
                      )
                      .map((applicant, index) => (
                        <li
                          index={index}
                          key={applicant.information.email}
                          className={`rounded-md flex justify-between gap-x-6 py-4 px-2  `}
                          //   onClick={onOpen}
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <img
                              className="h-12 flex-none rounded-full bg-gray-50"
                              src={applicant.information.profile_url}
                              alt=""
                            />
                            <div className="min-w-0 flex-auto">
                              <span className="flex">
                                <p className="m-0 mr-2 text-base font-semibold leading-6 text-gray-900">
                                  {applicant.information.first_name +
                                    " " +
                                    applicant.information.last_name}
                                </p>
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-md px-1 py-0.5 text-xs font-medium ring-1 ring-inset ",
                                    {
                                      "bg-green-50 text-green-700 ring-green-600/20":
                                        applicant.information.verified,
                                      "text-yellow-700 bg-yellow-50 ring-yellow-600/20":
                                        !applicant.information.verified,
                                    }
                                  )}
                                >
                                  {applicant.information.verified
                                    ? "Verified"
                                    : "Unverified"}
                                </span>
                              </span>

                              <ScheduleSection applicant={applicant} />
                            </div>
                          </div>
                          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-right">
                            <div className="flex justify-between w-full items-center">
                              <div>
                                <p className="m-0 text-sm leading-6 text-gray-900">
                                  <Link href={applicant.interview.link}>
                                    {applicant.interview.link}
                                  </Link>
                                </p>

                                <div className="mt-1 flex items-center justify-end gap-x-1.5">
                                  <i className="pi pi-link"></i>
                                  <p className="text-xs leading-5 text-gray-600">
                                    Interview Link
                                  </p>
                                </div>
                              </div>
                              <Menu
                                model={
                                  applicant.interview.status === "completed"
                                    ? completedMenuItems
                                    : applicantMenuItems
                                }
                                popup
                                ref={menuRef}
                                id="popup_menu_applicants"
                                className="w-auto"
                              />

                              <i
                                className="pi pi-ellipsis-v p-2 ml-3 text-xs cursor-pointer"
                                onClick={(e) => handleMenuRef(e, applicant)}
                                aria-controls="popup_menu_left"
                                aria-haspopup
                              ></i>
                            </div>
                          </div>
                        </li>
                      ))
                  ) : (
                    <EmptyMessage
                      message={`No ${currentView} applicants found.`}
                    />
                  )}
                </ul>
                {scheduledApplicants.filter((applicant) =>
                  currentView === "scheduled"
                    ? applicant.interview.status === "scheduled"
                    : applicant.interview.status === "completed"
                ).length > MAX_VISIBLE_ITEMS && (
                  <div
                    className="text-primary cursor-pointer mb-2 w-full align-middle text-center h-8 rounded-b-lg "
                    onClick={toggleVisibility}
                  >
                    {showAll ? "Collapse" : "See More"}
                    <span className="ml-2">
                      <i
                        className={
                          "font-lg pi text-blue-500 " +
                          (showAll ? " pi-chevron-up" : " pi-chevron-down")
                        }
                      ></i>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="pt-4 pb-2">
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold leading-6 text-gray-900 mb-3">
                Awaiting Schedule ({unScheduledApplicants.length})
              </p>
            </div>
            <DataTable value={unScheduledApplicants}>
              <Column body={profileTemplate} header="Profile"></Column>
              <Column
                field="information.availability"
                header="Availability"
              ></Column>
              <Column body={activeStatusTemplate} header="Status"></Column>
              <Column body={actionTemplate} header="Action"></Column>
            </DataTable>
          </div>
        </div>
        <div className="flex flex-column order-first md:order-last gap-y-4 mb-4">
          <div
            className={`flex flex-column divide-y-2 ${styles.calendarWrapper}`}
          >
            <div className="flex flex-column">
              <span className="text-base w-full font-semibold leading-6 text-gray-900">
                Schedule Overview:
              </span>
              <Calendar
                // value={interviewDate}
                // onChange={handleDateChange}
                inline
                dateFormat=""
                dateTemplate={dateTemplate} // TODO
                className={`border-0 ${styles.calendarUnroundedDays}`}
                minDate={getMinimumDate()}
                pt={{
                  day: {
                    className: "p-2 md:p-1 border-1",
                    // span: { className: "rounded" },
                  },
                  panel: { className: "border-0" },
                  header: { className: "border-0" },
                }}
              />
              <Button
                label="Schedule an Interview"
                // icon="pi pi-calendar-plus"
                size="small"
                className="mt-2 sm:mt-0"
                // onClick={(e) => op.current.toggle(e)}
                onClick={() => setScheduleIntVisible(true)}
              />
            </div>
          </div>

          <Dialog
            header="Set an Interview"
            visible={scheduleIntVisible}
            onHide={() => setScheduleIntVisible(false)}
            draggable={false}
            resizable={false}
            position="bottom-right"
          >
            <div className="flex flex-column gap-y-4 px-4">
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Date
                </label>
                <Calendar
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.value)}
                  dateFormat="MM dd, yy"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Time
                </label>
                <Calendar
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.value)}
                  timeOnly
                  hourFormat="12"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex align-items-center gap-2">
                    <img
                      src={
                        interviewType === "Google Meet"
                          ? "/layout/google_meet_icon_short.png"
                          : "/layout/kasambahayko_logo.png"
                      }
                      alt="Sakai Logo"
                      height={interviewType === "Google Meet" ? "20" : "20"}
                      width={interviewType === "Google Meet" ? "20" : "20"}
                      className="user-avatar mr-0 lg:mr-2"
                    />
                    <label className="text-sm font-semibold leading-6 text-gray-900">
                      Interview type
                    </label>
                  </div>

                  <span
                    className="cursor-pointer"
                    onClick={() => handleInterviewTypeChange()}
                  >
                    <i className="pi pi-arrow-right-arrow-left" />
                  </span>
                </div>
                <span className="p-input-icon-left">
                  <i className="pi pi-link" />
                  <InputText
                    value={interviewLink}
                    placeholder=""
                    onChange={(e) => setInterviewLink(e.target.value)}
                    // disabled if interview type is kasambahayko because link is auto generated
                    disabled={interviewType === "KasambahayKo"}
                  />
                </span>
              </div>
              <div className="">
                <label className="text-sm font-semibold leading-6 text-gray-900 mb-6">
                  Select Applicant
                </label>
                <div className="mt-2">
                  <VirtualScroller
                    items={unScheduledApplicants}
                    itemSize={unScheduledApplicants.length}
                    itemTemplate={selectionToInterviewTemplate}
                    className="border-1 surface-border border-round w-full h-40"
                    //   style={{ width: "200px", height: "200px" }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  label="Schedule"
                  // icon="pi pi-calendar-plus"
                  size="small"
                  className="w-full"
                  onClick={() => handleScheduleInterview(candidateForInterview)}
                />
              </div>
            </div>
          </Dialog>
          <OverlayPanel ref={op} showCloseIcon>
            <div className="flex flex-column gap-y-4">
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Date
                </label>
                <Calendar
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.value)}
                  dateFormat="MM dd, yy"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Time
                </label>
                <Calendar
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.value)}
                  timeOnly
                  hourFormat="12"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex align-items-center gap-2">
                    <img
                      src={
                        interviewType === "Google Meet"
                          ? "/layout/google_meet_icon_short.png"
                          : "/layout/kasambahayko_logo.png"
                      }
                      alt="Sakai Logo"
                      height={interviewType === "Google Meet" ? "20" : "20"}
                      width={interviewType === "Google Meet" ? "20" : "20"}
                      className="user-avatar mr-0 lg:mr-2"
                    />
                    <label className="text-sm font-semibold leading-6 text-gray-900">
                      Interview type
                    </label>
                  </div>

                  <span
                    className="cursor-pointer"
                    onClick={() => handleInterviewTypeChange()}
                  >
                    <i className="pi pi-arrow-right-arrow-left" />
                  </span>
                </div>
                <span className="p-input-icon-left">
                  <i className="pi pi-link" />
                  <InputText
                    value={interviewLink}
                    placeholder=""
                    onChange={(e) => setInterviewLink(e.target.value)}
                    // disabled if interview type is kasambahayko because link is auto generated
                    disabled={interviewType === "KasambahayKo"}
                  />
                </span>
              </div>
              <div className="flex justify-end">
                <Button
                  label="Schedule"
                  // icon="pi pi-calendar-plus"
                  size="small"
                  className="w-full"
                  onClick={() =>
                    handleScheduleInterviewInOverlay(candidateForInterview)
                  }
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
      </div>
    </div>
  );
}
