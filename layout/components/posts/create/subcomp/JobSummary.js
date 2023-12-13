import axios from "axios";
import { JobsService } from "@/layout/service/JobsService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button } from "primereact/button";

const JobSummary = ({ formik, currentStep }) => {
  const [service, setService] = useState([]);
  const {
    jobTitle,
    jobType,
    livingArrangement,
    jobDescription,
    jobStartDate,
    jobEndDate,
    jobStartTime,
    jobEndTime,
  } = formik.values;

  useEffect(() => {
    if (formik.values.serviceId === "") {
      return;
    }

    // Get service name by id
    const getServiceName = async () => {
      const service_name = await JobsService.getServiceNameById(
        formik.values.serviceId
      );

      setService(service_name);
    };
    getServiceName();
  }, [formik.values.serviceId]);

  //   display summary of job post from formik
  // don't use input fields, just display the data
  return (
    <>
      <div>
        <h5>Job Summary</h5>
        <div className="p-grid p-fluid divide-y">
          <div className="flex items-center gap-3 my-2">
            {service && (
              <div className="p-col-6 p-md-6">
                <div className="p-field">
                  <span className="font-medium">{service}</span>
                </div>
              </div>
            )}
            {/* Divider vertical */}
            <div className="flex flex-col justify-center">
              <div className="border-r-2 border-gray-300 h-5"></div>
            </div>
            {jobType && (
              <div className="p-col-6 p-md-6">
                <div className="p-field">
                  <span className="font-medium">
                    {jobType &&
                      jobType.charAt(0).toUpperCase() + jobType.slice(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Change Button */}
            <div className="flex flex-col justify-center">
              <Button
                type="button"
                // switch icon
                // icon="pi pi-arrow-right-arrow-left"
                label="CHANGE"
                text
                size="small"
                // severity="secondary"
              />
            </div>
          </div>
          {/* Display only when current step is in 3 */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center my-2">
                {jobStartDate && (
                  <div className="p-col-6 p-md-6">
                    <div className="p-field">
                      <p className="font-medium">
                        <span className="font-medium">From </span>
                        {dayjs(jobStartDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                )}
                {jobEndDate && (
                  <div className="p-col-6 p-md-6">
                    <div className="p-field">
                      <p className="font-medium">
                        <span className="font-medium mx-1">to</span>
                        {dayjs(jobEndDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center my-2">
                {jobStartTime && (
                  <div className="p-col-6 p-md-6">
                    <div className="p-field">
                      <p className="font-medium">
                        {dayjs(jobStartTime).format("h:mm A")}
                        <span className="font-medium mx-2">-</span>
                      </p>
                    </div>
                  </div>
                )}
                {jobEndTime && (
                  <div className="p-col-6 p-md-6">
                    <div className="p-field">
                      <p className="font-medium">
                        {dayjs(jobEndTime).format("h:mm A")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {livingArrangement && (
                  <div className="p-col-6 p-md-6">
                    <div className="p-field">
                      <p className="font-medium">{livingArrangement.optName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobSummary;
