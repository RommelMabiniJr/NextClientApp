import WorkerNavbar from "@/layout/WorkerNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import BookingViewContent from "@/layout/components/worker/bookings/view/BookingViewContent";
import FooterLinks from "@/layout/LandingPageComponents/AppFooter";

const BookingView = () => {
  const { data: session, status, loading } = useSession();
  const router = useRouter();
  const { bookingId } = router.query;

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <WorkerNavbar session={session} />
      {/* TODO: Add a BookingViewContent component */}
      <BookingViewContent session={session} />
      <FooterLinks />
    </div>
  );
};

export default BookingView;
