import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { UserService } from "@/layout/service/UserService";
import { MessageService } from "@/layout/service/MessageService";
import dayjs from "dayjs";
import { Sidebar } from "primereact/sidebar";

const MessageContentDialog = ({
  UUIDS,
  worker,
  employer,
  session,
  msgPanelVisible,
  setMsgPanelVisible,
}) => {
  const { senderUUID, receiverUUID } = UUIDS;
  const [socket, setSocket] = useState(null);
  const [msgRecepient, setMsgRecepient] = useState({});
  const [message, setMessage] = useState("");
  const [messagesReceived, setMessagesReceived] = useState([]);
  // const socket = useSocket();

  const sendMessage = () => {
    // send message to the database
    if (message === "") return;

    socket.emit("send_message", {
      message: message,
      senderUUID: senderUUID,
      receiverUUID: receiverUUID,
    });

    setMessage("");
  };

  useEffect(() => {
    // Get the user info of the message recepients

    console.log("receiverUUID", receiverUUID);
    console.log("senderUUID", senderUUID);

    const fetchMsgRecepient = async () => {
      const userData = await UserService.getUserInfoSimple(receiverUUID);
      setMsgRecepient(userData);
    };

    fetchMsgRecepient();
  }, [receiverUUID]);

  useEffect(() => {
    // Fetch the message history
    const fetchMessages = async () => {
      const messages = await MessageService.getMessages(
        senderUUID,
        receiverUUID
      );
      console.log("messages", messages);
      setMessagesReceived(messages);
    };

    fetchMessages();

    // Initialize the socket and join the private room
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL);
    setSocket(newSocket);
    newSocket.emit("join_room", { senderUUID, receiverUUID });

    // Handle received private messages
    const receiveMessageHandler = (data) => {
      console.log("Received private message:", data);
      // Handle the received private message in your React component

      // Update the messagesReceived state
      setMessagesReceived((prevState) => [...prevState, data]);
    };

    newSocket.on("receive_message", receiveMessageHandler);

    // Clean up the socket and event listeners when the component is unmounted
    return () => {
      newSocket.off("receive_message", receiveMessageHandler);
      newSocket.disconnect();
    };
  }, [UUIDS]);

  return (
    <Sidebar
      visible={msgPanelVisible}
      onHide={() => setMsgPanelVisible(false)}
      className="w-full md:w-20rem lg:w-6"
      position="right"
      pt={{
        header: {
          className: "hidden",
        },
      }}
    >
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <div className="flex px-3 py-3 flex-row justify-between items-center gap-2">
            <div className="flex flex-row items-center gap-2">
              <div>
                <Avatar
                  image={
                    // process.env.NEXT_PUBLIC_ASSET_URL + worker.profile_url
                    employer.profile_url // TODO: Change this to the above line when the backend is ready
                  }
                  // size="large"
                  shape="circle"
                  className="mb-1"
                  style={{ width: "58px", height: "58px" }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="m-0 text-xl font-semibold">
                  {employer.first_name + " " + employer.last_name}
                </h4>
                <p className="m-0 text-gray-500 text-sm">Last active 2d ago</p>
              </div>
            </div>
          </div>
          <button
            className="p-sidebar-icon p-link mr-2 mt-1 p-2 rounded-full"
            onClick={() => setMsgPanelVisible(false)}
            autoFocus
          >
            <span className="pi pi-times" />
          </button>
        </div>
        <ScrollPanel
          className="pl-3 flex-1"
          style={{ width: "100%", height: "400px" }}
        >
          {messagesReceived.map((message, index) => (
            <div
              key={index}
              className={`my-1 flex flex-row gap-2 ${
                message.senderUUID === session.user.uuid
                  ? "justify-end text-right"
                  : "justify-start"
              }`}
            >
              <div className="flex flex-col gap-1">
                {message.senderUUID === session.user.uuid ? (
                  <>
                    {/* <p className="m-0 text-gray-500 text-sm">You</p> */}
                    <p className="m-0 text-primary-800 bg-primary-100 font-medium text-sm py-2 px-3 border rounded-md ml-5">
                      {message.message}
                    </p>
                    <div className="flex flex-row items-center justify-end gap-2">
                      <span className="m-0 text-gray-500 text-sm">
                        {/* Use dayjs show time format example: Friday at 3:00PM */}
                        {dayjs(message.createdAt).format("dddd [at] h:mmA")}
                      </span>
                      <i className="pi pi-check text-green-400" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-row items-center gap-2">
                      <Avatar
                        image={`${process.env.NEXT_PUBLIC_ASSET_URL}/${msgRecepient.profileUrl}`}
                        // size="xlarge"
                        shape="circle"
                        className="mb-1"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p className="m-0 text-gray-900 text-sm font-medium">
                        {employer.first_name + " " + employer.last_name}
                      </p>
                    </div>
                    <p className="m-0 text-gray-700 font-medium text-sm py-2 px-3 border rounded-md ml-5">
                      {message.message}
                    </p>
                    <div className="flex flex-row items-center ml-5 gap-2">
                      <span className="m-0 text-gray-500 text-sm">
                        {/* Use dayjs show time format example: Friday at 3:00PM */}
                        {dayjs(message.createdAt).format("dddd [at] h:mmA")}
                      </span>
                      <i className="pi pi-check text-green-400" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </ScrollPanel>
        <div className="flex flex-row justify-between items-center gap-2">
          <InputText
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div>
            <Button
              icon="pi pi-send"
              iconPos="left"
              label="Send"
              onClick={sendMessage}
              className="p-button-primary"
              size="small"
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default MessageContentDialog;
