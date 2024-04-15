import Navbar from "../../layout/components/Navbar";
import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import axios from "axios";
import RegistrationSteps from "../../layout/components/register/RegistrationSteps";
import { registerValidate } from "@/lib/validators/validate";
import Link from "next/link";
import { useSession } from "next-auth/react";

const RegistrationPage = () => {
  const { status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);

  // initialize user type to based on url params for example
  // http://localhost:3000/register?userType=household

  const router = useRouter();
  const toast = useRef(null);

  const items = [
    {
      label: "Personal",
    },
    {
      label: "Contact",
    },
    {
      label: "Location",
    },
    {
      label: "Security",
    },
  ];

  const options = [
    { label: "Worker", value: "domestic worker" },
    { label: "Employer", value: "household employer" },
  ];

  useEffect(() => {
    // Get the user type from the URL query parameters
    const userTypeParam = new URLSearchParams(window.location.search).get(
      "userType"
    );

    // Set the user type in formik values if it's a valid option
    if (
      userTypeParam &&
      options.some((option) => option.value === userTypeParam)
    ) {
      formik.setFieldValue("user_type", userTypeParam);
    }
  }, []); // Run this effect only once when the component mounts

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      email: "",
      isEmailVerified: false, // Will only be used for validation
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
      barangay: "",
      street: "",
      user_type: "",
    },
    validate: registerValidate,
    onSubmit,
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  async function onSubmit(values) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    try {
      const response = await axios.post(`${serverUrl}/register`, values, {
        withCredentials: true,
      });
      console.log(response);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User registered successfully!",
        });

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while registering user. Please try again.",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while registering user. Please try again.",
      });
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepComponent = RegistrationSteps[currentStep];

  if (status === "authenticated") {
    router.push("/app/user-router");
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Display Gradient */}
      <div
        className="bg-fixed relative bg-cover flex-1 flex items-center justify-center "
        style={{ backgroundImage: "url('/layout/hero-1.png')" }}
      >
        <div className="absolute h-full w-full bg-gradient-to-r from-pink-500 to-blue-500 opacity-50"></div>
        <div className="text-center mb-5 flex-1 py-4 z-1">
          <div className="">
            <Link href="/">
              <img
                src="/layout/logo.png"
                alt="hyper"
                height={200}
                width={200}
                className="mb-3 mx-auto"
              />
            </Link>
          </div>
          <div className="text-200 text-5xl font-semibold">
            Join KasambahayKo
          </div>
          <span className="text-200 font-normal line-height-3">
            Already have an account?
          </span>
          <Link
            href="/auth/login"
            className="font-medium no-underline hover:underline ml-2 text-blue-100 cursor-pointer"
          >
            Sign In
          </Link>
          <div className="mt-4">
            <SelectButton
              value={formik.values.user_type}
              name="user_type"
              id="userType"
              options={options}
              onChange={(e) => {
                formik.setFieldValue("user_type", e.value);
              }}
              className={classNames(
                "user-type-select m-auto w-9 flex justify-content-center",
                { "p-invalid": isFormFieldInvalid("user_type") }
              )}
              pt={{
                button: "bg-transparent",
              }}
            />
            <div className="w-8 mx-auto">
              {getFormErrorMessage("user_type")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex align-items-center justify-content-end flex-1">
        <Toast ref={toast} />
        <div className="surface-card p-4 shadow-2 border-round h-screen w-full flex align-items-center">
          <form className="flex-1">
            <div>
              <Steps
                className="mx-auto mt-4 w-10"
                model={items}
                aria-expanded="true"
                activeIndex={currentStep}
              />
              <Divider className="mx-auto w-10 mb-5" />

              <div className="mx-auto w-10">
                <StepComponent
                  isFormFieldInvalid={isFormFieldInvalid}
                  getFormErrorMessage={getFormErrorMessage}
                  formik={formik}
                  onSubmit={onSubmit}
                  handleNextStep={handleNextStep}
                  handlePreviousStep={handlePreviousStep}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
