import WorkerNavbar from "@/layout/WorkerNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Accordion, AccordionTab } from "primereact/accordion";
import ContactInformation from "@/layout/components/worker/information/contact";
import WorkerInformation from "@/layout/components/worker/information/workerInfo";
import ExperienceInformation from "@/layout/components/worker/information/experience";
import BackgroundInformation from "@/layout/components/worker/information/background";
import DocumentsInformation from "@/layout/components/worker/information/documents";
import DisplayHeader from "@/layout/components/Cropper";

export default function WorkerProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [worker, setWorker] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch worker data on page load
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    // console.log("router.query.uuid:", router.query.uuid);
    const fetchWorker = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${serverUrl}/worker/${router.query.uuid}`
        );

        //convert skills comma separated string to array
        response.data.skills = response.data.skills.split(",");

        setWorker(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    // check if uuid is in router query before fetching worker data
    if (router.query.uuid) {
      fetchWorker();
    }
  }, [router.query.uuid]);

  // console.log("worker:", worker);

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
    <div>
      <WorkerNavbar session={session} handleSignOut={handleSignOut} />
      {isLoading || !worker ? (
        <p>Loading...</p>
      ) : (
        <div className="p-5">
          <DisplayHeader session={session} />
          <Accordion multiple activeIndex={[0, 1, 2, 3]}>
            <AccordionTab header="Contact Information">
              <ContactInformation session={session} />
            </AccordionTab>
            <AccordionTab header="Worker Information">
              <WorkerInformation session={session} worker={worker} />
            </AccordionTab>
            <AccordionTab header="Experience">
              <ExperienceInformation session={session} worker={worker} />
            </AccordionTab>
            <AccordionTab header="Background">
              <BackgroundInformation session={session} worker={worker} />
            </AccordionTab>
            <AccordionTab header="Miscellaneous">
              <DocumentsInformation
                session={session}
                documents={worker.documents}
              />
            </AccordionTab>
          </Accordion>
        </div>
      )}
    </div>
  );
}
