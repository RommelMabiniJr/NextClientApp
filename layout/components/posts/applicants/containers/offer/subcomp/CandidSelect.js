import { formatSalary } from "@/layout/components/utils/moneyFormatUtils";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import OfferTimeline from "./OfferTimeline";
import { InputText } from "primereact/inputtext";
import BenefitSection from "./sections/BenefitSection";
import FormatHelper from "@/lib/formatHelper";
import { ConfigService } from "@/layout/service/ConfigService";

const CandidSelect = ({}) => {
  const [offerStatus, setOfferStatus] = useState("pending");
  const [tempOfferDetails, setTempOfferDetails] = useState({
    deadline: 1,
  });

  const deadlineOptions = [
    { name: "1 day", value: "1" },
    { name: "2 days", value: "2" },
    { name: "3 days", value: "3" },
    { name: "4 days", value: "4" },
    { name: "5 days", value: "5" },
    { name: "6 days", value: "6" },
    { name: "7 days", value: "7" },
  ];

  const renderOfferBadge = (offerStatus) => {
    let badgeClass = "bg-gray-50";
    let badgeText = "Pending"; // Default status text

    switch (offerStatus) {
      case "accepted":
        badgeClass = "bg-green-50 text-green-700 ring-green-600/20";
        badgeText = "Accepted";
        break;
      case "declined":
        badgeClass = "bg-red-50 text-red-700 ring-red-600/10";
        badgeText = "Rejected";
        break;
      case "updated":
        badgeClass = "bg-blue-50 text-blue-700 ring-blue-600/10";
        badgeText = "Updated";
        break;
      case "no response":
        badgeClass = "bg-gray-50 text-gray-600 ring-gray-600/10";
        badgeText = "Expired";
        break;
      case "pending":
        badgeClass = "bg-yellow-50 text-yellow-800 ring-yellow-500/10";
        badgeText = "Pending";
        break;

      // Add more cases as needed

      // Default case for pending or other statuses
      default:
        badgeClass = "bg-gray-50 text-gray-600 ring-gray-500/10";
        badgeText = "No Offer";
    }

    return (
      <span
        className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeClass} ring-1 ring-inset ring-gray-500/10`}
      >
        {badgeText}
      </span>
    );
  };

  return (
    <div className="w-full md:w-6 lg:w-5 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-medium mb-2">
          Offer Status: {renderOfferBadge(offerStatus)}
        </h3>
        {/* <span
          className="cursor-pointer rounded-md hover:bg-gray-200 py-2 px-3"
          onClick={() => setSidebarVisible(true)}
        >
          <i className="pi pi-history"></i>
        </span> */}
      </div>
      <div className="flex w-full mb-4">
        <div className="mr-4">
          <label className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <Dropdown
            // find value from the options
            value={tempOfferDetails.deadline.toString()}
            onChange={(e) => handleDeadlineChange(e)}
            options={deadlineOptions}
            optionLabel="name"
            placeholder="Select a Deadline"
            className="w-full mt-2"
            // disabled={!isEditMode}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Proposed Salary {"(PHP)"}
          </label>
          <Button label="Send Offer" className="w-full mt-2" />
        </div>
      </div>
    </div>
  );
};

export default CandidSelect;
