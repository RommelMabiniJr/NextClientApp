import React from "react";
import WorkerNavbar from "@/layout/WorkerNavbar";
import Footer from "@/layout/Footer";
import BookingsContent from "@/layout/components/worker/bookings/BookingsContent";

const { useSession } = require("next-auth/react");

const Bookings = () => {
  const { data: session, status, loading } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <WorkerNavbar session={session} />
      <BookingsContent session={session} />
      <Footer />
    </div>
  );
};

export default Bookings;
