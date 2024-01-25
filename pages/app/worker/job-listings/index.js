import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { DataView } from "primereact/dataview";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { ToggleButton } from "primereact/togglebutton";
import { Avatar } from "primereact/avatar";
import { MultiSelect } from "primereact/multiselect";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import axios from "axios";
import WorkerNavbar from "@/layout/WorkerNavbar";
import { LocationService } from "@/layout/service/LocationService";
import JobDetailsDialog from "@/layout/components/worker/job-listings/JobDetailsDialog";
import DateConverter from "@/lib/dateConverter";
import { TabView, TabPanel } from "primereact/tabview";
import { getSession } from "next-auth/react";
import ScrollbarWrapper from "@/layout/components/ScrollbarWrapper";
import { mapTimelineData } from "@/layout/components/utils/timelineUtils";
// import ScrollRestorationDisabler from "@/layout/components/ScrollRestorationDisabler";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userUUID: session.user.uuid,
    },
  };
}

export default function WorkerSearchPage({ userUUID }) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { elementId, tabIndex } = router.query;
  const workerUUID = session ? session.user.uuid : null;
  const [availableJobs, setAvailableJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [distances, setDistances] = useState([]);
  const [selectedWorkArrangements, setSelectedWorkArrangements] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [selectedDateRange, setSelectedDateRange] = useState();
  const [selectedDistance, setSelectedDistance] = useState();
  const [selectedCost, setSelectedCost] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const [filteredAndSortedJobs, setFilteredAndSortedJobs] = useState([]);
  const [activeSortOption, setActiveSortOption] = useState(null);

  // Will be used to restore scroll position and selected tab when navigating back to this page
  const [selectedTabIndex, setSelectedTabIndex] = useState(() => {
    if (tabIndex) {
      return parseInt(tabIndex);
    } else {
      return 0;
    }
  });

  const [scrollId, setScrollId] = useState(() => {
    if (elementId !== undefined) {
      return elementId;
    } else {
      return null;
    }
  });

  const [tabReady, setTabReady] = useState();

  const dateConv = DateConverter();
  const workArrangeOptions = [
    {
      name: "Temporary",
      value: "temporary",
    },
    {
      name: "Full-time",
      value: "full-time",
    },
    {
      name: "Part-time",
      value: "part-time",
    },
  ];

  const serviceCategoryOptions = [
    {
      name: "Child Care",
      value: "Child Care",
    },
    {
      name: "Elder Care",
      value: "Elder Care",
    },
    {
      name: "House Services",
      value: "House Services",
    },
    {
      name: "Pet Care",
      value: "Pet Care",
    },
  ];

  const distanceOptions = [
    {
      value: "Nearest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Farthest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const costOptions = [
    {
      value: "Lowest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Highest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const durationOptions = [
    {
      value: "Shortest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Longest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const dateRangeOptions = [
    {
      value: "Recent",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Oldest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const scrollToID = (elID) => {
    // Make sure error is handled if element doesn't exist
    const el = document.getElementById(elID);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 60,
        behavior: "smooth",
      });
    } else {
      // otherwise just reload the page
      router.reload();
    }
  };

  // Function to handle checkbox selection and deselection
  const handleCheckboxChange = (name, value) => {
    // console.log(name, value);
    switch (name) {
      case "DateRange":
        setSelectedDateRange(selectedDateRange === value ? null : value);
        setSelectedDistance(null);
        setSelectedCost(null);
        setSelectedDuration(null);
        setActiveSortOption(name);
        break;
      case "Distance":
        setSelectedDistance(selectedDistance === value ? null : value);
        setSelectedDateRange(null);
        setSelectedCost(null);
        setSelectedDuration(null);
        setActiveSortOption(name);
        break;
      case "Cost":
        setSelectedCost(selectedCost === value ? null : value);
        setSelectedDateRange(null);
        setSelectedDistance(null);
        setSelectedDuration(null);
        setActiveSortOption(name);
        break;
      case "Duration":
        setSelectedDuration(selectedDuration === value ? null : value);
        setSelectedDateRange(null);
        setSelectedDistance(null);
        setSelectedCost(null);
        setActiveSortOption(name);
        break;
      default:
        break;
    }
  };

  const handleViewApplicationButtonClick = (job) => {
    router.push({
      pathname: `/app/worker/job-listings/job-application/${job.application_id}`,
      query: {
        jobId: job.post.job_id,
        elementId: `application-${job.application_id}`,
        tabIndex: 1,
      },
    });
  };

  const handleViewPostButtonClick = (job) => {
    router.push({
      pathname: `/app/worker/job-listings/${job.job_id}`,
      query: {
        jobId: job.job_id,
        elementId: `post-${job.job_id}`,
        tabIndex: 0,
      },
    });
  };

  const handleTabChange = (e) => {
    const newIndex = e.index;
    setSelectedTabIndex(newIndex);
  };

  useEffect(() => {
    // This effect will run when `tabReady` becomes true
    console.log("Scrolling to: ", tabReady);
    if (tabReady && scrollId) {
      // Place your code here that needs to run after the tab is ready
      // and its items are rendered.
      // You can call scrollToID or perform any other actions here.
      scrollToID(scrollId);
    }
  }, [tabReady, scrollId]);

  useEffect(() => {
    if (!sessionStatus && !session) {
      router.push("/auth/login");
    } else if (sessionStatus && session) {
      fetchDistances();

      // set distance for each job by city_municipality

      availableJobs.forEach((job) => {
        job.distance = LocationService.getDistance(
          job.city_municipality,
          distances
        );
      });

      // console.log(availableJobs);
    }

    async function fetchDistances() {
      const distances =
        await LocationService.calculateDistancesToAllMunicipalities(
          "LEYTE",
          session.user.city
        );
      setDistances(distances);
    }
  }, [sessionStatus, session, router]);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/worker/job-listings/${userUUID}`
        );

        setAvailableJobs(response.data);
        // console.log(response.data);

        const appliedResponse = await axios.get(
          `${serverUrl}/worker/applied-jobs/${userUUID}`
        );

        setAppliedJobs(appliedResponse.data);
        console.log(appliedResponse.data);

        if (tabIndex == 1) {
          setTabReady(true);
        } else {
          setTabReady(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [userUUID]);

  // Function to apply filtering and sorting to available jobs
  const applyFilterAndSort = () => {
    let filteredJobs = [...availableJobs];

    // Apply filters
    if (selectedWorkArrangements.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        selectedWorkArrangements.includes(job.job_type)
      );
    }

    if (selectedServiceCategories.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        // iterate through all services of the job
        job.services.some((service) =>
          // check if any of the selected service categories is in the job's services
          selectedServiceCategories.includes(service.service_name)
        )
      );
    }

    // Apply sorting to whichever sort option is active
    switch (activeSortOption) {
      case "DateRange":
        if (selectedDateRange === "Recent") {
          filteredJobs.sort((a, b) => {
            const dateA = new Date(a.job_posting_date);
            const dateB = new Date(b.job_posting_date);

            return dateB - dateA;
          });
        } else if (selectedDateRange === "Oldest") {
          filteredJobs.sort((a, b) => {
            const dateA = new Date(a.job_posting_date);
            const dateB = new Date(b.job_posting_date);
            return dateA - dateB;
          });
        }

        break;
      case "Distance":
        // console.log(selectedDistance);
        if (selectedDistance === "Nearest") {
          filteredJobs.sort((a, b) => a.distance - b.distance);
        } else if (selectedDistance === "Farthest") {
          filteredJobs.sort((a, b) => b.distance - a.distance);
        }
        break;
      case "Cost":
        // TODO: Implement sorting by cost

        // if (selectedCost === "Lowest") {
        //   filteredJobs.sort((a, b) => a.cost - b.cost);
        // } else if (selectedCost === "Highest") {
        //   filteredJobs.sort((a, b) => b.cost - a.cost);
        // }
        break;
      case "Duration":
        // TODO: Implement sorting by duration

        // if (selectedDuration === "Shortest") {
        //   filteredJobs.sort((a, b) => a.duration - b.duration);
        // } else if (selectedDuration === "Longest") {
        //   filteredJobs.sort((a, b) => b.duration - a.duration);
        // }
        break;
      default:
        // console.log("No active sort option");
        break;
    }

    // Update the state with filtered and sorted jobs.
    setFilteredAndSortedJobs(filteredJobs);
  };

  useEffect(() => {
    // Apply initial filtering and sorting when availableJobs change.
    applyFilterAndSort();
    console.log("filtering");
  }, [
    availableJobs,
    selectedWorkArrangements,
    selectedServiceCategories,
    selectedDateRange,
    selectedDistance,
    selectedCost,
    selectedDuration,
  ]);

  if (!session) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleApply = (job) => {
    let jobToApply;

    setAvailableJobs(
      availableJobs.filter((item) => {
        if (item.job_id !== job.post.job_id) {
          return true;
        } else {
          jobToApply = item;
          return false;
        }
      })
    );
    setAppliedJobs([...appliedJobs, { post: jobToApply }]);
    location.reload(); // TODO: Remove this when we have a better way of updating the UI
  };

  const handleCancelApplication = (job) => {
    setAppliedJobs(
      appliedJobs.filter((item) => item.post.job_id !== job.post.job_id)
    );

    // console.log(appliedJobs);
    setAvailableJobs([...availableJobs, job.post]);
  };

  const cancelApplication = async ({ workerUUID, jobId }) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/worker/application/${workerUUID}/${jobId}`
      );

      return response.data; // Return response or handle as needed
    } catch (error) {
      console.error("Error confirming application: ", error);
    }
  };

  const ServiceTemplate = ({ service }) => {
    return (
      availableJobs && (
        <div className="ml-2">
          <Tag
            icon="pi pi-tag"
            key={service[0].service_id ? service[0].service_id : ""}
            className="mr-2"
            value={service[0].service_name ? service[0].service_name : ""}
          />
        </div>
      )
    );
  };

  const itemTemplate = (employer) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 w-full">
        <div className="card grid col">
          <div className="col-12 flex flex-column lg:flex-row">
            <div className="w-full mb-4">
              <div className="flex flex-row">
                <div className="pr-3">
                  {/* <img src="/layout/profile-default.png" alt={employer.first_name} width={'80px'} /> */}
                  <Avatar
                    image={
                      employer.profile_url || "/layout/profile-default.png"
                    }
                    alt="profile"
                    shape="circle"
                    className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
                  />
                </div>
                <div className="w-full xl:w-8 m-2">
                  <h4 className="mb-2">{employer.job_title}</h4>
                  <div className="grid w-full">
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium">
                        Looking For:{" "}
                      </span>
                      {/* {console.log(employer.services)} */}
                      <ServiceTemplate service={employer.services} />
                    </div>
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium ">Job Type: </span>
                      <Tag
                        className="ml-2"
                        icon="pi pi-clock"
                        value={employer.job_type}
                      />
                    </div>
                  </div>
                  <div className="grid w-full">
                    <div className="col mr-4">
                      <span className="text-600 font-medium mr-1">Start: </span>
                      <div className="text-700 font-medium">
                        {dateConv.toNumbers(employer.job_start_date)}
                      </div>
                    </div>
                    <div className="col mr-4">
                      <span className="text-600 font-medium mr-2">End: </span>
                      <div className="text-700 font-medium">
                        {dateConv.toNumbers(employer.job_end_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="flex flex-wrap">
                  <div className="rate text-lg font-semibold mb-2">
                    <span className="text-600 font-medium">By: </span>
                    <span className="ml-2">{employer.first_name}</span>
                  </div>
                  <span className="mx-3"> | </span>
                  <div className="rate text-lg font-semibold mb-2">
                    <span className="pi pi-map-marker"></span>
                    <span className="ml-2">{employer.city_municipality}</span>
                  </div>
                  <span className="mx-3"> | </span>
                  <div className="rate text-lg font-semibold mb-2">
                    <span className="ml-2">
                      {LocationService.getDistance(
                        employer.city_municipality,
                        distances
                      )}
                    </span>
                    <span className="sitance-value"> Kilometers</span>
                  </div>
                </div>
              </div>
              <div className="bio col-12 ">
                <span className="worker-bio">{employer.job_description}</span>
              </div>
            </div>
            <div className="ml-auto flex flex-column w-full md:w-auto">
              <JobDetailsDialog
                workerUUID={workerUUID}
                job={employer}
                onApply={handleApply}
                distances={distances}
                getDistance={LocationService.getDistance}
              />
              {/* <Button
                // label="Not Interested"
                icon="pi pi-eye-slash"
                className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-secondary mt-2 w-full"
              /> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const appliedListTemplate = (employer) => {
    return (
      <div
        id={`application-${employer.application_id}`}
        className="p-col-12 p-md-3 px-3 pb-4 w-full"
      >
        <div className="card grid col">
          {mapTimelineData([employer.timeline_event]).map((item, index) => {
            if (
              item.event_description == "Job Offer" ||
              item.event_description == "Interview Scheduled"
            ) {
              return (
                <div
                  key={index}
                  className="bg-blue-200 p-2 pl-3 border-round flex items-center mr-2 w-full text-sm"
                >
                  <i
                    className={`pi pi-clock text-blue-800 ${item.icon}`}
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  <p className="text-blue-800 font-medium m-0 ml-2 mr-3 line-clamp-1 ">
                    <span className="font-semibold mr-2 text-base">
                      {item.event_description}:
                    </span>
                    {item.content}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="bg-green-200 p-2 pl-3 border-round flex items-center mr-2 w-full text-sm"
                >
                  <i
                    className={`pi pi-clock text-green-800 ${item.icon}`}
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  <p className="text-green-800 font-medium m-0 ml-2 mr-3 line-clamp-1 ">
                    <span className="font-semibold mr-2 font text-base">
                      {item.event_description}:
                    </span>
                    {item.content}
                  </p>
                </div>
              );
            }
          })}
          <div className="col-12 flex flex-column lg:flex-row">
            <div className="w-full mb-4">
              <div className="flex flex-row">
                <div className="w-full xl:w-8 m-2">
                  <h4 className="mb-2">{employer.post.job_title}</h4>
                  <div className="grid w-full">
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium">
                        Looking For:{" "}
                      </span>
                      <div className="ml-2">
                        <Tag
                          icon="pi pi-tag"
                          className="mr-2"
                          value={employer.post.services[0].service_name}
                        />
                      </div>
                    </div>
                    <div className="col flex flex-wrap py-1">
                      <span className="text-600 font-medium ">Job Type: </span>
                      <div>
                        <Tag
                          className="ml-2"
                          icon="pi pi-clock"
                          // Capitalize first letter of job type
                          value={employer.post.job_type.replace(/^\w/, (c) =>
                            c.toUpperCase()
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid w-full">
                    <div className="col mr-4">
                      <span className="text-600 font-medium mr-1">Start: </span>
                      <div className="text-700 font-medium">
                        {dateConv.toNumbers(employer.post.job_start_date)}
                      </div>
                    </div>
                    <div className="col mr-4">
                      <span className="text-600 font-medium mr-2">End: </span>
                      <div className="text-700 font-medium">
                        {dateConv.toNumbers(employer.post.job_end_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mb-4">
                <span className="longtext-ellipsis">
                  {employer.post.job_description}
                </span>
              </div>
              <div>
                <span>
                  Application Date:{" "}
                  {dateConv.convertDateWithTimeToReadable(
                    employer.application_date
                  )}
                </span>
              </div>
            </div>

            <div className="ml-auto flex flex-column w-full md:w-auto">
              <Button
                label="View"
                className="w-full"
                onClick={() => handleViewApplicationButtonClick(employer)}
              />

              <Button
                label="Cancel Application"
                className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-danger mt-2 w-full"
                onClick={async () => {
                  // console.log(employer);
                  await cancelApplication({
                    workerUUID,
                    jobId: employer.post.job_id,
                  });

                  handleCancelApplication(employer);

                  // Change route
                  router.push({
                    pathname: "/app/worker/job-listings",
                    query: {
                      tabIndex: 1,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <WorkerNavbar session={session} />
      <Splitter>
        <SplitterPanel size={20} minSize={20} className="px-2">
          <div className="col-fixed" style={{ width: "25vw" }}>
            <div style={{ paddingLeft: "2.5vw", paddingTop: "5vh" }}>
              <span className="vertical-align-middle font-bold">
                <i className="pi pi-filter mr-1"></i>
                Filters
              </span>
              <Divider className="mt-2" />
              <label className="font-medium">Work Arrangement</label>
              <div className="py-3">
                <MultiSelect
                  value={selectedWorkArrangements}
                  options={workArrangeOptions}
                  onChange={(e) => setSelectedWorkArrangements(e.value)}
                  optionLabel="name"
                  placeholder="Select Work Arrangements"
                  className="w-full"
                />
              </div>

              <label className="font-medium">Service Categories</label>
              <div className="py-3 mb-4">
                <MultiSelect
                  value={selectedServiceCategories}
                  options={serviceCategoryOptions}
                  onChange={(e) => setSelectedServiceCategories(e.value)}
                  optionLabel="name"
                  placeholder="Select Service Categories"
                  className="w-full"
                />
              </div>
              <span className="vertical-align-middle font-bold">
                <i className="pi pi-sort mr-1"></i>
                Sort By
              </span>
              <Divider className="mt-2" />

              {/* Date Range */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={selectedDateRange}
                  options={dateRangeOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("DateRange", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Post Date{" "}
                  {selectedDateRange ? `(${selectedDateRange})` : "(none)"}
                </span>
              </div>

              {/* Distance */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={selectedDistance}
                  options={distanceOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Distance", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Distance{" "}
                  {selectedDistance ? `(${selectedDistance})` : "(none)"}
                </span>
              </div>

              {/* Cost */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={selectedCost}
                  options={costOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Cost", e.value)}
                  disabled // disable cost sorting for now
                />
                <span className="vertical-align-middle ml-2">
                  Cost {selectedCost ? `(${selectedCost})` : "(none)"}
                </span>
              </div>

              {/* Duration */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={selectedDuration}
                  options={durationOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Duration", e.value)}
                  disabled // disable duration sorting for now
                />
                <span className="vertical-align-middle ml-2">
                  Duration{" "}
                  {selectedDuration ? `(${selectedDuration})` : "(none)"}
                </span>
              </div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel size={80} minSize={80} className="px-2">
          <TabView
            className="mt-2"
            activeIndex={selectedTabIndex}
            onTabChange={handleTabChange}
          >
            <TabPanel header="Browse Jobs">
              <h1 className="text-center py-4">Apply for Jobs Near You</h1>
              <DataView
                value={filteredAndSortedJobs}
                itemTemplate={itemTemplate}
                layout={"grid"}
                paginator
                rows={12}
                // sortField="job_posting_date"
                // sortOrder={-1}
              />
            </TabPanel>
            <TabPanel header="Applied Jobs">
              <h1 className="text-center py-4">Applications</h1>
              <DataView
                value={appliedJobs}
                itemTemplate={appliedListTemplate}
                layout={"grid"}
                paginator
                rows={12}
                sortField="job_posting_date"
                sortOrder={-1}
              />
            </TabPanel>
          </TabView>
          {/* Test scroll position */}
          {/* <Button
            onClick={() => {
              // router.push("job-listings/#application-130");
              scrollToID("application-130");
            }}
            label="Test"
          /> */}
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
