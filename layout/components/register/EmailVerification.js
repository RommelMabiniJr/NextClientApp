// EmailVerificationDialog.js
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { on } from "ws";
import { Toast } from "primereact/toast";

const EmailVerificationDialog = ({
  visible,
  onHide,
  onResend,
  onVerify,
  isResendDisabled,
  countdown,
  formik,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const toastSuccess = useRef(null);

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  // useEffect(() => {
  //   let timer;

  //   if (isResendDisabled && countdown > 0) {
  //     timer = setInterval(() => {
  //       onResend();
  //     }, 1000);
  //   } else if (countdown === 0) {
  //     // Handle countdown completion
  //   }

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [isResendDisabled, countdown, onResend]);

  return (
    <>
      <Toast ref={toastSuccess} position="top-right" />
      <Dialog header="Email Verification" visible={visible} onHide={onHide}>
        <p className="text-900 font-medium mb-2">
          Please check your email for the verification code.
        </p>
        <InputText
          {...formik.getFieldProps("verificationCode")}
          id="verificationCode"
          type="text"
          placeholder="Enter your verification code"
          className={classNames("w-full", {
            "p-invalid": isFormFieldInvalid("verificationCode"),
          })}
        />
        {getFormErrorMessage("verificationCode")}

        <div className="flex flex-wrap justify-content-between gap-2 mt-2">
          <p className="text-900 font-medium mb-2">
            Didn't receive the code?{" "}
            {isResendDisabled ? (
              <span className="text-yellow-500 font-medium">
                Resend in {countdown} seconds
              </span>
            ) : (
              <a
                href="#"
                onClick={onResend}
                className="text-blue-500 font-medium"
              >
                Resend
              </a>
            )}
          </p>
          <Button
            type="button"
            label="Verify"
            className="align-content-center"
            icon="pi pi-arrow-right"
            loading={btnLoading}
            iconPos="right"
            onClick={() => {
              formik.setTouched({
                verificationCode: true,
              });

              console.log(formik.values.verificationCode);

              if (!formik.errors.verificationCode) {
                setBtnLoading(true);
                onVerify(formik.values);
                setBtnLoading(false);
              } else {
                setBtnLoading(false);
                formik.setFieldError("verificationCode", "Invalid code");
              }
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default EmailVerificationDialog;
