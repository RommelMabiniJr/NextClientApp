import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Use the UTC plugin, as your timestamp is in UTC
dayjs.extend(utc);

export const COLORS = {
  GREEN: "#4CAF50",
  YELLOW: "#FFC107",
  BLUE: "#2196F3",
  GREY: "#9E9E9E",
};

// Define constants for event descriptions
export const EVENT_DESCRIPTIONS = {
  JOB_OFFER: "Job Offer",
  JOB_OFFER_ACCEPTED: "Job Offer Accepted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERVIEW_COMPLETED: "Interview Completed",
  SCREENING_PASSED: "Screening Passed",
  APPLICATION_SUBMITTED: "Application Submitted",
  APPLICATION_UNDER_REVIEW: "Application Under Review",
};

export const mapTimelineData = (apiData) => {
  apiData.sort(
    (a, b) => new Date(a.event_timestamp) - new Date(b.event_timestamp)
  );

  return apiData.map((item, index) => {
    const { icon, color, content } = getStatusInfo(item.event_description);
    const isCurrent = index === apiData.length - 1;
    return { ...item, icon, color, content, isCurrent };
  });
};

export const getStatusInfo = (status) => {
  switch (status) {
    case EVENT_DESCRIPTIONS.JOB_OFFER_ACCEPTED:
      return {
        icon: "pi pi-check-circle",
        color: COLORS.GREEN,
        content:
          "Congratulations! You have accepted the job offer. You can now view the booking details and start working.",
      };
    case EVENT_DESCRIPTIONS.JOB_OFFER:
      return {
        icon: "pi pi-info-circle",
        color: COLORS.BLUE,
        content:
          " Congratulations! You have been offered a job. Please review the job offer details below and respond to the employer within the given deadline.",
      };
    case EVENT_DESCRIPTIONS.INTERVIEW_COMPLETED:
      return {
        icon: "pi pi-check-circle",
        color: COLORS.GREEN,
        content: "Your interview was successfully completed. Great job!",
      };
    case EVENT_DESCRIPTIONS.INTERVIEW_SCHEDULED:
      return {
        icon: "pi pi-info-circle",
        color: COLORS.BLUE,
        content:
          "An interview has been scheduled for you. Prepare and good luck!",
      };
    case EVENT_DESCRIPTIONS.SCREENING_PASSED:
      return {
        icon: "pi pi-check-circle",
        color: COLORS.GREEN,
        content:
          "Congratulations! Your application has been reviewed, and you have successfully passed the screening process.",
      };
    case EVENT_DESCRIPTIONS.APPLICATION_UNDER_REVIEW:
      return {
        icon: "pi pi-sync",
        color: COLORS.YELLOW,
        content:
          "Your application is currently under review. Please wait for the employer to finish reviewing your application.",
      };
    case EVENT_DESCRIPTIONS.APPLICATION_SUBMITTED:
      return {
        icon: "pi pi-check-circle",
        color: COLORS.GREEN,
        content:
          "Your application has been successfully submitted to the employer and is now under review.",
      };
    default:
      return { icon: "", color: "" };
  }
};

/**
 * Creates a structured timeline object for an offer event.
 *
 * @param {string} offerId - The ID of the offer.
 * @param {string} eventType - The type of event.
 * @param {string} action - The action performed.
 * @param {object} sessionUser - The user performing the action.
 * @returns {object} - The structured timeline object.
 */
/**
 * Creates a timeline object with the given offer ID, event type, action, and user information.
 * Structured in a way that the server can accurately identify the offer ID, event type, action, and user information.
 * @param {string} offerId - The ID of the offer.
 * @param {string} eventType - The type of event (e.g. "simple', "complex").
 * @param {string} action - The action taken (e.g. "sent an offer to candidate").
 * @param {object} sessionUser - The user who performed the action.
 * @param {string} sessionUser.firstName - The first name of the user.
 * @param {string} sessionUser.lastName - The last name of the user.
 * @param {string} sessionUser.imageUrl - The URL of the user's profile image.
 * @returns {object} The timeline object.
 */
export const structureOfferTimeline = (
  offerId,
  eventType,
  action,
  sessionUser
) => {
  const timelineObject = {
    offerId: offerId,
    eventType: eventType,
    user: sessionUser.firstName + " " + sessionUser.lastName,
    profile_url: sessionUser.imageUrl,
    action: action,
    timestamp: new Date().toISOString(),
  };
  console.log(timelineObject); // log the resulting object
  return timelineObject;
};
