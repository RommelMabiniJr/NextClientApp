import EmployerNavbar from "@/layout/EmployerNavbar";
import EmptyNotification from "@/layout/components/employer/notifications/EmptyNotification";
import EmpNotificationList from "@/layout/components/employer/notifications/EmpNotificationList";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NotificationService } from "@/layout/service/NotificationService";
import NotificationHeader from "@/layout/components/employer/notifications/NotificationHeader";

const NotificationPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [notificationMode, setNotificationMode] = useState("all");

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    // Get notifications from the server using user_id from session
    const fetchNotifications = async () => {
      if (!session) {
        return;
      }

      const response = await NotificationService.getEmployerNotifications(
        session.user.uuid
      );
      setNotifications(response);
    };

    console.log(session);

    fetchNotifications();
  }, [session]);

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="px-5 py-4 ml-5">
        <NotificationHeader
          notificationMode={notificationMode}
          setNotificationMode={setNotificationMode}
        />
        {/* Check if there are notifications */}
        {notifications.length > 0 ? (
          <EmpNotificationList
            notifications={notifications}
            setNotifications={setNotifications}
          />
        ) : (
          <EmptyNotification />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
