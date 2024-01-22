import EmployerNavbar from "@/layout/EmployerNavbar";
import Footer from "@/layout/Footer";
import BookingViewContent from "@/layout/components/employer/bookings/requests/view/BookingViewContent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const BookingView = () => {
  const { data: session, status, loading } = useSession();
  const [booking, setBooking] = useState({}); // [booking, setBooking
  const router = useRouter();
  const { bookingId } = router.query;

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <EmployerNavbar session={session} />
      <BookingViewContent session={session} />
      <Footer />
    </div>
  );
};

export default BookingView;
