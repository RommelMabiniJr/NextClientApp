import EmployerNavbar from "@/layout/EmployerNavbar";
import Footer from "@/layout/Footer";
import FooterLinks from "@/layout/LandingPageComponents/AppFooter";
import BookingsContent from "@/layout/components/employer/bookings/BookingsContent";
import { useSession } from "next-auth/react";

const Bookings = () => {
  const { data: session, status, loading } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <EmployerNavbar session={session} />
      <BookingsContent session={session} />
      <FooterLinks />
    </div>
  );
};

export default Bookings;
