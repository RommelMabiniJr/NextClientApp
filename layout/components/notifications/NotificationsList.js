const NotificationList = ({ notifications, markAsRead }) => {
  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRead={markAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;
