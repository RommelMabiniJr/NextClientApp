import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { ConfigService } from "@/layout/service/ConfigService";

const BenefitSection = ({
  tempOfferDetails,
  setTempOfferDetails,
  benefitsOptions,
}) => {
  const [categories, setCategories] = useState([]);

  // REF:
  // [
  //   "Social Security System (SSS) Coverage",
  //   "Philippine Health Insurance Corporation (PhilHealth) Membership",
  //   "Home Development Mutual Fund (Pag-IBIG Fund) Membership",
  //   "13th-month Pay Bonus",
  //   "5 Days of Paid Leave (Available After 1 Year of Service)",
  //   "Guaranteed Weekly Rest Day",
  //   "Access to Medical Assistance",
  //   "Financial Transportation Allowance",
  //   "Meals Provided During Work Hours",
  // ]

  const [selectedBenefits, setSelectedBenefits] = useState(() => {
    const initialBenefits = categories.filter((category) =>
      tempOfferDetails.benefits.includes(category)
    );
    return initialBenefits;
  });

  useEffect(() => {
    setCategories(benefitsOptions);
  }, [benefitsOptions]);

  const onBenefitChange = (e) => {
    let _selectedBenefits = [...selectedBenefits];

    if (e.checked) _selectedBenefits.push(e.value);
    else
      _selectedBenefits = _selectedBenefits.filter(
        (category) => category !== e.value
      );

    setSelectedBenefits(_selectedBenefits);

    // assign to tempOfferDetails the selected benefits only the name values and stored as arrays
    setTempOfferDetails({
      ...tempOfferDetails,
      benefits: _selectedBenefits.map((benefit) => benefit),
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
            <div key={benefit} className="flex align-items-center">
              <Checkbox
                inputId={benefit}
                name="benefit"
                value={benefit}
                onChange={onBenefitChange}
                checked={selectedBenefits.some((item) => item === benefit)}
              />
              <label htmlFor={benefit} className="ml-2">
                {benefit}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitSection;
