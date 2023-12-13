import React from "react";
import Link from "next/link";

const EmptyNotification = () => {
  return (
    <div className="flex flex-column align-items-center justify-content-center">
      <img
        src="/layout/empty-notifications.png"
        alt="empty"
        className="w-15rem h-15rem mt-10"
      />
      <div className="text-center">
        <p className="text-gray-800 font-medium text-xl">
          No notifications to display yet.
        </p>
        <p className="text-gray-600 text-l mx-auto w-8">
          Explore the latest updates in the job market by checking out{" "}
          <Link href="/app/worker/job-listings">job listings</Link>. Connect
          with employers, respond to job offers, or update your{" "}
          <Link href="/app/worker/profile">worker profile</Link> to enhance your
          job-seeking experience.
        </p>
      </div>
    </div>
  );
};

export default EmptyNotification;
