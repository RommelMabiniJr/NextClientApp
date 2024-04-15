import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { ProgressBar } from "primereact/progressbar";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { PaymentService } from "@/layout/service/PaymentService";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import FileUploader from "@/layout/components/FileUploader";
import ProfilePictureUpload from "../../shared/profilecapture";

const HouseholdInformationStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  return (
    <div>
      <div className="flex gap-5">
        <div className="household-num-selection">
          <label
            htmlFor="householdSize"
            className="block text-900 font-medium mb-2"
          >
            Household Size
          </label>
          {/* <InputText
            {...props.formik.getFieldProps("householdSize")}
            id="householdSize"
            type="text"
            placeholder="Enter you household size"
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("householdSize"),
            })}
          /> */}

          <div className="w-full">
            <InputNumber
              showButtons
              id="householdSize"
              value={formik.values.householdSize}
              onValueChange={(e) => {
                formik.setFieldValue("householdSize", e.value);
              }}
              placeholder="Enter your household size"
              min={1}
              className={classNames("w-full", {
                "p-invalid": isFormFieldInvalid("householdSize"),
              })}
            />
          </div>
          {getFormErrorMessage("householdSize")}
        </div>
        <div className="pet-selection">
          <label htmlFor="hasPets" className="block text-900 font-medium mb-2">
            Employer Pets
          </label>
          <div className="flex flex-wrap justify-content-center gap-3 mt-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="dog"
                name="pets"
                value={formik.values.pets.dog}
                onChange={(e) => {
                  formik.setFieldValue("pets.dog", e.checked);
                }}
                checked={formik.values.pets.dog}
              />
              <label htmlFor="dog" className="ml-2">
                Dog
              </label>
            </div>
            <div className="flex align-items-center">
              <Checkbox
                inputId="cat"
                name="pets"
                value={formik.values.pets.cat}
                onChange={(e) => {
                  formik.setFieldValue("pets.cat", e.checked);
                }}
                checked={formik.values.pets.cat}
              />
              <label htmlFor="cat" className="ml-2">
                Cat
              </label>
            </div>
            <div className="flex align-items-center">
              <Checkbox
                inputId="other"
                name="pets"
                value={formik.values.pets.otherPets}
                onChange={(e) => {
                  formik.setFieldValue("pets.otherPets", e.checked);
                }}
                checked={formik.values.pets.otherPets}
              />
              <label htmlFor="other" className="ml-2">
                Other Pets
              </label>
            </div>
          </div>
          {getFormErrorMessage("hasPets")}
        </div>
      </div>

      <label
        htmlFor="specificNeeds"
        className="block text-900 font-medium mb-2"
      >
        Specific Needs
      </label>

      <InputTextarea
        style={{ width: "100%", height: "200px" }}
        {...props.formik.getFieldProps("specificNeeds")}
        id="specificNeeds"
        type="text"
        placeholder="Describe specific care needs that you may frequently need..."
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("specificNeeds"),
        })}
      />
      {getFormErrorMessage("specificNeeds")}

      <div className="flex flex-wrap justify-content-end gap-2 mt-4">
        <Button
          label="Next"
          className="align-content-center"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
          //   Check if householdSize is not empty, disable the next button
          disabled={!formik.values.householdSize}
        />
      </div>
    </div>
  );
};

const PreferenceStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const {
    isFormFieldInvalid,
    getFormErrorMessage,
    paymentFrequencyOptions,
    formik,
  } = props;
  const [badgeOptions, setBadgeOptions] = useState([
    "Flexible Schedule Advocate",
    "Family-Oriented Workplace",
    "Skill Development Advocate",
    "Safety First",
    "Open Communication",
  ]);
  const [filteredBadges, setFilteredBadges] = useState(null);

  const searchBadge = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredBadgeOptions;

      if (!event.query.trim().length) {
        _filteredBadgeOptions = [...badgeOptions];
      } else {
        _filteredBadgeOptions = badgeOptions.filter((badge) => {
          return badge.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredBadges(_filteredBadgeOptions);
    }, 250);
  };

  const handleSelectedFrequencyChange = (e) => {
    formik.setFieldValue("paymentFrequency", e.value);
  };

  return (
    <div>
      <label htmlFor="badges" className="block text-900 font-medium mb-2">
        Employer Badges
      </label>
      <div className="p-fluid">
        <AutoComplete
          id="badges"
          placeholder="Select badges that describe your household"
          value={formik.values.badges}
          multiple
          dropdown
          virtualScrollerOptions={{ itemSize: 38 }}
          suggestions={filteredBadges}
          completeMethod={searchBadge}
          onChange={(e) => {
            formik.setFieldValue("badges", e.value);
          }}
        />
      </div>
      {getFormErrorMessage("badges")}

      <label
        htmlFor="paymentFrequency"
        className="block text-900 font-medium mb-2"
      >
        Preferred Frequency of Pay
      </label>
      <div className="p-fluid">
        <Dropdown
          placeholder="Select Frequency of Pay"
          value={formik.values.paymentFrequency}
          id="paymentFrequency"
          // options={options.map((option) => ({
          //   label: option.name,
          //   value: option.name,
          // }))}
          options={paymentFrequencyOptions}
          onChange={handleSelectedFrequencyChange}
        />
      </div>
      {getFormErrorMessage("paymentFrequency")}

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Next"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
          //   Check if paymentFrequency is not empty, disable the next button
          disabled={!formik.values.paymentFrequency}
        />
      </div>
    </div>
  );
};

const AdditionalStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  return (
    <div>
      <label htmlFor="bio" className="block text-900 font-medium mb-2">
        Bio{" "}
      </label>
      <InputTextarea
        style={{ width: "100%", height: "200px" }}
        {...props.formik.getFieldProps("bio")}
        id="bio"
        type="text"
        placeholder="Add a bio"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("bio"),
        })}
      />
      {getFormErrorMessage("bio")}

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Confirm"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

const VerificationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const [imageSrc, setImageSrc] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);

  const handleCaptureImage = (imgFile, previewSrc) => {
    setImageSrc(previewSrc);
    setImageBlob(imgFile);
    formik.setFieldValue("profilePhoto", imgFile);
  };

  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="personalPhoto"
          className="block text-900 font-medium mb-2"
        >
          Profile Picture{" "}
        </label>
        <ProfilePictureUpload
          parentSrc={imageSrc}
          onCaptureImage={handleCaptureImage}
          formik={formik}
        />
        {getFormErrorMessage("profilePhoto")}
      </div>
      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          type="button"
          label="Confirm"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.handleSubmit();
          }}
          disabled={formik.errors.profilePhoto}
        />
      </div>
    </div>
  );
};

//
const setupSteps = [
  HouseholdInformationStep,
  PreferenceStep,
  AdditionalStep,
  VerificationStep,
];

export default setupSteps;
