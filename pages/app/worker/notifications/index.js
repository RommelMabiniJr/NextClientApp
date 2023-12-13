import WorkerNavbar from "@/layout/WorkerNavbar";
import EmptyNotification from "@/layout/components/worker/notifications/EmptyNotification";
import NotificationHeader from "@/layout/components/worker/notifications/NotificationHeader";
import WorkerNotificationList from "@/layout/components/worker/notifications/WorkerNotificationList";
import { NotificationService } from "@/layout/service/NotificationService";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationPage = () => {
  const { data: session, status: sessionStatues } = useSession();
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

      const response = await NotificationService.getWorkerNotifications(
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
      <WorkerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="px-5 py-4 ml-5">
        <NotificationHeader
          notificationMode={notificationMode}
          setNotificationMode={setNotificationMode}
        />
        {/* Check if there are notifications */}
        {notifications.length > 0 ? (
          <WorkerNotificationList
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
