import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Steps } from "primereact/steps";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import axios from "axios";
import { completeProfileValidate } from "@/lib/validators/validate";
import Link from "next/link";
import setupSteps from "@/layout/components/worker/complete-profile/setupSteps";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { ConfigService } from "@/layout/service/ConfigService";

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: session, loading, update } = useSession();
  const [rateRange, setRateRange] = useState([0, 100]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [certificatesOptions, setCertificatesOptions] = useState([]);

  const toast = useRef(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      bio: "",
      servicesOffered: [],
      availability: "",

      workExperience: "",
      hourlyRate: 0.0,
      skills: "",

      languages: "",
      education: "College",
      certifications: "",
    },

    validate: completeProfileValidate,
    onSubmit: onSubmit,
  });

  useEffect(() => {
    const fetchKasambahayInfoConfig = async () => {
      const response = await ConfigService.getConfig(
        "Languages",
        "kasambahay_info"
      );

      const languages = response.data.config_value.split(",");
      console.log(languages);
      setLanguagesOptions(languages);

      const response2 = await ConfigService.getConfig(
        "Certifications",
        "kasambahay_info"
      );

      const certificates = response2.data.config_value.split(",");
      setCertificatesOptions(certificates);

      const response3 = await ConfigService.getConfig(
        "Skills",
        "kasambahay_info"
      );

      const skills = response3.data.config_value.split(",");
      setSkillsOptions(skills);

      const response4 = await ConfigService.getConfig(
        "Rates",
        "kasambahay_info"
      );

      const rates = response4.data.config_value.split(",");
      const formattedRates = rates.map((rate) => parseInt(rate));
      setRateRange(formattedRates);
    };

    fetchKasambahayInfoConfig();
  }, []);

  if (!loading && !session) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      label: "Profile",
    },
    {
      label: "Experience",
    },
    {
      label: "Background",
    },
    // {
    //   label: "Verification",
    // },
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

  async function onSubmit(values) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      console.log(values);

      const response = await axios({
        method: "post",
        data: { ...values, uuid: session.user.uuid },
        withCredentials: true,
        url: `${serverUrl}/worker/complete-profile`,
      });

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

      console.log(session);
      router.push("/app/worker-dashboard?completedProfile=true");
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
                // BELOW ARE PROPS FOR THE STEP COMPONENTS FOR CONFIGURATION
                rateRange={rateRange}
                skillsOptions={skillsOptions}
                languagesOptions={languagesOptions}
                certificatesOptions={certificatesOptions}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
