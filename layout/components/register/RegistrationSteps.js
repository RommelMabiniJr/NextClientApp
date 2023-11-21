import React, { useState } from "react";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import regionVIIIJson from "../../../public/data/region-viii.json";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const PersonalInformationStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const { isFormFieldInvalid, getFormErrorMessage } = props;

  return (
    <div>
      <label htmlFor="firstName" className="block text-900 font-medium mb-2">
        First Name
      </label>
      <InputText
        {...props.formik.getFieldProps("firstName")}
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("firstName"),
        })}
      />
      {getFormErrorMessage("firstName")}

      <label htmlFor="lastName" className="block text-900 font-medium mb-2">
        Last Name
      </label>
      <InputText
        {...props.formik.getFieldProps("secondName")}
        id="lastName"
        type="text"
        placeholder="Enter your last name"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("secondName"),
        })}
      />
      {getFormErrorMessage("secondName")}

      <div className="flex flex-wrap justify-content-end gap-2 mt-4">
        <Button
          label="Next"
          className="align-content-center"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

const ContactDetailsStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const { isFormFieldInvalid, getFormErrorMessage } = props;

  return (
    <div>
      <label htmlFor="email" className="block text-900 font-medium mb-2">
        Email
      </label>
      <InputText
        {...props.formik.getFieldProps("email")}
        id="email"
        type="email"
        placeholder="Enter your email address"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("email"),
        })}
      />
      {getFormErrorMessage("email")}

      <label htmlFor="phoneNumber" className="block text-900 font-medium mb-2">
        Phone Number
      </label>
      <InputText
        {...props.formik.getFieldProps("phone")}
        id="phone"
        type="tel"
        keyfilter="int"
        placeholder="Enter your phone number"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("phone"),
        })}
      />
      {getFormErrorMessage("phone")}

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
        />
      </div>
    </div>
  );
};

const LocationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangays] = useState(null);
  const [barangayList, setBarangayList] = useState([]);
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  const cities = Object.keys(regionVIIIJson.LEYTE.municipality_list).map(
    (municipality) => ({
      label: municipality,
      value: municipality,
    })
  );

  let barangays = [];

  const handleCityChange = (event) => {
    const selectedCity = event.value;
    const barangays = regionVIIIJson.LEYTE.municipality_list[
      selectedCity
    ].barangay_list.map((barangay) => ({
      label: barangay,
      value: barangay,
    }));
    setBarangayList(barangays);
    formik.setFieldValue("city", selectedCity);
  };

  return (
    <div>
      <label htmlFor="city" className="block text-900 font-medium mb-2">
        City
      </label>
      <Dropdown
        id="city"
        options={cities}
        value={formik.values.city}
        onChange={handleCityChange}
        placeholder="Select your city"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("city"),
        })}
      />
      {getFormErrorMessage("city")}

      <label htmlFor="barangay" className="block text-900 font-medium mb-2">
        Barangay
      </label>
      <Dropdown
        id="barangay"
        value={formik.values.barangay}
        options={barangayList}
        onChange={(e) => formik.setFieldValue("barangay", e.value)}
        placeholder="Select your barangay"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("barangay"),
        })}
        multiple
      />
      {getFormErrorMessage("barangay")}

      <label htmlFor="street" className="block text-900 font-medium mb-2">
        Street
      </label>
      <InputText
        {...props.formik.getFieldProps("street")}
        id="street"
        type="text"
        placeholder="Enter your street"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("street"),
        })}
      />
      {getFormErrorMessage("street")}

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
        />
      </div>
    </div>
  );
};

const AccountSecurityStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const { isFormFieldInvalid, getFormErrorMessage } = props;
  const [isVerified, setIsVerified] = useState(false);

  const toastSuccess = useRef(null);
  // Define a function to send the reCAPTCHA token to the server for verification
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  async function verifyToken(token) {
    try {
      const response = await axios.post(`${serverUrl}/verify-recaptcha`, {
        token,
      });
      console.log(response.data.success);
      return response.data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // In your handleVerificationChange function, call the verifyToken function to send the token to the server
  const handleVerificationChange = async (token) => {
    console.log("Verification successful! Token:", token);
    const isVerified = await verifyToken(token);
    console.log("Verification status:", isVerified);

    if (isVerified) {
      setIsVerified(isVerified);
      // Show success toast and allow user to continue registration
      toastSuccess.current.show({
        severity: "success",
        summary: "Verification Successful",
        detail:
          "Thank you for proving that you are a human. Please continue with your registration process.",
        life: 3000,
      });
    } else {
      // Show error toast
      toastSuccess.current.show({
        severity: "error",
        summary: "Error",
        detail: "reCAPTCHA verification failed",
      });
    }
  };

  //// THIS IS AN OLD VERSION OF THE handleVerificationChange FUNCTION ////

  // const handleVerificationChange = (token) => {
  //   console.log("Verification successful! Token:", token);
  //   setIsVerified(true);
  //   toastSuccess.current.show({
  //     severity: 'success',
  //     summary: 'Verification Successful',
  //     detail: 'Thank you for proving that you are a human. Please continue with your registration process.',
  //     life: 3000
  //   });
  // }

  const handleVerificationError = () => {
    console.log("reCAPTCHA verification error");
    toastError.current.show({
      severity: "error",
      summary: "Error",
      detail: "reCAPTCHA verification failed",
    });
  };

  // <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={handleVerificationChange} onError={handleVerificationError} />

  return (
    <div>
      <Toast ref={toastSuccess} position="top-right" />
      <label htmlFor="password" className="block text-900 font-medium mb-2">
        Password
      </label>
      <Password
        {...props.formik.getFieldProps("password")}
        id="password"
        inputStyle={{ width: "100%" }}
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("password"),
        })}
        toggleMask
      />
      {getFormErrorMessage("password")}

      <label
        htmlFor="confirmPassword"
        className="block text-900 font-medium mb-2"
      >
        Confirm Password
      </label>
      <Password
        {...props.formik.getFieldProps("confirmPassword")}
        id="confirmPassword"
        inputStyle={{ width: "100%" }}
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("confirmPassword"),
        })}
        toggleMask
      />
      {getFormErrorMessage("confirmPassword")}

      <div className="flex align-items-center justify-content-between mb-6">
        <div className="flex align-items-center">
          <Checkbox
            id="termsAndConditions"
            onChange={(e) => setChecked(e.checked)}
            checked={checked}
            className="mr-2"
          />
          <label htmlFor="termsAndConditions">
            I agree to the <a href="/ ">terms and conditions</a>
          </label>
        </div>
      </div>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={handleVerificationChange}
        onError={handleVerificationError}
      />

      {/* CAPTCHA IMPLEMENTATION */}

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
          onClick={props.formik.handleSubmit}
        />
      </div>
    </div>
  );
};

const ConfirmationStep = ({ handleNextStep, handlePreviousStep, ...props }) => (
  <div>
    <p>Thank you for registering!</p>

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
        onClick={props.formik.handleSubmit}
      />
    </div>
  </div>
);

//
const RegistrationSteps = [
  PersonalInformationStep,
  ContactDetailsStep,
  LocationStep,
  AccountSecurityStep,
];

export default RegistrationSteps;
