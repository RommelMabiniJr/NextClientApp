import React from "react";
import WorkerNavbar from "@/layout/WorkerNavbar";
import BookingsContent from "@/layout/components/worker/bookings/BookingsContent";
import FooterLinks from "@/layout/LandingPageComponents/AppFooter";

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
      <FooterLinks />
    </div>
  );
};

export default Bookings;
