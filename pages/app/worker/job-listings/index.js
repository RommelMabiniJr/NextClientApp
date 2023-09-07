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
// import ScrollRestorationDisabler from "@/layout/components/ScrollRestorationDisabler";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      userUUID: session.user.uuid,
    },
  };
}

export default function WorkerSearchPage({ userUUID }) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const workerUUID = session ? session.user.uuid : null;
  const [availableJobs, setAvailableJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [distances, setDistances] = useState([]);
  const [selectedJobOption, setSelectedJobOption] = useState(null);
  const [distanceAO, setdistanceAO] = useState(false);
  const [costAO, setcostAO] = useState(false);
  const [bookingsAO, setbookingsAO] = useState(false);
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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

  // Handle scroll event to update the scroll position state
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollTop);
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

  const handleViewButtonClick = (job) => {
    // Navigate to the new URL while preserving scroll position and selected tab

    // Save the selected tab index to the browser's history state
    window.history.pushState(
      { ...window.history.state, selectedTabIndex, scrollPosition },
      "",
      ""
    );

    console.log(window.history.state);
    router.push({
      pathname: "/app/worker/job-listings/job-application/[jobId]",
      query: { jobId: job.job_id },
    });
  };

  const handleTabChange = (e) => {
    const newIndex = e.index;
    setSelectedTabIndex(newIndex);
  };

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/worker/job-listings/${userUUID}`
        );

        setAvailableJobs(response.data);
        // console.log(response.data);

        const appliedResponse = await axios.get(
          `http://localhost:5000/worker/applied-jobs/${userUUID}`
        );

        setAppliedJobs(appliedResponse.data);
        console.log(appliedResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handlePopstate = (event) => {
      // When navigating back from page2, the popstate event is triggered.
      // Store the scroll position and selected tab index from the event state.
      const { scrollPosition, selectedTabIndex } = event.state || {};
      setScrollPosition(scrollPosition || 0);
      setSelectedTabIndex(selectedTabIndex || 0);

      console.log("called");
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  // useEffect(() => {
  //   // Restore the selected tab index from the browser's history state, if available
  //   const savedTabIndex = window.history.state?.selectedTabIndex;
  //   if (savedTabIndex !== undefined) {
  //     setSelectedTabIndex(savedTabIndex);
  //   }

  //   console.log(window.history.state);
  // }, []);

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
        `http://localhost:5000/worker/application/${workerUUID}/${jobId}`
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
              <Button
                // label="Not Interested"
                icon="pi pi-eye-slash"
                className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-secondary mt-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const appliedListTemplate = (employer) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 w-full">
        <div className="card grid col">
          <div className="bg-yellow-200 p-2 pl-3 border-round flex mr-2 w-full">
            <i
              className="pi pi-clock text-yellow-800"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="text-yellow-800 font-medium ml-3">
              Your application is awaiting evaluation by the employer.
            </span>
          </div>
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
                      <Tag
                        className="ml-2"
                        icon="pi pi-clock"
                        value={employer.post.job_type}
                      />
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
                onClick={() => handleViewButtonClick(employer.post)}
              />

              <Button
                // label="Not Interested"
                // icon="pi pi-eye-slash"
                label="Cancel Application"
                className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-danger mt-2 w-full"
                onClick={async () => {
                  // console.log(employer);
                  const confirmationResult = await cancelApplication({
                    workerUUID,
                    jobId: employer.post.job_id,
                  });

                  handleCancelApplication(employer);
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
      <ScrollbarWrapper scrollTop={scrollPosition} onScroll={handleScroll}>
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
                      onChange={(e) =>
                        handleCheckboxChange("DateRange", e.value)
                      }
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
                      onChange={(e) =>
                        handleCheckboxChange("Distance", e.value)
                      }
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
                      onChange={(e) =>
                        handleCheckboxChange("Duration", e.value)
                      }
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
            </SplitterPanel>
          </Splitter>
        </div>
      </ScrollbarWrapper>
    </div>
  );
}
