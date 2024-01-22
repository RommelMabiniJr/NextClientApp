import React, { useState, useRef, useEffect } from "react";
import EmployerNavbar from "@/layout/EmployerNavbar";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Steps } from "primereact/steps";
import { useFormik } from "formik";
import jobCreateSteps from "@/layout/components/posts/edit/steps/jobCreateSteps";
import axios from "axios";
import dayjs from "dayjs";
import DateConverter from "@/lib/dateConverter";
import { ConfigService } from "@/layout/service/ConfigService";
import { postJobTitleAndDescriptionValidate } from "@/lib/validators/postValidator";
import FormatHelper from "@/lib/formatHelper";

export default function EmployerPosts() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
  };

  if (!session) {
    return (
      <div className="h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <DisplayPostCreation session={session} handleSignOut={handleSignOut} />
    </div>
  );
}

const DisplayPostCreation = ({ session, handleSignOut }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobTitleMaxLength, setJobTitleMaxLength] = useState(10);
  const [jobDescriptionMaxLength, setJobDescriptionMaxLength] = useState(10);
  const [livingArrangementOptions, setLivingArrangementOptions] = useState([]);
  const [benefitsOptions, setBenefitsOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]); // ["Daily", "Weekly", "Monthly", "Annually"
  const [salaryRange, setSalaryRange] = useState([]); // [10000, 20000]

  const router = useRouter();
  const toast = useRef(null);
  const { edit, post } = router.query;
  const formatHelper = FormatHelper();
  let postData = {};

  // if edit mode, get the assign values to postData
  // else, set postData to null

  // NOTE: postData is in MySQL variable format
  if (edit) {
    postData = JSON.parse(post);
    // console.log(postData);
    postData.job_start_date = new Date(postData.job_start_date);
    postData.job_end_date = new Date(postData.job_end_date);
    postData.job_start_time = new Date(
      `1970-01-01T${postData.job_start_time}Z`
    );
    postData.job_end_time = new Date(`1970-01-01T${postData.job_end_time}Z`);
  } else {
    postData = null;
  }

  const items = [
    {
      label: "Type of Service",
    },
    {
      label: "Job Type",
    },
    {
      label: "Schedule",
    },
    {
      label: "Offer",
    },
    {
      label: "Additional Details",
    },
  ];

  const onSubmit = async (values) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      console.log(values);

      // jobStartTime and jobEndTime not in MySQL time format
      // No need to convert jobStartTime and jobEndTime to MySQL time format

      values.jobStartTime = dayjs(values.jobStartTime)
        .toISOString()
        .slice(11, 19)
        .replace("T", " ");

      values.jobEndTime = dayjs(values.jobEndTime)
        .toISOString()
        .slice(11, 19)
        .replace("T", " ");

      const response = await axios({
        method: "put",
        data: { ...values, uuid: session.user.uuid },
        withCredentials: true,
        url: `${serverUrl}/employer/post/update`,
      });

      console.log(response.data);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Job Post Updated!",
        life: 3000,
        command: () => {
          // router.push("/app/posts");
          router.back();
        },
      });

      router.back();
      // router.push("/app/posts");
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
      // if edit mode, get the job post data from the router query
      // else, set the initial values to empty strings
      jobId: edit ? postData.job_id : "",
      serviceId: edit ? postData.service_id : "",
      jobTitle: edit ? postData.job_title : "",
      jobType: edit ? postData.job_type : "",
      livingArrangement: edit ? postData.living_arrangement : "",
      jobDescription: edit ? postData.job_description : "",
      jobStartDate: edit ? postData.job_start_date : "",
      jobEndDate: edit ? postData.job_end_date : "",
      jobStartTime: edit ? postData.job_start_time : "",
      jobEndTime: edit ? postData.job_end_time : "",
      // Offer Details
      salary: edit ? postData.salary : "",
      payFrequency: edit ? postData.pay_frequency : "",
      benefits: edit ? postData.benefits || [] : [], // makes sure that benefits will be an array
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

    const fetchBenefitsOptions = async () => {
      const CONFIG_NAME = "Benefits";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const benefits = formatHelper.stringToArray(response.data.config_value);

        setBenefitsOptions(benefits);
      }
    };

    const fetchSalaryOptions = async () => {
      const CONFIG_NAME = "Salary";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const salaryRange = formatHelper.stringToArray(
          response.data.config_value
        );
        setSalaryRange(salaryRange);
      }
    };

    const fetchFrequencyOptions = async () => {
      const CONFIG_NAME = "Frequency of Payment";
      const CONFIG_TYPE = "offer";

      const response = await ConfigService.getConfig(CONFIG_NAME, CONFIG_TYPE);

      if (response.status === 200) {
        const frequencyOptions = formatHelper.stringToArray(
          response.data.config_value
        );

        // format the frequency options to be used in the dropdown
        const formattedFrequencyOptions = frequencyOptions.map((option) => ({
          name: option,
          value: option,
        }));

        setFrequencyOptions(formattedFrequencyOptions);
      }
    };

    fetchBenefitsOptions();
    fetchSalaryOptions();
    fetchFrequencyOptions();

    fetchJobConfig();
  }, []);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepComponent = jobCreateSteps[currentStep];

  return (
    <div className="h-full">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <form>
              <div>
                <Toast ref={toast} />
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
                    // Below is used for config
                    livingArrangementOptions={livingArrangementOptions}
                    benefitsOptions={benefitsOptions}
                    frequencyOptions={frequencyOptions}
                    salaryRange={salaryRange}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
