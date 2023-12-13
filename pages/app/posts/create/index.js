import React, { useState, useRef, useEffect } from "react";
import EmployerNavbar from "@/layout/EmployerNavbar";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Steps } from "primereact/steps";
import { useFormik } from "formik";
import jobCreateSteps from "@/layout/components/posts/create/steps/jobCreateSteps";
import axios from "axios";
import dayjs from "dayjs";
import { postJobTitleAndDescriptionValidate } from "@/lib/validators/postValidator";
import { ConfigService } from "@/layout/service/ConfigService";

export default function CreateJobPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [jobTitleMaxLength, setJobTitleMaxLength] = useState(10);
  const [jobDescriptionMaxLength, setJobDescriptionMaxLength] = useState(10);
  const [livingArrangementOptions, setLivingArrangementOptions] = useState([]);
  const items = [
    {
      label: "Type of Service",
    },
    {
      label: "Job Type",
    },
    {
      label: "Job Schedule",
    },
    {
      label: "Additional Details",
    },
  ];

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    const fetchJobConfig = async () => {
      const titleResponse = await ConfigService.getConfig(
        "Job Title",
        "job_posting"
      );

      if (titleResponse.status === 200) {
        setJobTitleMaxLength(titleResponse.data.config_value);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }

      const descriptionResponse = await ConfigService.getConfig(
        "Job Description",
        "job_posting"
      );

      if (descriptionResponse.status === 200) {
        setJobDescriptionMaxLength(descriptionResponse.data.config_value);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }

      const livingArrangementResponse = await ConfigService.getConfig(
        "Living Arrangement",
        "job_posting"
      );

      if (livingArrangementResponse.status === 200) {
        setLivingArrangementOptions(
          livingArrangementResponse.data.config_value.split(",")
        );
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          life: 3000,
        });
      }
    };

    fetchJobConfig();
  }, []);

  const onSubmit = async (values) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      // Convert date and time to MySQL format
      values.jobStartDate = dayjs(values.jobStartDate).format("YYYY-MM-DD");
      values.jobEndDate = dayjs(values.jobEndDate).format("YYYY-MM-DD");
      values.jobStartTime = dayjs(values.jobStartTime).format("HH:mm:ss");
      values.jobEndTime = dayjs(values.jobEndTime).format("HH:mm:ss");

      const response = await axios({
        method: "post",
        data: { ...values, uuid: session.user.uuid },
        withCredentials: true,
        url: `${serverUrl}/employer/post/create`,
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Job Post Created!",
        life: 3000,
      });

      router.push("/app/posts");
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      serviceId: "",
      jobTitle: "",
      jobType: "",
      livingArrangement: "",
      jobDescription: "",
      jobStartDate: "",
      jobEndDate: "",
      jobStartTime: "",
      jobEndTime: "",
    },
    validate: (values) => {
      return postJobTitleAndDescriptionValidate(
        values,
        jobTitleMaxLength,
        jobDescriptionMaxLength
      );
    },
    onSubmit: onSubmit,
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

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepComponent = jobCreateSteps[currentStep];

  if (!session) {
    return <div>loading...</div>;
  }

  return (
    <div className="h-full">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div
        className="grid"
        // onClick={() => {
        //   formik.errors
        // }}
      >
        <div className="col-12">
          <div className="card w-10 lg:w-9 mx-auto">
            <form>
              <div>
                <Toast ref={toast} />
                <Steps
                  className="mx-auto w-10"
                  model={items}
                  aria-expanded="true"
                  activeIndex={currentStep}
                  pt={{
                    label: {
                      className: "hidden md:block",
                    },

                    step: {
                      className: "mb-4 md:mb-0",
                    },
                  }}
                />
                <Divider className="mx-auto w-10 mb-5" />
                {/* Display summary */}

                <div className="mx-auto w-10">
                  <Toast ref={toast} />
                  <StepComponent
                    isFormFieldInvalid={isFormFieldInvalid}
                    getFormErrorMessage={getFormErrorMessage}
                    currentStep={currentStep}
                    formik={formik}
                    onSubmit={onSubmit}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    // Below is used for config
                    livingArrangementOptions={livingArrangementOptions}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
