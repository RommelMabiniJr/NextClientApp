import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";

// Container imports
import AppliedContainer from "./containers/applied/AppliedContainer";
import ScreeningContainer from "./containers/screening/ScreeningContainer";
import InterviewContainer from "./containers/interview/InterviewContainer";
import OfferContainer from "./containers/offer/OfferContainer";
import HiredContainer from "./containers/hired/HiredContainer";

/**
 * Renders a tab view component for displaying different stages of job applicants.
 * @param {Object} props - The props object containing applicants and distances data.
 * @param {Array} props.applicants - The array of job applicants.
 * @param {Array} props.distances - The array of distances between the user's location and the applicants' locations.
 * @returns {JSX.Element} - The JSX element representing the tab view component.
 */
export default function ApplicationTabs({ applicants, distances }) {
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    console.log("Active index: ", activeIndex);
  }, [activeIndex]);

  /**
   * Renders the header template for each tab panel.
   * @param {Object} options - The options object containing the title element and onClick function.
   * @returns {JSX.Element} - The JSX element representing the header template.
   */
  const tabHeaderTemplate = (options) => {
    const headerItems = [
      { label: "Applied", icon: "pi pi-users" },
      { label: "Screening", icon: "pi pi-id-card" },
      { label: "Reviewing", icon: "pi pi-eye" },
      { label: "Interview", icon: "pi pi-comments" },
      { label: "Offer", icon: "pi pi-wallet" },
      { label: "Hired", icon: "pi pi-briefcase" },
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

  return (
    <div className="">
      <TabView
        items
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Applied" headerTemplate={tabHeaderTemplate}>
          <AppliedContainer
            applicants={applicants}
            distances={distances}
            setActiveIndex={setActiveIndex}
          />
        </TabPanel>
        <TabPanel header="Screening" headerTemplate={tabHeaderTemplate}>
          <ScreeningContainer applicants={applicants} distances={distances} />
        </TabPanel>
        <TabPanel header="Interview" headerTemplate={tabHeaderTemplate}>
          <InterviewContainer applicants={applicants} distances={distances} />
        </TabPanel>
        <TabPanel header="Offer" headerTemplate={tabHeaderTemplate}>
          <OfferContainer applicants={applicants} />
        </TabPanel>
        <TabPanel
          header="Hired"
          headerTemplate={tabHeaderTemplate}
          // disabled
        >
          <HiredContainer applicant={applicants[0]} offer={offer} />
        </TabPanel>
      </TabView>
    </div>
  );
}
