import { ApplicationService } from "@/layout/service/ApplicationService";

// Type of notification items that will be displayed in the employer notification
const EMP_NOTIFICATION_TYPES = [
  {
    id: 1,
    title: "Job Application",
    event_type: "job_application",
    route: "/app/posts/applicants/",
  },
  {
    id: 2,
    title: "Offer Declined",
    event_type: "offer_declined",
    route: "/app/posts/applicants/",
  },
  {
    id: 3,
    title: "Offer Accepted",
    event_type: "offer_accepted",
    route: "/app/posts/applicants/",
  },
];

const WORK_NOTIFICATION_TYPES = [
  {
    id: 1,
    title: "Screening Result",
    event_type: "screening_result",
    route: "/app/worker/job-listings/job-application/",
  },
  {
    id: 2,
    title: "Interview Scheduled",
    event_type: "interview_scheduled",
    route: "/app/worker/job-listings/job-application/",
  },
  {
    id: 3,
    title: "Interview Cancelled",
    event_type: "interview_canceled",
    route: "/app/worker/job-listings/job-application/",
  },
  {
    id: 4,
    title: "Job Offer",
    event_type: "job_offer",
    route: "/app/worker/job-listings/job-application/",
  },
  {
    id: 5,
    title: "Booking Confirmation",
    event_type: "booking_confirmation",
    route: "/app/worker/bookings/view/",
  },
  {
    id: 6,
    title: "Booking In Progress & Completed",
    event_type: "booking_progress_update",
    route: "/app/worker/bookings/view/",
  },
  {
    id: 7,
    title: "New Review",
    event_type: "new_review",
    route: "/app/worker/bookings/view/",
  },
];

export const createEmpNotificationRoute = async (notification) => {
  //  get the job id from the application id
  const { job_id } = await ApplicationService.getApplicationShortVersion(
    notification.event_id
  );

  const notificationType = EMP_NOTIFICATION_TYPES.find(
    (type) => type.event_type === notification.event_type
  );

  return `${notificationType.route}${job_id}`;
};

export const createWorkNotificationRoute = async (notification) => {
  const notificationType = WORK_NOTIFICATION_TYPES.find(
    (type) => type.event_type === notification.event_type
  );

  return `${notificationType.route}${notification.event_id}`;
};
