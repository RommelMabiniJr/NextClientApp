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

const OfferDetails = ({
  offerDetails,
  tempOfferDetails,
  setTempOfferDetails,
  offerStatus,
  offerEvents,
  hasExistingOffer,
  isEditMode,
  setIsEditMode,
  handleUpdate,
  handleSendOffer,
  session,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [benefitsOptions, setBenefitsOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]); // ["Daily", "Weekly", "Monthly", "Annually"
  const [salaryRange, setSalaryRange] = useState([]); // [10000, 20000]
  const formatHelper = FormatHelper();

  useEffect(() => {
    // get the benefits from the config service
    const fetchBenefitsOptions = async () => {
      const CONFIG_NAME = "Benefits";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const benefits = formatHelper.stringToArray(response.data.config_value);

        setBenefitsOptions(benefits);
      }
    };

    const fetchSalaryOptions = async () => {
      const CONFIG_NAME = "Salary";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const salaryRange = formatHelper.stringToArray(
          response.data.config_value
        );
        setSalaryRange(salaryRange);
      }
    };

    const fetchFrequencyOptions = async () => {
      const CONFIG_NAME = "Frequency of Payment";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const frequencyOptions = formatHelper.stringToArray(
          response.data.config_value
        );

        // format the frequency options to be used in the dropdown
        const formattedFrequencyOptions = frequencyOptions.map((option) => ({
          name: option,
          value: option,
        }));

        setFrequencyOptions(formattedFrequencyOptions);
      }
    };

    fetchBenefitsOptions();
    fetchSalaryOptions();
    fetchFrequencyOptions();
  }, []);

  const deadlineOptions = [
    { name: "1 day", value: "1" },
    { name: "2 days", value: "2" },
    { name: "3 days", value: "3" },
    { name: "4 days", value: "4" },
    { name: "5 days", value: "5" },
    { name: "6 days", value: "6" },
    { name: "7 days", value: "7" },
  ];

  const payFrequencyOptions = [
    { name: "Daily", value: "Daily" },
    { name: "Weekly", value: "Weekly" },
    {
      name: "Bi-weekly (every two weeks)",
      value: "Bi-weekly (every two weeks)",
    },
    {
      name: "Semi-monthly (twice a month)",
      value: "Semi-monthly (twice a month)",
    },
    { name: "Monthly", value: "Monthly" },
    {
      name: "Quarterly (every three months)",
      value: "Quarterly (every three months)",
    },
    {
      name: "Semi-annually (twice a year)",
      value: "Semi-annually (twice a year)",
    },
    { name: "Annually", value: "Annually" },
  ];

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    // reset the offer details to the original details
    setTempOfferDetails(offerDetails);

    setIsEditMode(false);
  };

  const handleInputChange = (e, name) => {
    // console.log(e.target.value);
    const { value } = e.target;
    setTempOfferDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBenefitAdd = () => {
    // Get the current value from the input
    const newBenefit = document.getElementById("benefitInput").value;

    // Check if the input is not empty
    if (newBenefit.trim() !== "") {
      setTempOfferDetails((prevDetails) => ({
        ...prevDetails,
        benefits: [...prevDetails.benefits, newBenefit.trim()],
      }));

      // Clear the input
      document.getElementById("benefitInput").value = "";
    }
  };

  const handleDeadlineChange = (e) => {
    // console.log(e.target.value);
    const { value } = e.target;
    setTempOfferDetails((prevDetails) => ({ ...prevDetails, deadline: value }));
  };

  const handlePayFrequencyChange = (e) => {
    const { value } = e.target;
    setTempOfferDetails((prevDetails) => ({
      ...prevDetails,
      payFrequency: value,
    }));
  };

  const handleBenefitRemove = (benefit) => {
    setTempOfferDetails((prevDetails) => ({
      ...prevDetails,
      benefits: prevDetails.benefits.filter((b) => b !== benefit),
    }));
  };

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
        <span
          className="cursor-pointer rounded-md hover:bg-gray-200 py-2 px-3"
          onClick={() => setSidebarVisible(true)}
        >
          <i className="pi pi-history"></i>
        </span>
      </div>
      <div className="Offer-Section mt-2">
        {!isEditMode ? (
          <div>
            <div style={{ display: "grid" }} className="grid-cols-2 mb-4">
              <div className="flex-1 mr-4 ">
                <label className="text-sm text-primary-400 font-medium mb-2">
                  Deadline:
                </label>
                <div className="py-2">
                  {tempOfferDetails.deadline ? (
                    <span className="text-lg font-bold text-grey-600">
                      {tempOfferDetails.deadline} day(s) from now
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gray-600">
                      No deadline set
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-primary-400 font-medium mb-2">
                  Proposed Salary {"(PHP)"}:
                </label>
                <div className="py-2 font-bold">
                  {tempOfferDetails.salary ? (
                    <span className="text-lg font-bold text-grey-600">
                      {formatSalary(tempOfferDetails.salary)}
                    </span>
                  ) : (
                    <span className="text-lg font-medium text-gray-400">
                      No salary set
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-primary-400 font-medium mb-2">
                Payment Frequency
              </label>
              <div className="py-2">
                {tempOfferDetails.payFrequency ? (
                  <span className="text-lg font-bold text-grey-600">
                    {tempOfferDetails.payFrequency}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-gray-600">
                    No payment frequency set
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-400">
                Benefits
              </label>
              <div className="mb-3">
                <ul className="">
                  {Array.isArray(tempOfferDetails.benefits) ? (
                    tempOfferDetails.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-base text-gray-700 mb-1 m-2 ml-4 "
                        style={{ listStyleType: "disc" }}
                        // disabled={!isEditMode}
                      >
                        <div className="flex items-center justify-between">
                          <span className="mr-2">{benefit}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <span className="text-lg text-gray-600">
                      No benefits set
                    </span>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex justify-center w-full gap-2">
              <Button
                type="button"
                outlined
                label="Edit Offer"
                className="p-button-secondary w-full flex-1"
                onClick={handleEdit}
              />
            </div>
          </div>
        ) : (
          <form>
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

                <InputNumber
                  inputId="currency-ph"
                  value={tempOfferDetails.salary}
                  onValueChange={(e) => handleInputChange(e, "salary")}
                  mode="currency"
                  currency="PHP"
                  locale="en-US"
                  className="mt-2 rounded-md w-full"
                  placeholder="e.g. 15,000"
                  // convert the salary range to number
                  min={parseInt(salaryRange[0])}
                  // max={parseInt(salaryRange[1])} // TODO: uncomment this when the salary range is resolved
                  // disabled={!isEditMode}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Frequency
              </label>
              <Dropdown
                value={tempOfferDetails.payFrequency}
                onChange={(e) => handlePayFrequencyChange(e)}
                options={frequencyOptions}
                optionLabel="name"
                placeholder="Select a Deadline"
                className="w-full mt-2"
                // disabled={!isEditMode}
              />
            </div>
            <BenefitSection
              tempOfferDetails={tempOfferDetails}
              setTempOfferDetails={setTempOfferDetails}
              benefitsOptions={benefitsOptions}
            />
            <div className="flex justify-center md:justify-end">
              {hasExistingOffer ? (
                <div className="flex w-full">
                  <Button
                    type="button"
                    label="Update"
                    className="p-button-primary mr-2 w-8rem flex-1"
                    onClick={handleUpdate}
                  />
                  <Button
                    type="button"
                    label="Cancel"
                    className="p-button-secondary w-8rem flex-1"
                    onClick={handleCancel}
                  />
                </div>
              ) : (
                <div className="flex w-full">
                  <Button
                    type="button"
                    label="Submit Offer"
                    className="p-button-primary w-full"
                    onClick={handleSendOffer}
                  />
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      <OfferTimeline
        offerEvents={offerEvents}
        session={session}
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
    </div>
  );
};

export default OfferDetails;
