import React, { useState, useRef } from "react";
import EmployerNavbar from "@/layout/EmployerNavbar";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import Link from "next/link";
import { Card } from "primereact/card";
import { Steps } from "primereact/steps";
import { useFormik } from "formik";
import jobCreateSteps from "@/layout/components/posts/edit/steps/jobCreateSteps";
import DateConverter from "@/lib/dateConverter";
import axios from "axios";

export default function EmployerPosts() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="h-screen">
      {session ? (
        <DisplayPostCreation session={session} handleSignOut={handleSignOut} />
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

const DisplayPostCreation = ({ session, handleSignOut }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const dateConverter = DateConverter();
  const { id } = router.query;
  const { edit, post } = router.query;
  let postData = {};

  // if edit mode, get the assign values to postData
  // else, set postData to null

  //NOTE; postData is in MySQL variable format
  if (edit) {
    postData = JSON.parse(post);
    postData.job_start_date = new Date(postData.job_start_date);
    postData.job_end_date = new Date(postData.job_end_date);
    postData.job_start_time = new Date(
      `1970-01-01T${postData.job_start_time}Z`
    );
    postData.job_end_time = new Date(`1970-01-01T${postData.job_end_time}Z`);
  } else {
    postData = null;
  }

  const toast = useRef(null);

  const items = [
    {
      label: "",
    },
    {
      label: "",
    },
    {
      label: "",
    },
    {
      label: "",
    },
  ];

  const onSubmit = async (values) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      console.log(values);

      // jobStartTime and jobEndTime not in mysql time format
      // No need to convert jobStartTime and jobEndTime to MySQL time format

      // Convert jobStartDate to MySQL date format
      values.jobStartDate = new Date(values.jobStartDate)
        .toISOString()
        .slice(0, 10);
      // Convert jobEndDate to MySQL date format
      values.jobEndDate = new Date(values.jobEndDate)
        .toISOString()
        .slice(0, 10);
      values.jobStartTime = new Date(values.jobStartTime)
        .toISOString()
        .slice(11, 19)
        .replace("T", " ");
      values.jobEndTime = new Date(values.jobEndTime)
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
          router.push("/app/posts");
        },
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
      // if edit mode, get the job post data from the router query
      // else, set the initial values to empty strings
      jobId: edit ? postData.job_id : "",
      serviceId: edit ? postData.service_id : "",
      jobTitle: edit ? postData.job_title : "",
      jobType: edit ? postData.job_type : "",
      jobDescription: edit ? postData.job_description : "",
      jobStartDate: edit ? postData.job_start_date : "",
      jobEndDate: edit ? postData.job_end_date : "",
      jobStartTime: edit ? postData.job_start_time : "",
      jobEndTime: edit ? postData.job_end_time : "",

      // Original code

      // serviceId: '',
      // jobTitle: '',
      // jobType: '',
      // jobDescription: '',
      // jobStartDate: '',
      // jobEndDate: '',
      // jobStartTime: '',
      // jobEndTime: '',
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
