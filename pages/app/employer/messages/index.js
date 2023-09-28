import Link from "next/link";
import EmployerNavbar from "@/layout/EmployerNavbar";
import { useSession } from "next-auth/react";

export default function MessagesPage() {
  const { data: session, status: sessionStatues } = useSession();
  const handleSignOut = () => {
    signOut();
  };

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
      <div className="px-5 py-4">
        <h3>Messages</h3>
        {/* render no messages */}
        <div className="flex flex-column align-items-center justify-content-center">
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
              Begin your journey by browsing caregivers{" "}
              <Link href={"/app/employer/worker-search"}>kasambahays</Link> now
              to initiate chats or enlist job opportunities. Or,{" "}
              <Link href="/app/posts">post a job</Link> to discover interested
              candidates..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
