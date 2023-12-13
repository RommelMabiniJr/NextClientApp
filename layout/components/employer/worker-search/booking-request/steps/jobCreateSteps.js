import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { InputSwitch } from "primereact/inputswitch";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { PaymentService } from "@/layout/service/PaymentService";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Image } from "primereact/image";

import Head from "next/head";
import { CascadeSelect } from "primereact/cascadeselect";
// import JobSummary from "../subcomp/JobSummary";
import dayjs from "dayjs";

const ServiceSelectStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const services = [
    {
      id: 1,
      name: "Child Care",
      description:
        "Providing safe and nurturing care for children in their homes, including activities and educational support.",
      icon: "child.png",
    },
    {
      id: 2,
      name: "Elder Care",
      description:
        "Assisting elderly individuals with daily living activities, such as grooming, medication management, and companionship.",
      icon: "grandfather.png",
    },
    {
      id: 3,
      name: "Pet Care",
      description:
        "Caring for pets in their homes, including feeding, walking, and administering medications.",
      icon: "pawprint.png",
    },
    {
      id: 4,
      name: "House Services",
      description:
        "Performing various household tasks, such as cleaning, laundry, and organization, to help clients maintain a comfortable living space.",
      icon: "bucket.png",
    },
  ];

  const handleCardClick = (service) => {
    formik.setFieldValue("serviceId", service.id);
    handleNextStep();
  };

  const serviceCards = services.map((service) => (
    <div className="col-12 md:col-6 lg:col-3" key={service.name}>
      <Button
        className={`h-full bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700 ${
          formik.values.serviceId === service.id
            ? "bg-primary-600 hover:bg-primary-400 border-primary-700"
            : ""
        }`}
        onClick={(e) => handleCardClick(service)}
      >
        <Card className="h-full service-card">
          <div className="flex justify-center">
            <Image
              src={`/layout/${service.icon}`}
              alt={service.name}
              width="80"
            />
          </div>

          <h5 className="service-name">{service.name}</h5>
          <p>{service.description}</p>
        </Card>
      </Button>
    </div>
  ));

  return (
    <div>
      <h1 className="text-center">What care service do you need?</h1>
      <div className="grid p-justify-center">{serviceCards}</div>
      <div className="flex flex-wrap justify-content-end gap-2 mt-4">
        <Button
          label="Continue"
          // show only if there is a selected service
          className={`${!formik.values.serviceId ? "hidden" : ""}`}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

const JobTypeStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  const jobTypes = [
    {
      name: "Full Time",
      value: "full-time",
      code: "FT",
      description: "A job with consistent work for 40+ hours per week.",
      icon: "pi-clock",
    },
    {
      name: "Part Time",
      value: "part-time",
      code: "PT",
      description: "A job with flexible hours for less than 40 hours per week.",
      icon: "pi-clock",
    },
    {
      name: "Temporary",
      value: "temporary",
      code: "OT",
      description: "Short-term work available on demand.",
      icon: "pi-clock",
    },
  ];

  const handleCardClick = (job) => {
    formik.setFieldValue("jobType", job.value);
    handleNextStep();
  };

  const jobCards = jobTypes.map((job) => (
    <div className="col-12 md:col-6 lg:col-4" key={job.name}>
      <Button
        className={`h-full bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700 ${
          formik.values.jobType === job.value
            ? "bg-primary-600 hover:bg-primary-400 border-primary-700"
            : ""
        }`}
        onClick={() => handleCardClick(job)}
      >
        <Card className="h-full job-card">
          <i className={`text-xl pi ${job.icon} job-icon`}></i>
          <h5 className="job-name">{job.name}</h5>
          <p>{job.description}</p>
        </Card>
      </Button>
    </div>
  ));

  return (
    <div>
      <h1 className="text-center">What job type do you need?</h1>
      <div className="grid p-justify-center">{jobCards}</div>
      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Continue"
          className={`${!formik.values.jobType ? "hidden" : ""}`}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

const JobDatesStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const {
    currenStep,
    isFormFieldInvalid,
    getFormErrorMessage,
    livingArrangementOptions,
    formik,
  } = props;
  const [selectedArrangement, setSelectedArrangement] = useState(null);
  const livingArrangementNew = [
    "Live-in with own quarters",
    "Live-in with shared quarters",
    "Live-in with separate entrance",
    "Live-out with own transportation",
    "Live-out with stipend",
  ];

  const handleLivingArrangementChange = (e) => {
    formik.setFieldValue("livingArrangement", e.value);
    setSelectedArrangement(e.value);
  };

  const dateTemplate = (date) => {
    // Create a dayjs date using the provided properties
    const thisDate = new Date(date.year, date.month, date.day);
    const dayjsDate = dayjs(thisDate);

    // Get the current date
    const today = dayjs();

    // Check if the date is before today
    if (dayjsDate.isBefore(today, "day")) {
      date.selectable = false;

      return (
        <span style={{ textDecoration: "line-through", color: "gray" }}>
          {date.day}
        </span>
      );
    } else {
      date.selectable = true;

      return date.day;
    }
  };

  return (
    <div>
      <div className="">
        <h2 className="text-center mb-4">What dates do you need Care?</h2>
        <div className="formgrid grid gap-2 w-full mx-auto">
          <div className="col-12 grid gap-3 md:gap-0">
            <div className="col-12 md:col-6 flex flex-column">
              <label htmlFor="jobStartTime" className="block font-medium">
                Working Hours
              </label>
              <div className="flex">
                <div>
                  <Calendar
                    {...formik.getFieldProps("jobStartTime")}
                    id="jobStartTime"
                    timeOnly
                    hourFormat="12"
                    className={classNames("w-full", {
                      "p-invalid": isFormFieldInvalid("jobStartTime"),
                    })}
                  />
                  {getFormErrorMessage("jobStartTime")}
                </div>
                {/* Make a dash horizontally */}
                <div className="font-medium text-gray-700 text-2xl flex items-center justify-center mx-2 mb-4">
                  -
                </div>
                <div>
                  <Calendar
                    {...formik.getFieldProps("jobEndTime")}
                    id="jobEndTime"
                    timeOnly
                    hourFormat="12"
                    className={classNames("w-full", {
                      "p-invalid": isFormFieldInvalid("jobEndTime"),
                    })}
                  />
                  {getFormErrorMessage("jobEndTime")}
                </div>
              </div>
            </div>
            <div className="col-12 md:col-6 flex flex-column">
              <label htmlFor="jobEndTime" className="font-medium">
                Living Arrangements
              </label>
              <Dropdown
                id="livingArrangement"
                options={livingArrangementOptions}
                value={formik.values.livingArrangement}
                onChange={handleLivingArrangementChange}
                placeholder="Select an Arrangement"
                className={classNames("w-full", {
                  "p-invalid": isFormFieldInvalid("livingArrangement"),
                })}
              />
              {getFormErrorMessage("livingArrangement")}
            </div>
          </div>
          <div className="col-12 flex flex-column ">
            <label htmlFor="jobStartDate" className="block font-medium">
              Job Starting Date
            </label>
            <Calendar
              value={formik.values.jobStartDate}
              onChange={(e) => {
                formik.setFieldValue("jobStartDate", e.value);
              }}
              id="jobStartDate"
              dateTemplate={dateTemplate}
              showIcon
              dateFormat="DD, MM dd, yy"
              className={classNames("w-full", {
                "p-invalid": isFormFieldInvalid("jobStartDate"),
              })}
            />
            {getFormErrorMessage("jobStartDate")}
          </div>
          <div className="col-12 flex flex-column ">
            <label htmlFor="jobEndDate" className="block font-medium">
              Job Ending Date
            </label>
            <Calendar
              value={formik.values.jobEndDate}
              onChange={(e) => {
                formik.setFieldValue("jobEndDate", e.value);
              }}
              id="jobEndDate"
              dateTemplate={dateTemplate}
              showIcon
              dateFormat="DD, MM dd, yy"
              className={classNames("w-full", {
                "p-invalid": isFormFieldInvalid("jobEndDate"),
              })}
            />
            {getFormErrorMessage("jobEndDate")}
          </div>
        </div>
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
          label="Continue"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              jobStartDate: true,
              jobEndDate: true,
              jobStartTime: true,
              jobEndTime: true,
              livingArrangement: true,
            });

            if (
              !formik.errors.jobStartDate &&
              !formik.errors.jobEndDate &&
              !formik.errors.jobStartTime &&
              !formik.errors.jobEndTime &&
              !formik.errors.livingArrangement
            ) {
              handleNextStep();
            }
          }}
        />
      </div>
    </div>
  );
};

const JobLocationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  return (
    <div className="card p-fluid grid">
      <div className="col-5">
        <h5>Vertical</h5>
        <div className="field">
          <label htmlFor="email1">Rate per Hour</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="">₱</i>
            </span>
            <InputNumber
              value={formik.values.payRate}
              onValueChange={formik.handleChange}
              min={0}
              max={100}
              minFractionDigits={2}
              maxFractionDigits={5}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="age1">Payment Method</label>
          <InputText id="age1" type="text" />
        </div>
      </div>
      <Divider className="col-1" layout="vertical"></Divider>
      <div className="col-5">
        <h5>Vertical</h5>
        <div className="field">
          <label htmlFor="email1">City/Municipality</label>
          <InputText id="email1" type="text" />
        </div>
        <div className="field">
          <label htmlFor="age1">Barangay</label>
          <InputText id="age1" type="text" />
        </div>
        <div className="field">
          <label htmlFor="name1">Street</label>
          <InputText id="name1" type="text" />
        </div>
      </div>
    </div>
  );
};

const JobDescriptionStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const { currentStep, isFormFieldInvalid, getFormErrorMessage, formik } =
    props;

  return (
    <div>
      {/* <div className="card">
        <JobSummary formik={formik} currentStep={currentStep} />
      </div> */}
      <div className="">
        <h2 className="text-center mb-4">Describe the Job</h2>
        <div className="flex flex-col gap-2">
          <span className="p-float-label">
            <InputText
              // these property handles both the value and onChange
              {...formik.getFieldProps("jobTitle")}
              type="text"
              id="jobTitle"
              className={classNames("text-lg font-medium w-full", {
                "p-invalid": isFormFieldInvalid("jobTitle"),
              })}
            />
            <label htmlFor="jobTitle">Job Title</label>
          </span>
          {getFormErrorMessage("jobTitle")}
          <span className="p-float-label mt-4">
            <InputTextarea
              {...formik.getFieldProps("jobDescription")}
              style={{ width: "100%", height: "200px" }}
              id="jobDescription"
              className={classNames("w-full", {
                "p-invalid": isFormFieldInvalid("jobDescription"),
              })}
            />
            <label htmlFor="jobDescription">Job Description</label>
          </span>
          {getFormErrorMessage("jobDescription")}
        </div>
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
          label="Post The Job"
          className=""
          icon="pi pi-check"
          iconPos="right"
          onClick={() => {
            formik.setTouched({
              jobTitle: true,
              jobDescription: true,
            });

            if (!formik.errors.jobTitle && !formik.errors.jobDescription) {
              formik.handleSubmit();
            }
          }}
        />
      </div>
    </div>
  );
};

//
const jobCreateSteps = [
  ServiceSelectStep,
  JobTypeStep,
  JobDatesStep,
  JobDescriptionStep,
];

export default jobCreateSteps;
