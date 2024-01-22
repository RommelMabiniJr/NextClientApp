import EmployerNavbar from "@/layout/EmployerNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Accordion, AccordionTab } from "primereact/accordion";
import ContactInformation from "@/layout/components/employer/information/contact";
import HouseholdInformation from "@/layout/components/employer/information/household";
import PaymentInformation from "@/layout/components/employer/information/payment";
import DisplayHeader from "@/layout/components/Cropper";

export default function EmployerProfile() {
  const { data: session, status } = useSession();
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

    // check if uuid is in router query before fetching employer data
    if (router.query.uuid) {
      fetchEmployer();
    }
  }, [router.query.uuid]);

  const handleSignOut = () => {
    signOut();
  };

  const handleImgClick = () => {
    console.log("clicked");
  };

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      {isLoading || !employer ? (
        <p>Loading...</p>
      ) : (
        <div className="p-5">
          <DisplayHeader session={session} />
          <Accordion multiple activeIndex={[0, 1, 2, 3]}>
            <AccordionTab header="Contact Information">
              <ContactInformation session={session} />
            </AccordionTab>
            <AccordionTab header="Household Information">
              <HouseholdInformation session={session} employer={employer} />
            </AccordionTab>
            <AccordionTab header="Preference Information">
              <PaymentInformation session={session} employer={employer} />
            </AccordionTab>
          </Accordion>
        </div>
      )}
    </div>
  );
}
