import WorkerNavbar from "@/layout/WorkerNavbar";
import Footer from "@/layout/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import BookingViewContent from "@/layout/components/worker/bookings/view/BookingViewContent";

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
      <BookingViewContent />
      <Footer />
    </div>
  );
};

export default BookingView;
