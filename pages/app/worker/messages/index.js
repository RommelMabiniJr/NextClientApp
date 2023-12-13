import Link from "next/link";
import { useSession } from "next-auth/react";
import WorkerNavbar from "@/layout/WorkerNavbar";

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
      <WorkerNavbar session={session} handleSignOut={handleSignOut} />
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
        </div>
      </div>
    </div>
  );
}
