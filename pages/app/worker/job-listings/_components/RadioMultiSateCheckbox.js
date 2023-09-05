import { useState } from "react";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";

function RadioMultiStateCheckbox({ options, selectedOption, onChange }) {
  const handleOptionChange = (option) => {
    if (selectedOption === option) {
      // If the clicked option is already selected, deselect it
      onChange(null);
    } else {
      // Otherwise, select the clicked option
      onChange(option);
    }
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.value} className="mb-3">
          <MultiStateCheckbox
            value={selectedOption === option.value}
            options={[option]}
            optionValue="value"
            onChange={(e) => handleOptionChange(option.value)}
          />
          <span className="vertical-align-middle ml-2">
            {option.label}{" "}
            {selectedOption === option.value ? `(${option.label})` : "(none)"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RadioMultiStateCheckbox;
