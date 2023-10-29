import EmployerNavbar from "@/layout/EmployerNavbar";
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
      <BookingsContent />
    </div>
  );
};

export default Bookings;
