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
import MoveStageModal from "./containers/subcomp/MoveStageModal";
import RevertStageModal from "./containers/subcomp/RevertStageModal";
import { InterviewService } from "@/layout/service/InterviewService";
import { OfferService } from "@/layout/service/OfferService";

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
  const [moveStagevisible, setMoveStageVisible] = useState(false);
  const [revertStageVisible, setRevertStageVisible] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState("application");
  const [screeningResults, setScreeningResults] = useState([]);
  const [interviewResults, setInterviewResults] = useState([]);

  const [hasScreening, setHasScreening] = useState(false); // if there is a screening result
  const [hasInterview, setHasInterview] = useState(false); // if there is an interview result
  const [hasOffer, setHasOffer] = useState(false); // if there is an offer result

  const { offerResult, setOfferResult } = useState(null);
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

  const stages = ["application", "screening", "interview", "offer", "hired"];

  const breadcrumbItems = [
    { label: "Posts", url: "/app/posts" },
    { label: "Applicants", command: () => setActiveIndex(0) },
  ];

  const updateStageRelatedStates = (stage) => {
    switch (stage) {
      case "application":
        setActiveIndex(0);
        setCurrentStageIndex(0);
        setCurrentStage("application");
        break;
      case "screening":
        setActiveIndex(1);
        setCurrentStageIndex(1);
        setCurrentStage("screening");
        break;
      case "interview":
        setActiveIndex(2);
        setCurrentStageIndex(2);
        setCurrentStage("interview");
        break;
      case "offer":
        setActiveIndex(3);
        setCurrentStageIndex(3);
        setCurrentStage("offer");
        break;
      case "hired":
        console.log("Hiasdasdred");
        setActiveIndex(4);
        setCurrentStageIndex(4);
        setCurrentStage("hired");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // console.log("Active index: ", activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    // get the current stage of the application
    const fetchApplicationUpdates = async () => {
      // get the current stage of the application
      const stage = await ApplicationStageServices.getCurrentStage(postId);

      if (stage) {
        updateStageRelatedStates(stage);
      }

      // get both screening and interview results if there are any
      const screeningResults = await ScreeningService.getScreeningResults(
        postId
      );

      const interviewResults = await InterviewService.getScheduledInterviews(
        postId
      );

      const offerResult = await OfferService.getOfferDetailsByJobId(postId);

      if (screeningResults.length > 0) {
        setHasScreening(true);
      }

      // check if interview results has a completed interview
      const hasCompletedInterview = interviewResults.some(
        (interview) => interview.status == "completed"
      );

      if (hasCompletedInterview) {
        setHasInterview(true);
      }

      if (offerResult.status == "accepted") {
        setHasOffer(true);
      }

      console.log("Screening results: ", screeningResults);
      console.log("Interview results: ", interviewResults);
      console.log("Offer result: ", offerResult);
    };

    fetchApplicationUpdates();
  }, [postId]);

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

  const determinePanelDisabled = (stage) => {
    // console.log("Current stage index: ", currentStageIndex);
    switch (stage) {
      case "application":
        return false;
      case "screening":
        // determine using the current stage index and also the screening results
        return currentStageIndex < 1;
      case "interview":
        return currentStageIndex < 2;
      case "offer":
        return currentStageIndex < 3;
      case "hired":
        return currentStageIndex < 4;
      default:
        return false;
    }
  };

  const determineMoveStageValid = (stage) => {
    switch (stage) {
      case "application":
        return true;
      case "screening":
        // console.log("Screening results: ", screeningResults);
        return hasScreening;
      case "interview":
        return hasInterview;
      case "offer":
        return hasOffer;
      case "hired":
        return true;
      default:
        return false;
    }
  };

  const handleConfirmScreening = (position) => {
    const accept = () => {
      ApplicationStageServices.startJobPostApplication(postId);
      setActiveIndex(1);
      setCurrentStage("screening");
      setCurrentStageIndex(1);
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

  const handleMoveStage = () => {
    // make sure the stage is not more than the last stage
    if (currentStageIndex == 5) {
      return;
    }

    const result = ApplicationStageServices.setCurrentStage(
      postId,
      stages[currentStageIndex + 1]
    );

    if (result) {
      setCurrentStageIndex(currentStageIndex + 1);
      setCurrentStage(stages[currentStageIndex + 1]);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleRevertStage = async () => {
    // make sure the stage is not less than the first stage
    if (currentStageIndex == 0) {
      return;
    }

    // TODO: make this into one request
    // reset any progress made in the current stage in the database
    const resetResult = await ApplicationStageServices.resetStage(postId);

    // set the current stage to the previous stage
    const result = await ApplicationStageServices.setCurrentStage(
      postId,
      stages[currentStageIndex - 1]
    );

    if (result) {
      setCurrentStageIndex(currentStageIndex - 1);
      setCurrentStage(stages[currentStageIndex - 1]);
      setActiveIndex(activeIndex - 1);
    }
  };

  const StageMoverTemplate = () => {
    return (
      <div className="flex items-center">
        <Button
          // label="Back"
          className="mr-5"
          icon="pi pi-arrow-left"
          iconPos="left"
          outlined
          onClick={() => setRevertStageVisible(true)}
          severity="danger"
          disabled={activeIndex == 0}
        />
        <div>Stage {activeIndex + 1} of 5</div>
        <Button
          // label="Confirm Stage"
          className="ml-5"
          icon="pi pi-arrow-right"
          iconPos="right"
          outlined
          onClick={() => setMoveStageVisible(true)}
          //check the validity of the stage
          disabled={
            currentStageIndex == 4 || !determineMoveStageValid(currentStage)
          }
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
      <RevertStageModal
        visible={revertStageVisible}
        setVisible={setRevertStageVisible}
        stages={stages}
        currentStage={currentStage}
        currentStageIndex={currentStageIndex}
        handleRevertStage={handleRevertStage}
      />
      <MoveStageModal
        visible={moveStagevisible}
        setVisible={setMoveStageVisible}
        stages={stages}
        currentStage={currentStage}
        currentStageIndex={currentStageIndex}
        handleMoveStage={handleMoveStage}
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
          {currentStage != "application" ? (
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
          disabled={determinePanelDisabled("application")}
        >
          <AppliedContainer
            postId={postId}
            applicants={applicants}
            distances={distances}
            setActiveIndex={setActiveIndex}
          />
        </TabPanel>
        <TabPanel
          header="Screening Process"
          headerTemplate={tabHeaderTemplate}
          disabled={determinePanelDisabled("screening")}
        >
          <ScreeningContainer
            postId={postId}
            applicants={applicants}
            distances={distances}
            setScreeningResults={setScreeningResults}
            screeningResults={screeningResults}
          />
        </TabPanel>
        <TabPanel
          header="Interviews"
          headerTemplate={tabHeaderTemplate}
          disabled={determinePanelDisabled("interview")}
        >
          <InterviewContainer
            applicants={applicants}
            distances={distances}
            postId={postId}
            setInterviewResults={setInterviewResults}
            setHasInterview={setHasInterview}
          />
        </TabPanel>
        <TabPanel
          header="Job Offer"
          headerTemplate={tabHeaderTemplate}
          disabled={determinePanelDisabled("offer")}
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
          disabled={determinePanelDisabled("hired")}
        >
          <HiredContainer postId={postId} />
        </TabPanel>
      </TabView>
    </div>
  );
}
