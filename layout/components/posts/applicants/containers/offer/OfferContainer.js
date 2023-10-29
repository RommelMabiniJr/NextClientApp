import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast"; // Import Toast component
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

const OfferContainer = ({ applicants }) => {
  const [offerDetails, setOfferDetails] = useState({
    salary: "",
    benefits: "",
    // Add more fields as needed
    deadline: "",
    payFrequency: "",
  });
  const [selectedApplicant, setSelectedApplicant] = useState(applicants[0]); // Default to the first applicant in the list
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [benefitInput, setBenefitInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const toast = useRef(null); // Reference to the Toast component
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
  const handleSave = () => {
    setIsEditMode(false);
    // Additional logic to save the edited details
  };
  const handleCancel = () => {
    setIsEditMode(false);
    // Additional logic to cancel the edit and revert changes
  };

  const handleInputChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;
    setOfferDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBenefitAdd = () => {
    // Get the current value from the input
    const newBenefit = document.getElementById("benefitInput").value;

    // Check if the input is not empty
    if (newBenefit.trim() !== "") {
      setOfferDetails((prevDetails) => ({
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
    setOfferDetails((prevDetails) => ({ ...prevDetails, deadline: value }));
  };

  const handlePayFrequencyChange = (e) => {
    const { value } = e.target;
    setOfferDetails((prevDetails) => ({ ...prevDetails, payFrequency: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle offer submission, e.g., send details to the backend
    console.log("Offer Details:", offerDetails);

    // Show notification for successful offer submission
    showNotification("success", "Offer submitted successfully!");
  };

  // Function to display the Toast notification
  const showNotification = (severity, detail) => {
    toast.current.show({
      severity,
      summary: "Notification",
      detail,
      life: 3000,
    });
  };

  const handleSelectApplicant = (action) => {
    if (action === "prev") {
      setCurrentCandidateIndex((prevIndex) => prevIndex - 1);
      setSelectedApplicant(applicants[currentCandidateIndex - 1]);
    } else if (action === "next") {
      setCurrentCandidateIndex((prevIndex) => prevIndex + 1);
      setSelectedApplicant(applicants[currentCandidateIndex + 1]);
    }
  };

  return (
    <div className="divide-y">
      <div className="mb-4 ">
        <Toast ref={toast} />
        <h2 className="text-xl font-semibold mb-4 mt-0">Offer Stage</h2>
        {selectedApplicant && (
          <div className="flex items-center gap-x-4">
            <div className="applicant-container flex flex-column md:flex-row md:items-center justify-between flex-1">
              <div className="applicant-info flex items-center ">
                <img
                  className="h-12 flex-none rounded-full bg-gray-50 mr-3"
                  src={selectedApplicant.information.profile_url}
                  alt=""
                />
                <div className="mr-3">
                  <h3 className="text-lg font-medium mb-0 m-0">
                    {selectedApplicant.information.first_name}{" "}
                    {selectedApplicant.information.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 ">
                    {selectedApplicant.information.email}
                  </p>
                </div>
              </div>
              <div className="applicant-action mt-2 md:mt-0">
                <Button
                  type="button"
                  size="small"
                  severity="secondary"
                  label="Disqualify"
                  className="py-2 mr-2"
                  outlined
                />

                <Button
                  type="button"
                  size="small"
                  label="Send Offer"
                  className="py-2"
                />
              </div>
            </div>
            <div>
              <Button
                size="small"
                type="button"
                icon="pi pi-chevron-left"
                className="p-button-secondary"
                text
                onClick={() => handleSelectApplicant("prev")}
                disabled={currentCandidateIndex === 0}
              />
              <Button
                size="small"
                type="button"
                icon="pi pi-chevron-right"
                className="p-button-secondary"
                text
                onClick={() => handleSelectApplicant("next")}
                disabled={currentCandidateIndex === applicants.length - 1}
              />
            </div>
          </div>
        )}
      </div>
      <div className="block md:flex gap-x-10 ">
        <div className="flex-1 mt-4">
          {/* <h3 className="text-sm text-primary-400 font-medium mb-2">Job</h3> */}
          <div className="mb-4">
            <h3 className="text-sm text-primary-400 font-medium mb-2">Title</h3>
            <p className="text-lg font-medium m-0 mb-1">
              Part-time Nanny for 2 children
            </p>
            <div className="">
              <Tag value="Part-time" className="mr-2 text-xs"></Tag>
              <Tag
                value="Child Care"
                className=" text-xs"
                severity="warning"
              ></Tag>
            </div>
          </div>
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Description
          </h3>
          <p className="text-sm font-base mb-4">
            We are looking for a part-time nanny for our 2 children. We are
            looking for someone who can work 3 days a week from 8am to 5pm. We
            are looking for someone who can help with light housework and meal
            preparation for the children.
          </p>
          <div style={{ display: "grid" }} className="grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Location
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-map-marker mr-2"></span> */}
                  General Luna St, Buntay, Abuyog, Leyte
                </p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Arrangement
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-calendar mr-2"></span> */}
                  Live-in with shared room
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "grid" }} className="grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Dates
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-calendar mr-2"></span> */}
                  October 1 - November 30, 2021
                </p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-primary-400 font-medium mb-2">
                Working Hours
              </h3>
              <div className="mb-4">
                <p className="text-sm font-base mb-0 align-middle">
                  {/* <span className="pi pi-clock mr-2"></span> */}
                  8am - 5pm
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-5 pt-6">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full mb-4">
              <div className="mr-4">
                <label className="block text-sm font-medium text-gray-700">
                  Deadline
                </label>
                <Dropdown
                  value={offerDetails.deadline}
                  onChange={(e) => handleDeadlineChange(e)}
                  options={deadlineOptions}
                  optionLabel="name"
                  placeholder="Select a Deadline"
                  className="w-full mt-2"
                  disabled={!isEditMode}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Proposed Salary {"(PHP)"}
                </label>
                <InputNumber
                  inputId="currency-ph"
                  value={offerDetails.salary}
                  onValueChange={handleInputChange}
                  mode="currency"
                  currency="PHP"
                  locale="en-US"
                  className="mt-2 rounded-md w-full"
                  placeholder="e.g. 15,000"
                  disabled={!isEditMode}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Frequency
              </label>
              <Dropdown
                value={offerDetails.payFrequency}
                onChange={(e) => handlePayFrequencyChange(e)}
                options={payFrequencyOptions}
                optionLabel="name"
                placeholder="Select a Deadline"
                className="w-full mt-2"
                disabled={!isEditMode}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Separate benefits by pressing Add Button
                </p>
              </div>
              <div className="mb-3">
                <ul className="pl-5">
                  {offerDetails.benefits &&
                    offerDetails.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-base text-gray-700 mb-1 m-2"
                        style={{ listStyleType: "disc" }}
                        disabled={!isEditMode}
                      >
                        <div className="flex items-center justify-between">
                          <span className="mr-2">{benefit}</span>
                          <Button
                            text
                            type="button"
                            size="small"
                            disabled={!isEditMode}
                            className="pi pi-trash text-red-800 cursor-pointer"
                            onClick={() => {
                              setOfferDetails((prevDetails) => ({
                                ...prevDetails,
                                benefits: prevDetails.benefits.filter(
                                  (b) => b !== benefit
                                ),
                              }));
                            }}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="flex">
                <InputText
                  id="benefitInput"
                  className="mt-1 border border-gray-300 rounded-md w-full"
                  disabled={!isEditMode}
                />
                <Button
                  type="button"
                  // label="Add"
                  icon="pi pi-plus"
                  className="ml-2 w-4rem"
                  onClick={handleBenefitAdd}
                  disabled={!isEditMode}
                />
              </div>
            </div>
            {isEditMode ? (
              <div className="flex">
                <Button
                  type="button"
                  label="Save"
                  className="p-button-success mr-2"
                  onClick={handleSave}
                />
                <Button
                  type="button"
                  label="Cancel"
                  className="p-button-secondary"
                  onClick={handleCancel}
                />
              </div>
            ) : (
              <Button
                type="button"
                label="Edit"
                className="p-button-primary"
                onClick={handleEdit}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferContainer;
