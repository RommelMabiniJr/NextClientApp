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

const MessageContent = ({ UUIDS, session }) => {
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
    // setMessagesReceived((prevState) => [
    //   ...prevState,
    //   {
    //     message: message,
    //     senderUUID: senderUUID,
    //     receiverUUID: receiverUUID,
    //     createdAt: new Date().toISOString(),
    //   },
    // ]);
  };

  useEffect(() => {
    // Get the user info of the message recepient
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

  const footerTemplate = () => {
    return (
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
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex px-4 py-3 flex-row justify-between items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <div>
            <Avatar
              image={`${process.env.NEXT_PUBLIC_ASSET_URL}/1691928413649_45798965.jpg`}
              // size="large"
              shape="circle"
              className="mb-1"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="m-0 text-lg font-semibold">Esei Seno</h4>
            <p className="m-0 text-gray-500 text-sm">Last active 2d ago</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button
            icon="pi pi-phone"
            iconPos="left"
            outlined
            size="small"
            severity="secondary"
            rounded
          />
          <Button
            icon="pi pi-ellipsis-v"
            iconPos="left"
            size="small"
            outlined
            severity="secondary"
            rounded
          />
        </div>
      </div>
    );
  };

  return (
    <Card
      className="p-4 card h-full rounded-md bg-white "
      footer={footerTemplate}
      header={headerTemplate}
    >
      <div className="flex flex-col h-full gap-2">
        <ScrollPanel style={{ width: "100%", height: "300px" }}>
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
                        Esei Seno
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
      </div>
    </Card>
  );
};

export default MessageContent;
