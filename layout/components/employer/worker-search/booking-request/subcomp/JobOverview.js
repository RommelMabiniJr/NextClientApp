import { buildAddressString } from "@/layout/components/utils/addressUtils";
import {
  displayDatesAsRange,
  displayTimeAsRange,
} from "@/layout/components/utils/dateUtils";
import { JobsService } from "@/layout/service/JobsService";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useState } from "react";

const JobOverview = ({ session, job, onEditJobDetails }) => {
  const [serviceName, setServiceName] = useState("");
  const [address, setAddress] = useState("");
  const [livingArrangement, setLivingArrangement] = useState("");

  const fetchData = async () => {
    // console.log(session.user);
    const responseServiceName = await JobsService.getServiceNameById(
      job.serviceId
    );

    const addressFull = buildAddressString(
      session.user.street,
      session.user.barangay,
      session.user.city
    );

    setServiceName(responseServiceName);
    setAddress(addressFull);
    setLivingArrangement(job.livingArrangement);
  };

  fetchData(); // Call the async function

  return (
    <div className="flex-1 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium m-0">Job Overview</h3>
        <span
          className="hover:bg-gray-200 rounded cursor-pointer"
          onClick={() => onEditJobDetails()}
        >
          <i className="pi pi-pencil p-2.5"></i>
        </span>
      </div>
      <div className="mb-4">
        <h3 className="text-sm text-primary-400 font-medium mb-2">Title</h3>
        <p className="text-xl font-medium m-0 mb-1">{job.jobTitle}</p>
        <div className="">
          <Tag
            value={job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
            className="mr-2 text-xs"
          ></Tag>
          <Tag
            value={serviceName}
            className=" text-xs"
            severity="warning"
          ></Tag>
        </div>
      </div>
      <h3 className="text-sm text-primary-400 font-medium mb-2">Description</h3>
      <p className="text-sm font-base mb-4 text-justify">
        {job.jobDescription}
      </p>
      <div style={{ display: "grid" }} className="grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Location
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-map-marker mr-2"></span> */}
              {address}
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Arrangement
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-calendar mr-2"></span> */}
              {livingArrangement}
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "grid" }} className="grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">Dates</h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-calendar mr-2"></span> */}
              {displayDatesAsRange(job.jobStartDate, job.jobEndDate)}
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Working Hours
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-clock mr-2"></span> */}
              {displayTimeAsRange(job.jobStartTime, job.jobEndTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
