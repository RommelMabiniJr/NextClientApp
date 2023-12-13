import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";

const BenefitSection = ({ tempOfferDetails, setTempOfferDetails }) => {
  const categories = [
    {
      name: "Social Security System (SSS) Coverage",
      key: "sss",
    },
    {
      name: "Philippine Health Insurance Corporation (PhilHealth) Membership",
      key: "philhealth",
    },
    {
      name: "Home Development Mutual Fund (Pag-IBIG Fund) Membership",
      key: "pagibig",
    },
    {
      name: "13th-month Pay Bonus",
      key: "13thmonth",
    },
    {
      name: "5 Days of Paid Leave (Available After 1 Year of Service)",
      key: "5days",
    },
    {
      name: "Guaranteed Weekly Rest Day",
      key: "restday",
    },
    {
      name: "Access to Medical Assistance",
      key: "medical",
    },
    {
      name: "Financial Transportation Allowance",
      key: "transportation",
    },
    {
      name: "Meals Provided During Work Hours",
      key: "meals",
    },
  ];
  const [selectedBenefits, setSelectedBenefits] = useState(() => {
    const initialBenefits = categories.filter((category) =>
      tempOfferDetails.benefits.includes(category.name)
    );
    return initialBenefits;
  });

  const onBenefitChange = (e) => {
    let _selectedBenefits = [...selectedBenefits];

    if (e.checked) _selectedBenefits.push(e.value);
    else
      _selectedBenefits = _selectedBenefits.filter(
        (category) => category.key !== e.value.key
      );

    setSelectedBenefits(_selectedBenefits);

    // assign to tempOfferDetails the selected benefits only the name values and stored as arrays
    setTempOfferDetails({
      ...tempOfferDetails,
      benefits: _selectedBenefits.map((benefit) => benefit.name),
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Benefits
      </label>
      {/* <div>
        <p className="text-sm text-gray-500 mb-1">
          Separate benefits by pressing Add Button
        </p>
      </div> */}
      <div className="flex flex-column gap-3 mt-2">
        {categories.map((benefit) => {
          return (
            <div key={benefit.key} className="flex align-items-center">
              <Checkbox
                inputId={benefit.key}
                name="benefit"
                value={benefit}
                onChange={onBenefitChange}
                checked={selectedBenefits.some(
                  (item) => item.key === benefit.key
                )}
              />
              <label htmlFor={benefit.key} className="ml-2">
                {benefit.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitSection;
