import React, { useState } from "react";
import { getRelativeTimeFromNow } from "../../utils/dateUtils";
import { useRouter } from "next/router";
import { createEmpNotificationRoute } from "../../utils/notificationUtils";

const EmployerNotification = ({ notification, onRead }) => {
  const router = useRouter();

  const handleNotificationClick = async () => {
    if (!notification.read) {
      onRead(notification.notification_id);
    }

    // route to the notification's page
    const route = await createEmpNotificationRoute(notification);
    router.push(route);
  };

  return (
    <div
      className={`notification ${
        notification.read ? "read" : "unread"
      } p-3 hover:bg-gray-100 cursor-pointer rounded-md`}
      onClick={handleNotificationClick}
    >
      <div className="font-bold">{notification.title}</div>
      <div className="flex items-center justify-between gap-3">
        <div>{notification.message}</div>
        {!notification.read && (
          <div className="indicator w-1rem h-1rem rounded-full bg-primary"></div>
        )}
      </div>
      <div className={`text-sm ${notification.read ? "" : "text-primary"}`}>
        {getRelativeTimeFromNow(notification.timestamp)}
      </div>
    </div>
  );
};

export default EmployerNotification;
