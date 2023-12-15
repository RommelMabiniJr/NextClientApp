import React, { useEffect, useState } from "react";
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
import { Dialog } from "primereact/dialog";
import EmailVerificationDialog from "./EmailVerification";
import { OTPService } from "@/layout/service/OTPService";
import { useFormik } from "formik";

const PersonalInformationStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  // initialize focus on first input field
  const firstNameInput = useRef(null);

  // focus on first input field on initial render
  useEffect(() => {
    firstNameInput.current.focus();
  }, []);

  return (
    <div>
      <label htmlFor="firstName" className="block text-900 font-medium mb-2">
        First Name
      </label>
      <InputText
        {...formik.getFieldProps("firstName")}
        ref={firstNameInput}
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
        {...formik.getFieldProps("secondName")}
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
          type="button"
          label="Next"
          className="align-content-center"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              firstName: true,
              secondName: true,
            });

            if (!formik.errors.firstName && !formik.errors.secondName) {
              handleNextStep();
            }
          }}
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
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const [isVerified, setIsVerified] = useState(
    props.formik.values.isEmailVerified
  );
  const [verifyDialogVisible, setVerifyDialogVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [verifyBtnLoading, setVerifyBtnLoading] = useState(false);
  const toastSuccess = useRef(null);

  const handleGetOTP = async () => {
    setVerifyBtnLoading(true);
    const response = await OTPService.sendOTP(formik.values.email);
    console.log(response.data);
    if (response.status === 200) {
      setVerificationCode(response.data.otp);
      setVerifyDialogVisible(true);
      setVerifyBtnLoading(false);
    } else {
      setVerifyBtnLoading(false);
      toastSuccess.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "An error occurred while sending the verification code. Please try again.",
      });
    }
  };

  const onSubmit = async (values) => {
    console.log(values.verificationCode, verificationCode);
    if (values.verificationCode == verificationCode) {
      // add 1 second delay before toast
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerified(true);
      setVerifyDialogVisible(false);
      formik.setFieldValue("isEmailVerified", true);
      toastSuccess.current.show({
        severity: "success",
        summary: "Verification Successful",
        detail: "Thank you for proving that you are a human.",
        life: 3000,
      });
    } else {
      // add 1 second delay before toast
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toastSuccess.current.show({
        severity: "error",
        summary: "Verification Failed",
        detail: "Wrong verification code.",
      });
    }
  };

  const verificationFormik = useFormik({
    initialValues: {
      verificationCode: "",
    },

    validate: (errors) => {
      let validationErrors = {};

      if (!errors.verificationCode) {
        validationErrors.verificationCode = "Required";
      } else if (errors.verificationCode.length < 6) {
        validationErrors.verificationCode =
          "Verification code must be 6 digits";
      }

      return validationErrors;
    },

    onSubmit,
  });

  const handleResendOTP = async () => {
    await handleGetOTP();
    setResendDisabled(true);
    setCountdown(120);
  };

  useEffect(() => {
    let timer;

    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [resendDisabled, countdown]);

  return (
    <div>
      <Toast ref={toastSuccess} position="top-right" />
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

      <label htmlFor="email" className="block text-900 font-medium mb-2">
        Email
      </label>
      <div className="flex gap-2 justify-between items-start">
        <div className="h-full flex-1 my-auto">
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
        </div>
        <EmailVerificationDialog
          visible={verifyDialogVisible}
          verificationCode={verificationCode}
          onHide={() => setVerifyDialogVisible(false)}
          onResend={handleResendOTP}
          onVerify={onSubmit}
          isResendDisabled={resendDisabled}
          countdown={countdown}
          formik={verificationFormik}
        />
        <Button
          type="button"
          label={isVerified ? "Verified" : "Verify"}
          disabled={isVerified}
          className=""
          size="small"
          severity={isVerified ? "success" : "secondary"}
          loading={verifyBtnLoading}
          pt={{
            root: {
              className: "h-3rem",
            },
          }}
          onClick={() => {
            formik.setTouched({
              email: true,
            });

            // make sure is valid and not empty
            if (formik.values.email) {
              handleGetOTP();
            }
          }}
        />
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
          label="Next"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              email: true,
              phone: true,
            });

            if (!formik.errors.email && !formik.errors.phone) {
              handleNextStep();
            }
          }}
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
        Street (Optional)
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
          type="button"
          label="Next"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              city: true,
              barangay: true,
            });

            if (!formik.errors.city && !formik.errors.barangay) {
              handleNextStep();
            }
          }}
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
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
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

      <div className="flex align-items-center justify-content-between mb-4">
        <div className="flex align-items-center">
          <Checkbox
            id="termsAndConditions"
            onChange={(e) => setChecked(e.checked)}
            checked={checked}
            className="mr-2"
          />
          <label htmlFor="termsAndConditions">
            I agree to the <a href="#">terms and conditions</a>
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
          type="button"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              password: true,
              confirmPassword: true,
              user_type: true,
            });

            if (
              !formik.errors.password &&
              !formik.errors.confirmPassword &&
              !formik.errors.user_type &&
              isVerified
            ) {
              handleNextStep();
            }
          }}
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
