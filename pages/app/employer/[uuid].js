import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import EmployerNavbar from "@/layout/EmployerNavbar";
import { Accordion, AccordionTab } from "primereact/accordion";
import ContactInformation from "@/layout/components/employer/information/contact";
import HouseholdInformation from "@/layout/components/employer/information/household";
import PaymentInformation from "@/layout/components/employer/information/payment";
import DisplayHeader from "@/layout/components/Cropper";

export default function EmployerProfile() {
  const { data: session, status } = useSession();
  const handleSignOut = () => {
    signOut();
  };

  const router = useRouter();
  const [employer, setEmployer] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employer data on page load

  useEffect(() => {
    const fetchEmployer = async () => {
      setIsLoading(true);
      try {
        // console.log(router.query.uuid);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

        const response = await axios.get(
          `${serverUrl}/employer/${router.query.uuid}`
        );
        setEmployer(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchEmployer();
    console.log(session);
  }, [session, router.query.uuid]);

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleImgClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <EmployerNavbar session={session} handleSignOut={handleSignOut} />
          <div className="p-5">
            <DisplayHeader session={session} />
            <Accordion multiple activeIndex={[0, 1, 2, 3]}>
              {/* {displayHeader()} */}
              <AccordionTab header="Contact Information">
                <ContactInformation session={session} />
              </AccordionTab>
              <AccordionTab header="Household Information">
                <HouseholdInformation session={session} employer={employer} />
              </AccordionTab>
              <AccordionTab header="Payment Information">
                <PaymentInformation session={session} employer={employer} />
              </AccordionTab>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
}
