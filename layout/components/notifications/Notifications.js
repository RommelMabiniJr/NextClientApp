import React, { useState } from "react";

const Notification = ({ notification, onRead }) => {
  const handleNotificationClick = () => {
    // Check if the notification is unread before marking it as read
    if (!notification.read) {
      // Mark the notification as read
      onRead(notification.id); // Pass the notification ID to identify which one to mark as read
    }
    // Handle the click action (e.g., navigate to a specific page)
    // ...
  };

  return (
    <div
      className={`notification ${notification.read ? "read" : "unread"}`}
      onClick={handleNotificationClick}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
