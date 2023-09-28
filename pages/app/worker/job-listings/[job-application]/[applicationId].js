import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WorkerNavbar from "@/layout/WorkerNavbar";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { useRouter } from "next/router";
import { LocationService } from "@/layout/service/LocationService";
import DateConverter from "@/lib/dateConverter";
import axios from "axios";

const JobApplicationView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const PROVINCE = "LEYTE";
  const { applicationId, elementId, tabIndex } = router.query;
  const [applicationDetails, setApplicationDetails] = useState(null);
  const dateConverter = DateConverter();
  const defaultAvatar = "/layout/profile-default.png";

  // DUMMY DATA
  const job = {
    job_title: "We are looking for a nanny for our 2 children in Abuyog.",
    job_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget aliquam ultrices, nunc nunc aliquet nunc, eget aliquam",
    job_posting_date: "2021-10-15T10:30:00.000Z",
    job_start_date: "2021-10-15T10:30:00.000Z",
    job_end_date: "2024-03-25T10:30:00.000Z",
    job_start_time: "2021-10-15T10:30:00.000Z",
    job_end_time: "2021-10-15T10:30:00.000Z",
    working_hours: "8:00 AM - 5:00 PM",
    job_type: "Full-time",
    first_name: "Jessica",
    city_municipality: "Abuyog",
    distance: 3.5,
    pay_rate: 16.5,
    // compensation: "₱ 10,000.00",
    application_date: "2021-10-15T10:30:00.000Z",
    application_status: "Pending",
    services: [
      {
        service_id: 1,
        service_name: "Child Care",
      },
    ],
  };

  useEffect(() => {
    // Check if the application ID is valid
    if (applicationId) {
      // Fetch the application details
      const fetchApplicationDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/worker/application/${applicationId}`
          );

          console.log(response.data);
          if (response.data) {
            // Set the application details
            setApplicationDetails(response.data);
          }
        } catch (error) {
          console.error("Error fetching application details: ", error);
        }
      };

      fetchApplicationDetails();
    }
  }, [applicationId]);

  useEffect(() => {
    // TODO: retrieve the worker's location from the session ...
  }, [session]);

  // Function to handle navigation back to the job listing
  const handleBack = () => {
    console.log(router.query);
    const query = {
      elementId: elementId, // Replace with the actual scroll position
      tabIndex: tabIndex, // Replace with the actual selected tab index
    };

    // Navigate back to page1 with URL parameters
    router.push({
      pathname: "/app/worker/job-listings",
      query,
    });
  };

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    let statusStyle = {}; // Define an empty style object

    // Define styles based on the status
    if (item.current) {
      statusStyle = {
        fontWeight: "bold", // Make it bold
        color: "#4CAF50", // Make it green
      };
    } else {
      // For other statuses
      statusStyle = {
        color: "#9E9E9E", // Make it grey
      };
    }

    return (
      <div className="p-grid">
        <div className="p-col-12" style={statusStyle}>
          {item.status}
        </div>
      </div>
    );
  };

  // Sample timeline data (replace with your actual data)
  // bottom to top
  const timelineData = [
    {
      status: "Application Completed",
      date: "16/11/2020 08:00",
      // green icon
      color: "#4CAF50",
      // pending
      icon: "pi pi-check",
      current: true,
    },
    {
      status: "Job Offer",
      date: "16/11/2020 08:00",
      // grey icon
      color: "#9E9E9E",
      // pending
      icon: "pi pi-circle-fill",
    },
    {
      status: "Qualification Outcome",
      date: "16/10/2020 10:00",
      // grey icon
      color: "#9E9E9E",
      // pending
      icon: "pi pi-circle-fill",
    },
    {
      status: "Qualifying Process",
      date: "16/10/2020 10:00",
      // grey icon
      color: "#9E9E9E",
      // pending
      icon: "pi pi-circle-fill",
    },

    {
      status: "Application Under Review",
      date: "15/10/2020 14:00",
      //make this grey
      color: "#9E9E9E",
      // loading icon
      icon: "pi pi-spin pi-circle-fill",
    },
    {
      status: "Application Submitted",
      date: "15/10/2020 10:30",
      //make this grey
      color: "#9E9E9E",
      icon: "pi pi-circle-fill",
    },
  ];

  return (
    // render only when application details are fetched
    applicationDetails && (
      <div>
        <WorkerNavbar session={session} />
        <div className="grid justify-center">
          <span className="col-12 flex flex align-items-center mt-4">
            <Button
              label="Back to Job Listings"
              icon="pi pi-chevron-left"
              onClick={handleBack}
              className="p-button-secondary p-button"
              link
            />
            <h3 className="inline m-0 ml-8">Viewing Job Application</h3>
          </span>
          <div className="grid col-12 md-8">
            <div className="col-7 bg-white p-4 m-4 ml-6 flex flex-column justify-content-between">
              <div className="content">
                <div className="flex">
                  <div className="mr-4">
                    <Avatar
                      image={
                        applicationDetails.post.profile_url || defaultAvatar
                      }
                      alt="profile"
                      shape="circle"
                      className="h-5rem w-5rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
                    />
                  </div>
                  <div className="">
                    <h5>{applicationDetails.post.job_title}</h5>
                    {/* <p>Application Status: {applicationDetails.application_status}</p> */}
                    <div className="grid w-full">
                      <div className="col flex flex-wrap py-1">
                        <span className="text-600 font-medium">
                          Service Type:{" "}
                        </span>
                        <Tag
                          icon="pi pi-tag"
                          className="ml-2"
                          value={
                            applicationDetails.post.services[0].service_name
                          }
                        />
                      </div>
                      <div className="col flex flex-wrap py-1">
                        <span className="text-600 font-medium ">
                          Arrangement:{" "}
                        </span>
                        <Tag
                          className="ml-2"
                          icon="pi pi-clock"
                          value={applicationDetails.post.job_type}
                        />
                      </div>
                      <div className="grid w-full">
                        <div className="col mr-4 pl-3 pt-3">
                          <span className="text-600 font-medium mr-1">
                            Job Dates:{" "}
                          </span>
                          <div className="text-700 font-medium">
                            {dateConverter.toNumbers(
                              applicationDetails.post.job_start_date
                            )}{" "}
                            -{" "}
                            {dateConverter.toNumbers(
                              applicationDetails.post.job_end_date
                            )}
                          </div>
                        </div>
                        <div className="col mr-4 pl-3 pt-3">
                          <span className="text-600 font-medium mr-1">
                            Working Hours:{" "}
                          </span>
                          <div className="text-700 font-medium">
                            {applicationDetails.working_hours ||
                              "8:00 AM - 5:00PM"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex flex-wrap">
                    <div className="rate text-lg font-semibold mb-2">
                      <span className="text-600 font-medium">By: </span>
                      <span className="ml-2">
                        {applicationDetails.post.first_name}
                      </span>
                    </div>
                    <span className="mx-3"> | </span>
                    <div className="rate text-lg font-semibold mb-2">
                      <span className="pi pi-map-marker"></span>
                      <span className="ml-2">
                        {applicationDetails.post.city_municipality}
                      </span>
                    </div>
                    <span className="mx-3"> | </span>
                    <div className="rate text-lg font-semibold mb-2">
                      <span className="ml-2">
                        {applicationDetails.distance}
                      </span>
                      <span className="sitance-value"> Kilometers</span>
                    </div>
                  </div>
                </div>
                <p className="p-2">{applicationDetails.post.job_description}</p>
                {/* <p>
              Application Date:{" "}
              {dateConverter.convertDateWithTimeToReadable(
                applicationDetails.application_date
              )}
            </p> */}
              </div>
              <div className="footer">
                <div className="flex flex-wrap justify-content-between">
                  <div className="rate text-lg font-semibold mb-2 flex align-items-center -ml-2">
                    <Button
                      icon="pi pi-sort-alt"
                      size="small"
                      rounded
                      text
                      aria-label="Filter"
                      link
                    />
                    <span className="text-600 font-medium">Pay: </span>
                    <span className="font-bold ml-3">
                      {applicationDetails.post.pay_rate}
                    </span>
                    <span className="text-00 ml-1"> /hr</span>
                  </div>
                  {/* ADD Action Buttons = Message & Cancel Application */}
                  <div className="flex flex-wrap">
                    <Button
                      label="Message"
                      icon="pi pi-envelope"
                      className=" p-button mr-2"
                      size="small"
                    />
                    <Button
                      label="Cancel Application"
                      className="p-button-danger p-button"
                      text
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Timeline */}
            <div className="pt-3 bg-white col-4 p-4 mt-4">
              <h5 className="text-center mb-5">Tracking Your Application</h5>
              <Timeline
                value={timelineData}
                className="custom"
                opposite={customizedContent}
                content={(item) => (
                  <small className="text-color-secondary">{item.date}</small>
                )}
                marker={customizedMarker}
              ></Timeline>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default JobApplicationView;
