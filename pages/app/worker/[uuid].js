import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession, useSession, signOut } from "next-auth/react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Accordion, AccordionTab } from "primereact/accordion";
import ImgCropper from "@/layout/components/Cropper";
import axios from "axios";
import WorkerNavbar from "@/layout/WorkerNavbar";
import ContactInformation from "./information/contact";
import WorkerInformation from "./information/workerInfo";
import ExperienceInformation from "./information/experience";
import BackgroundInformation from "./information/background";
import DisplayHeader from "@/layout/components/Cropper";

export default function WorkerProfile() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleSignOut = () => {
    signOut();
  };

  const router = useRouter();
  const [worker, setWorker] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch worker data on page load
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchWorker = async () => {
      setIsLoading(true);
      try {
        // console.log(router.query.uuid)
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
    fetchWorker();
  }, [session, router.query.uuid]);

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleImgClick = () => {
    setVisible(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
    }
  };

  const handleFileUpload = () => {
    // TODO: Handle file upload logic here
    setVisible(false);
  };

  const footer = (
    <>
      <Button label="Upload" onClick={handleFileUpload} />
      <Button
        label="Cancel"
        onClick={() => setVisible(false)}
        className="p-button-secondary"
      />
    </>
  );

  return (
    <div>
      {/* {console.log(worker)} */}
      <WorkerNavbar session={session} handleSignOut={handleSignOut} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="p-5">
            {/* {displayHeader()} */}
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
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
}
