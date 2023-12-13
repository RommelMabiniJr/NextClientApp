import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Steps } from "primereact/steps";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import axios from "axios";
import { completeProfileValidate } from "@/lib/validators/validate";
import Link from "next/link";
import setupSteps from "@/layout/components/employer/complete-profile/setupSteps";
import { useSession, getSession } from "next-auth/react";
import { useRef } from "react";
import { ConfigService } from "@/layout/service/ConfigService";

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentFrequencyOptions, setPaymentFrequencyOptions] = useState([]);
  const { data: session, loading, update } = useSession();
  const toast = useRef(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      householdSize: "",
      pets: {
        dog: false,
        cat: false,
        otherPets: false,
      },
      specificNeeds: "",
      paymentMethods: [],
      paymentFrequency: "",
      bio: "",
    },

    validate: completeProfileValidate,
    onSubmit,
  });

  useEffect(() => {
    const fetchEmployerConfig = async () => {
      const response = await ConfigService.getConfig(
        "Frequency of Payment",
        "employer_info"
      );

      if (response.status === 200) {
        const paymentFrequency = response.data.config_value;
        const formattedPaymentFrequency = paymentFrequency.split(",");
        setPaymentFrequencyOptions(formattedPaymentFrequency);
      }
    };

    fetchEmployerConfig();
  }, []);

  if (!session && !loading) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      label: "Household",
    },
    {
      label: "Payment",
    },
    {
      // Will be used to ask to create bio
      label: "Additional",
    },
    {
      label: "Verification",
    },
  ];

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  // this is a handler function for updating the session user object
  const handleUpdate = async (data) => {
    await update(data, true);
  };

  async function onSubmit(values) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    try {
      const response = await axios({
        method: "post",
        data: { ...values, uuid: session.user.uuid },
        withCredentials: true,
        url: `${serverUrl}/employer/complete-profile`,
      });

      console.log(response.data);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Profile created Succesfully",
        life: 3000,
      });

      // Make session user object reflect changes from the database (i.e. completedProfile: true)
      console.log({
        ...session,
        user: {
          ...session.user,
          completedProfile: "true",
        },
      });
      await update({
        ...session,
        user: {
          ...session.user,
          completedProfile: "true",
        },
      });

      // Access the updated session data
      // const updatedSession = await getSession();

      console.log(session);
      router.push("/app/employer-dashboard?completedProfile=true");
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);

    console.log(formik.values);
    console.log(
      !formik.values.paymentMethods,
      formik.values.paymentFrequency.length
    );
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepComponent = setupSteps[currentStep];

  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <Link href="/">
            <img
              src="/layout/logo.png"
              alt="hyper"
              height={150}
              width={150}
              className="mb-3 mx-auto"
            />
          </Link>
          <div className="text-900 text-3xl font-medium mb-3">
            Complete your Profile
          </div>
          <span className="text-600 font-medium line-height-3">
            Finish Setting Up Your Account
          </span>
        </div>

        <form>
          <div>
            <Steps
              className="mx-auto w-10"
              model={items}
              aria-expanded="true"
              activeIndex={currentStep}
            />
            <Divider className="mx-auto w-10 mb-5" />

            <div className="mx-auto w-10">
              <Toast ref={toast} />
              <StepComponent
                isFormFieldInvalid={isFormFieldInvalid}
                getFormErrorMessage={getFormErrorMessage}
                formik={formik}
                onSubmit={onSubmit}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                // BELOW IS USED FOR CONFIGURATION
                paymentFrequencyOptions={paymentFrequencyOptions}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
