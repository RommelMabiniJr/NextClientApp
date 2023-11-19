import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";

// Container imports
import AppliedContainer from "./containers/applied/AppliedContainer";
import ScreeningContainer from "./containers/screening/ScreeningContainer";
import InterviewContainer from "./containers/interview/InterviewContainer";
import OfferContainer from "./containers/offer/OfferContainer";
import HiredContainer from "./containers/hired/HiredContainer";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ApplicationStageServices } from "@/layout/service/ApplicationStageService";
import { ScreeningService } from "@/layout/service/ScreeningService";

/**
 * Renders a tab view component for displaying different stages of job applicants.
 * @param {Object} props - The props object containing applicants and distances data.
 * @param {Array} props.applicants - The array of job applicants.
 * @param {Array} props.distances - The array of distances between the user's location and the applicants' locations.
 * @returns {JSX.Element} - The JSX element representing the tab view component.
 */
export default function ApplicationTabs({
  applicants,
  distances,
  postId,
  session,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningResults, setScreeningResults] = useState([]);
  const [interviewResults, setInterviewResults] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [offer, setOffer] = useState({
    salary: 10000.0,
    payFrequency: "monthly",
    benefits: [
      "Health Insurance",
      "Dental Insurance",
      "Vision Insurance",
      "Free Lunch",
      "Free Snacks",
      "Free Coffee",
      "Free Beer",
      "Free Parking",
      "Free Gym Membership",
    ],
  });

  const breadcrumbItems = [
    { label: "Posts", url: "/app/posts" },
    { label: "Applicants", command: () => setActiveIndex(0) },
  ];

  useEffect(() => {
    console.log("Active index: ", activeIndex);
  }, [activeIndex]);

  const tabHeaderTemplate = (options) => {
    const headerItems = [
      { label: "Applications", icon: "pi pi-users" },
      { label: "Screening Process", icon: "pi pi-id-card" },
      { label: "Reviewing", icon: "pi pi-eye" },
      { label: "Interviews", icon: "pi pi-comments" },
      { label: "Job Offer", icon: "pi pi-wallet" },
      { label: "Hired Applicant", icon: "pi pi-briefcase" },
    ];

    const title = options.titleElement.props.children; // access title property from TabPanel to be
    const currentItem = headerItems.find((item) => item.label == title);

    return (
      <button
        type="button"
        onClick={options.onClick}
        className={options.className + " text-base font-semibold"}
      >
        <i
          className={
            currentItem ? currentItem.icon + " mr-2" : "pi pi-question" // access icon property from headerItems
          }
        />
        {/* Fallback icon if not found */}
        {options.titleElement}
      </button>
    );
  };

  const handleConfirmScreening = (position) => {
    const accept = () => {
      ApplicationStageServices.startJobPostApplication(postId);
      setActiveIndex(1);
      setIsScreening(true); // disable the first tab
    };

    const reject = () => {};

    confirmDialog({
      message: (
        <div className="">
          Are you sure you want to continue with the screening process?
          <span className="block text-sm text-gray-600">
            This will close the application and you will no longer receive new
            applicants.
          </span>
        </div>
      ),
      // "Are you sure you want to continue with the screening process? This will close the application and you will no longer receive new applicants.",
      header: "Screening Confirmation",
      icon: "pi pi-exclamation-triangle",
      position,
      accept,
      reject,
    });
  };

  const handleStageMove = (stageIndex) => {
    switch (stageIndex) {
      case 1:
        const shortenedScreeningResult = screeningResults.map(
          ({ applicant: { application_id }, result }) => ({
            applicant: { application_id },
            result,
          })
        );

        ScreeningService.saveScreeningResults(
          postId,
          shortenedScreeningResult
        ).then((res) => {
          console.log(res);
        });
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
        break;
    }

    setActiveIndex(stageIndex + 1); // proceed to move to the next stage in UI
  };

  const StageMoverTemplate = () => {
    return (
      <div className="flex items-center">
        <Button
          className="mr-5"
          icon="pi pi-arrow-left"
          iconPos="right"
          outlined
          onClick={() => handleConfirmScreening("top-right")}
        />
        <div>Stage {activeIndex + 1} of 5</div>
        <Button
          className="ml-5"
          icon="pi pi-arrow-right"
          iconPos="right"
          outlined
          onClick={() => handleStageMove(activeIndex)}
          disabled={activeIndex == 5}
        />
      </div>
    );
  };

  const home = { icon: "pi pi-home", url: "/app/employer-dashboard" };

  return (
    <div className="">
      <BreadCrumb
        model={breadcrumbItems}
        home={home}
        pt={{
          root: { className: "border-0 p-0 pt-0 pb-4" },
        }}
      />
      <div className="mb-3 flex justify-between ">
        <div className="flex flex-column">
          <div
          // className="mb-3"
          >
            <div className="font-medium text-900 text-2xl mb-1">
              Review and Manage Applications
            </div>

            <div className="text-500 text-sm">
              Manage the application process of your job post.
            </div>
          </div>

          {/* <div className="flex gap-5">
            <div className="flex flex-column ">
              <div className="text-900 mr-2 font-medium text-lg">
                Progress:{" "}
              </div>
              <div
                className={`text-600 font-semibold ${
                  isScreening ? "text-green-500" : "text-gray-500"
                }`}
              >
                {isScreening ? "On Going Evaluation" : "Not Started"}
              </div>
            </div>
            <div className="flex flex-column ">
              <div className="text-900 mr-2 font-medium text-lg">Stage: </div>
              <div
                className={`text-600 font-semibold ${
                  isScreening ? "text-green-500" : "text-gray-500"
                }`}
              >
                {isScreening ? "On Going Evaluation" : "Not Started"}
              </div>
            </div>
          </div> */}
        </div>
        <div>
          <ConfirmDialog
            contentClassName="w-3"
            pt={{ message: { className: "" } }}
          />
          {isScreening ? ( // if screening is ongoing, disable the first tab
            <StageMoverTemplate />
          ) : (
            <Button
              label="Start Kasambahay Selection"
              className="mr-5"
              icon="pi pi-arrow-right"
              iconPos="right"
              outlined
              onClick={() => handleConfirmScreening("top-right")}
            />
          )}
        </div>
      </div>
      <TabView
        items
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel
          header="Applications"
          headerTemplate={tabHeaderTemplate}
          disabled={isScreening}
        >
          <AppliedContainer
            postId={postId}
            applicants={applicants}
            distances={distances}
            setActiveIndex={setActiveIndex}
            setIsScreening={setIsScreening}
          />
        </TabPanel>
        <TabPanel
          header="Screening Process"
          headerTemplate={tabHeaderTemplate}
          disabled={!isScreening}
        >
          <ScreeningContainer
            postId={postId}
            applicants={applicants}
            distances={distances}
            setScreeningResults={setScreeningResults}
          />
        </TabPanel>
        <TabPanel
          header="Interviews"
          headerTemplate={tabHeaderTemplate}
          disabled={!isScreening}
        >
          <InterviewContainer
            applicants={applicants}
            distances={distances}
            postId={postId}
            setInterviewResults={setInterviewResults}
          />
        </TabPanel>
        <TabPanel
          header="Job Offer"
          headerTemplate={tabHeaderTemplate}
          disabled={!isScreening}
        >
          <OfferContainer
            postId={postId}
            applicants={applicants}
            interviewResults={interviewResults}
            session={session}
          />
        </TabPanel>
        <TabPanel
          header="Hired Applicant"
          headerTemplate={tabHeaderTemplate}
          disabled={!isScreening}
        >
          <HiredContainer applicant={applicants[0]} offer={offer} />
        </TabPanel>
      </TabView>
    </div>
  );
}
