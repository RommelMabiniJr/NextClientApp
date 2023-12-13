import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import classNames from "classnames";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { ScrollPanel } from "primereact/scrollpanel";
import { NotificationService } from "./service/NotificationService";
import { getRelativeTimeFromNow } from "./components/utils/dateUtils";
import { createEmpNotificationRoute } from "./components/utils/notificationUtils";

const EmployerNavbar = ({}) => {
  const { data: session, loading } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // This is usually done by redirecting to /auth.
      router.push("/auth/login");
    },
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [websocketNotifications, setWebsocketNotifications] = useState([]);
  const notifMenu = useRef(null);
  const menu = useRef(null);
  const router = useRouter();
  const toast = useRef(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const ws = new WebSocket(socketUrl); // Replace with your server address using process.env

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      // Handle the incoming notification here and update your UI as needed

      // check if the message is a notification
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type == "notification") {
        // check if the notification is for the current user
        if (message.recipient == session.user.uuid) {
          // add the notification to the list of notifications
          setNotifications((notifications) => [...notifications, message]);
          console.log("Notification added");
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      // Cleanup WebSocket connection when component unmounts
      ws.close();
    };
  }, []);

  useEffect(() => {
    // Get notifications from the server using user_id from session
    const fetchNotifications = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/notifications/${session.user.uuid}`
      );
      const data = await response.data;

      // order notifications by timestamp
      const timeSortedNotifs = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setNotifications(timeSortedNotifs);
    };

    fetchNotifications();
  }, [session]);

  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        router.push("/app/employer-dashboard"); // Used router.push instead of the url property due to a bug in the employer-dashboard
      },
    },
    {
      label: "Search",
      icon: "pi pi-fw pi-search",
      url: "/app/employer/worker-search",
    },
    {
      label: "Posts",
      icon: "pi pi-fw pi-briefcase",
      url: "/app/posts",
      command: () => {
        // handle logout logic here
      },
    },
    {
      label: "Bookings",
      icon: "pi pi-fw pi-calendar",
      url: "/app/employer/bookings",
      command: () => {
        // handle logout logic here
      },
    },
  ];

  // Function to mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    await NotificationService.setEmpNotificationRead(notificationId);

    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);

    // route to the notification
    const navigationRoute = await createEmpNotificationRoute(
      notifications.find(
        (notification) => notification.notification_id === notificationId
      )
    );

    router.push(navigationRoute);
  };

  const profileItems = session && [
    {
      label: "Profile",
      icon: "pi pi-fw pi-user",
      url: `/app/employer/${session.user.uuid}`,
    },
    {
      label: "Wallet Balance",
      icon: "pi pi-fw pi-wallet",
      command: () => {
        // handle logout logic here
      },
    },
    {
      label: "Logout",
      icon: "pi pi-fw pi-power-off",
      command: () => {
        // handle logout logic here
        handleSignOut();
      },
    },
  ];

  const notificationItems = [
    {
      template: (item, options) => {
        return (
          <div className="w-full p-link flex align-items-center justify-content-between px-3 py-2">
            <label className="font-bold">Notifications</label>
            <div className="flex flex-column align">
              <i className="pi pi-check" link />
            </div>
          </div>
        );
      },
    },
    {
      separator: true,
    },
    {
      template: (item, options) => {
        return (
          <>
            {notifications.length === 0 ? (
              <div className="text-center my-4">
                You have no new notifications
              </div>
            ) : (
              <ScrollPanel
                className="max-h-100px"
                style={{ width: "100%", height: "350px" }}
              >
                {...notifications.map((notification) => (
                  <button
                    key={notification.notification_id}
                    onClick={async (e) => {
                      options.onClick(e);
                      await markNotificationAsRead(
                        notification.notification_id
                      ); // Mark notification as read when clicked
                    }}
                    className={classNames(
                      options.className,
                      "w-full p-link flex align-items-center ",
                      { "notification-unread": !notification.read } // Add a class for unread notifications
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-medium ${
                            !notification.read ? "text-bold" : ""
                          }`}
                        >
                          {notification.title}
                        </div>
                        {!notification.read && (
                          <div className="indicator w-2.5 h-2.5 rounded-full bg-primary"></div>
                        )}
                      </div>

                      {/* Limit message to a certain number of characters or two lines */}
                      <div className="text-sm text-gray-600">
                        {notification.message.length > 70
                          ? notification.message.substring(0, 70) + "..."
                          : notification.message}
                      </div>

                      {/* Get the relative time from now */}
                      <div
                        className={`text-xs ${
                          notification.read ? "text-gray-600" : "text-primary"
                        }`}
                      >
                        {getRelativeTimeFromNow(notification.timestamp)}
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollPanel>
            )}
          </>
        );
      },
    },
    { separator: true },
    {
      template: (item, options) => {
        return (
          <div className="flex justify-content-center">
            <Button
              label="View All Notifications"
              onClick={() => router.push("/app/employer/notifications")}
              className="m-2 w-10 text-sm font-light"
              rounded
              outlined
              size="normal"
            ></Button>
          </div>
        );
      },
    },
  ];

  const start = (
    <Link href="/app/employer-dashboard" className="flex align-items-center">
      <img
        src={`/layout/logo.png`}
        alt="Sakai Logo"
        height="50"
        width="50"
        className="user-avatar mr-0 lg:mr-2"
      />
      <span className="text-900 font-bold text-2xl line-height-3 mr-8">
        KasambahayKo
      </span>
    </Link>
  );

  const end = session && (
    <div className="flex flex-row align-items-center border-circle p-d-flex p-flex-row p-ai-center">
      {/* <Image className='w-min h-min mr-4' src='/layout/profile-default.png' width='40'/> */}
      <i
        aria-label="Message"
        onClick={() => router.push("/app/employer/messages")}
        className="mr-2 p-overlay-badge mr-4 p-link p-cursor-pointer pi pi-envelope"
        style={{ fontSize: "1.5rem" }}
      >
        {/* <Badge value="8" size="" severity="danger"></Badge> */}
      </i>
      <Menu
        className="w-18rem"
        model={notificationItems}
        popup
        ref={notifMenu}
        id="popup_notif"
      />
      <i
        aria-label="Notification"
        onClick={(e) => notifMenu.current.toggle(e)}
        className="mr-2 p-overlay-badge mr-4 p-link p-cursor-pointer pi pi-bell"
        style={{ fontSize: "1.5rem" }}
      >
        {/* Do not display if no notification */}
        {/* Update the badge value to show the count of unread notifications only when the menu is closed */}
        {!isMenuOpen &&
          notifications.filter((notification) => !notification.read).length >
            0 && (
            <Badge
              value={
                notifications.filter((notification) => !notification.read)
                  .length
              }
              size=""
              severity="danger"
            ></Badge>
          )}
      </i>
      <Menu
        className=""
        model={profileItems}
        popup
        ref={menu}
        id="popup_menu"
      />
      <Avatar
        className="mr-4"
        image={session?.user?.imageUrl || "/layout/profile-default.png"}
        size="large"
        shape="circle"
        onClick={(e) => menu.current.toggle(e)}
      ></Avatar>
    </div>
  );

  return (
    // make sticky
    <div className="sticky top-0 z-50 ">
      <Menubar
        start={start}
        model={items}
        end={end}
        pt={{
          root: {
            className: "bg-white",
          },
        }}
      />
    </div>
  );
};

export default EmployerNavbar;
