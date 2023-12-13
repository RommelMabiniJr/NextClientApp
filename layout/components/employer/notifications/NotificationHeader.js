import { SelectButton } from "primereact/selectbutton";

const NotificationHeader = ({ notificationMode, setNotificationMode }) => {
  const options = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Read", value: "read" },
  ];

  return (
    <div className="flex mb-3 items-center">
      <h3 className="m-0">Notifications</h3>

      <SelectButton
        value={notificationMode}
        onChange={(e) => setNotificationMode(e.value)}
        options={options}
        className="ml-auto"
      />
    </div>
  );
};

export default NotificationHeader;
