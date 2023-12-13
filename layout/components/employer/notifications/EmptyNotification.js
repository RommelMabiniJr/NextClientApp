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
          Begin your journey by browsing caregivers{" "}
          <Link href={"/app/employer/worker-search"}>kasambahays</Link> now to
          initiate chats or enlist job opportunities. Or,{" "}
          <Link href="/app/posts">post a job</Link> to discover interested
          candidates..
        </p>
      </div>
    </div>
  );
};

export default EmptyNotification;
