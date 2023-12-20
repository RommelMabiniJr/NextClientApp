import Link from "next/link";
import { useSession } from "next-auth/react";
import WorkerNavbar from "@/layout/WorkerNavbar";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import MessageContent from "@/layout/components/worker/messages/MessageContent";

export default function MessagesPage() {
  const { data: session, status: sessionStatues } = useSession();
  const [receiverUUID, setReceiverUUID] = useState(
    "290b9ec6-90fd-4493-a32e-6f1ca4dbd213"
  );

  const handleSignOut = () => {
    signOut();
  };

  const items = [
    {
      firstName: "Rommel",
      lastName: "Mabini Jr.",
      imageUrl: `${process.env.NEXT_PUBLIC_ASSET_URL}/1699538347943_541863552.jpg`,
    },
    {
      firstName: "Mark Dave",
      lastName: "Amamangpang",
      imageUrl: `${process.env.NEXT_PUBLIC_ASSET_URL}/1691928413649_45798965.jpg`,
    },
  ];

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="h-screen">
      <WorkerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="px-5 py-4 flex flex-column h-full">
        <h3 className="">Messages</h3>
        {/* render no messages */}
        {/* <div className="flex flex-column align-items-center justify-content-center">
          <img
            src="/layout/empty-messages.png"
            alt="empty"
            className="w-19rem h-15rem mt-10"
          />
          <div className="text-center">
            <p className="text-gray-800 font-medium text-xl">
              No messages to display yet.
            </p>
            <p className="text-gray-600 text-l mx-auto w-8">
              Explore job opportunities by checking out available{" "}
              <Link href="/app/worker/job-listings">job listings</Link>. Connect
              with potential employers and initiate conversations to discover
              exciting opportunities for your skills and expertise. You can also
              customize your{" "}
              <Link href={`/app/worker/${session.user.uuid}`}>
                worker profile
              </Link>{" "}
              to enhance your visibility and increase your chances of finding
              the perfect job match.
            </p>
          </div>
        </div> */}

        <div className="flex flex-1 gap-5">
          <div className="p-4 card h-full rounded-md bg-white w-2/6 border-11 border-gray-300 ">
            <div className="profile border-b-1 flex flex-column gap-2 items-center pb-4">
              <Avatar
                image={`${session.user.imageUrl}`}
                // size="xlarge"
                shape="circle"
                className="mb-1"
                style={{ width: "80px", height: "80px" }}
              />
              <div className="">
                <h4 className="m-0 font-semibold">
                  {session.user.firstName + " " + session.user.lastName}
                </h4>
              </div>
            </div>
            <div className="w-full mb-4">
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText placeholder="Search" className="w-full" />
              </span>
            </div>
            <div className="recent-chat">
              <ul className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex flex-row items-center gap-2 border rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex gap-2 flex-1">
                      <div>
                        <Avatar
                          image={`${item.imageUrl}`}
                          // size="xlarge"
                          shape="circle"
                          className="mb-1"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="m-0 text-lg font-semibold">
                          {item.firstName + " " + item.lastName}
                        </h4>
                        <p className="m-0 text-gray-500 text-sm">Kasambahay</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="m-0 text-gray-500 text-sm font-semibold">
                        2d
                      </p>
                      {/* <p className="m-0 text-gray-500 text-sm">12:00 PM</p> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-4/6 h-full">
            <MessageContent
              session={session}
              UUIDS={{
                senderUUID: session.user.uuid,
                receiverUUID: receiverUUID,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
