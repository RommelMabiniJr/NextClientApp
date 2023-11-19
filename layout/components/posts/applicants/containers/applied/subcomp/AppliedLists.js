import { useState } from "react";
import { Rating } from "primereact/rating";
import ShowApplicantDialog from "./ShowApplicantDialog";

export default function AppliedLists({
  applicants,
  distances,
  topNumber,
  mode,
  handleAddApplicantAsPassed,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <ul role="list" className="divide-y divide-gray-100 w-full relative">
      {applicants.map((applicant, index) => (
        <ShowApplicantDialog
          mode={mode}
          key={applicant.email}
          applicant={applicant}
          distances={distances}
          displayAs={getDisplayAs(index + 1, topNumber)}
          handleAddApplicantAsPassed={handleAddApplicantAsPassed}
        />
      ))}
    </ul>
  );
}

// Function to determine displayAs value based on topNumber
const getDisplayAs = (applicantIndex, topNumber) => {
  if (topNumber !== null && topNumber !== undefined) {
    return applicantIndex <= topNumber ? "green" : "red";
  }
  return null; // Don't pass anything if topNumber is not provided
};
