import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DataView } from "primereact/dataview";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Rating } from "primereact/rating";
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
import EmployerNavbar from "@/layout/EmployerNavbar";
import ShowWorkerDetailsBtn from "@/layout/components/employer/worker-search/worker-details/ShowWorkerDetailsBtn";
import { LocationService } from "@/layout/service/LocationService";
import { getTotalAverageRating } from "@/layout/components/utils/ratingreviewutils";

export default function WorkerSearchPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [distances, setDistances] = useState([]);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState(
    []
  );
  const [sortSelectBookings, setSortSelectBookings] = useState(null);
  const [sortSelectDistance, setSortSelectDistance] = useState(null);
  const [sortSelectRate, setSortSelectRate] = useState(null);
  const [sortSelectStars, setSortSelectStars] = useState(null);

  const [filteredAndSortedJobs, setFilteredAndSortedJobs] = useState([]);
  const [activeSortOption, setActiveSortOption] = useState(null);

  const router = useRouter();

  const documentAvailOptions = [
    {
      name: "Resume",
      value: "resume",
    },
    {
      name: "NBI clearance",
      value: "nbi clearance",
    },
    {
      name: "Police Clearance",
      value: "police clearance",
    },
    {
      name: "Barangay Clearance",
      value: "barangay clearance",
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

  const rateOptions = [
    {
      value: "Lowest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Highest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const starsOptions = [
    {
      value: "Highest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Shortest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const bookingsOptions = [
    {
      value: "Highest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Lowest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  // useEffect(() => {
  //   if (!sessionStatus && !session) {
  //     router.push("/auth/login");
  //   }
  // }, [sessionStatus, session, router]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchWorkers = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      try {
        const response = await axios.get(
          `${serverUrl}/employer/search/workers`
        );

        // get and cal
        const distances =
          await LocationService.calculateDistancesToAllMunicipalities(
            "LEYTE",
            session.user.city
          );

        // set distance for each worker by city_municipality
        const workersWithDistances = response.data.map((worker) => ({
          ...worker,
          distance: LocationService.getDistance(
            worker.city_municipality,
            distances
          ),
        }));

        setDistances(distances);
        setAvailableWorkers(workersWithDistances);
        // console.log(workersWithDistances);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDistances = async () => {
      if (session && session.user) {
        const distances =
          await LocationService.calculateDistancesToAllMunicipalities(
            "LEYTE",
            session.user.city
          );
        setDistances(distances);
      }
    };

    // fetchDistances();
    fetchWorkers();
  }, [sessionStatus, session, router]);

  // Function to apply filtering and sorting to available workers
  const applyFilterAndSort = () => {
    let filteredWorkers = [...availableWorkers];

    // Apply filters
    if (selectedDocuments.length > 0) {
      filteredWorkers = filteredWorkers.filter((worker) =>
        worker.documents.some((document) =>
          selectedDocuments.includes(document.type.toLowerCase())
        )
      );
    }

    // checks if any of the selected service categories is in the worker's services
    if (selectedServiceCategories.length > 0) {
      filteredWorkers = filteredWorkers.filter((worker) =>
        worker.services.some((service) =>
          selectedServiceCategories.includes(service.service_name)
        )
      );
    }

    // Apply sorting to whichever sort option is active
    switch (activeSortOption) {
      case "Bookings":
        // TODO: Implement sorting by date range
        if (sortSelectBookings === "Highest") {
          filteredWorkers.sort((a, b) => b.booking_count - a.booking_count);
        } else if (sortSelectBookings === "Lowest") {
          filteredWorkers.sort((a, b) => a.booking_count - b.booking_count);
        }

        break;
      case "Distance":
        // console.log("Before: ", filteredWorkers);
        if (sortSelectDistance === "Nearest") {
          filteredWorkers.sort((a, b) => a.distance - b.distance);
        } else if (sortSelectDistance === "Farthest") {
          filteredWorkers.sort((a, b) => b.distance - a.distance);
        }

        // console.log(filteredWorkers);
        break;
      case "Rate":
        // TODO: Implement sorting by cost
        if (sortSelectRate === "Lowest") {
          filteredWorkers.sort((a, b) => a.hourly_rate - b.hourly_rate);
        } else if (sortSelectRate === "Highest") {
          filteredWorkers.sort((a, b) => b.hourly_rate - a.hourly_rate);
        }
        break;
      case "Stars":
        // TODO: Implement sorting by duration
        if (sortSelectStars === "Shortest") {
          filteredWorkers.sort((a, b) => {
            const avgStarsA = getTotalAverageRating(a);
            const avgStarsB = getTotalAverageRating(b);
            return avgStarsA - avgStarsB;
          });

          console.log("Shortest: ", filteredWorkers);
        } else if (sortSelectStars === "Highest") {
          filteredWorkers.sort((a, b) => {
            const avgStarsB = getTotalAverageRating(b);
            const avgStarsA = getTotalAverageRating(a);
            return avgStarsB - avgStarsA;
          });
          console.log("highest: ", filteredWorkers);
        }

        break;
      default:
        // console.log("No active sort option");
        break;
    }

    // Update the state with filtered and sorted workers.
    setFilteredAndSortedJobs(filteredWorkers);
    // console.log(filteredWorkers);
  };

  useEffect(() => {
    // Apply initial filtering and sorting when availableWorkers change.
    applyFilterAndSort();
    // console.log("filtering");
  }, [
    availableWorkers,
    selectedDocuments,
    selectedServiceCategories,
    sortSelectBookings,
    sortSelectDistance,
    sortSelectRate,
    sortSelectStars,
  ]);

  if (!session) {
    return <div>Loading...</div>;
  }

  // const getDistance = (city_municipality) => {
  //   const result = distances.find(
  //     (item) => item.municipality === city_municipality
  //   );
  //   return result ? result.distance_val : "N/A";
  // };

  // Function to handle checkbox selection and deselection
  const handleCheckboxChange = (name, value) => {
    // console.log(name, value);
    switch (name) {
      case "Bookings":
        setSortSelectBookings(sortSelectBookings === value ? null : value);
        setSortSelectDistance(null);
        setSortSelectRate(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Distance":
        setSortSelectDistance(sortSelectDistance === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectRate(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Rate":
        setSortSelectRate(sortSelectRate === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectDistance(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Stars":
        setSortSelectStars(sortSelectStars === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectDistance(null);
        setSortSelectRate(null);
        setActiveSortOption(name);
        break;
      default:
        break;
    }
  };

  const ServicesTemplate = (worker) => {
    return (
      <div className="col flex flex-wrap gap-2">
        {worker.services &&
          worker.services.map((service) => (
            <div key={service.service_id}>
              <Tag
                key={service.service_id}
                className=""
                value={service.service_name}
              />
            </div>
          ))}
      </div>
    );
  };

  const itemTemplate = (worker) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 col lg:col-6">
        <div className="card grid col h-full">
          <div className="col-12 flex">
            <div className="flex">
              <div className="pr-3">
                {/* <img src="/layout/profile-default.png" alt={worker.first_name} width={'80px'} /> */}
                <Avatar
                  image={worker.profile_url || "/layout/profile-default.png"}
                  alt="profile"
                  shape="circle"
                  className="h-7rem w-7rem shadow-2 cursor-pointer"
                />
              </div>
              <div className="w-full mr-2">
                <h4 className="w-full mb-2 ">
                  {worker.first_name + " " + worker.last_name}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <Rating
                    className=""
                    value={getTotalAverageRating(worker)}
                    readOnly
                    stars={5}
                    cancel={false}
                    pt={{
                      onIcon: {
                        className: "text-orange-400",
                      },
                    }}
                  />
                  <span className="text-sm">({worker.reviews.length})</span>
                </div>
                <div className="number-of-bookings ">
                  <span className="">
                    <i className="pi pi-users mr-1"></i>
                    {worker.booking_count}{" "}
                    {worker.booking_count > 1 ? "bookings" : "booking"}
                  </span>
                </div>
                <div className="rate text-lg font-semibold">
                  ₱{worker.hourly_rate}/hr
                </div>
                {/* <span className="p-tag p-tag-success">{worker.category}</span> */}
              </div>
            </div>
            <div className="flex flex-column gap-2 w-8">
              <Button label="Hire" className="p-button-sm p-button-primary " />
              <ShowWorkerDetailsBtn worker={worker} distances={distances} />
            </div>
          </div>

          <div className="location col-12">
            <span className="pi pi-map-marker"></span>
            <span className="ml-2">
              {worker.city_municipality} |{" "}
              {LocationService.getDistance(worker.city_municipality, distances)}{" "}
              Kilometers
            </span>
          </div>
          <div className="badges col-12 p-0 pl-2 grid">
            <span className="text-600 font-medium col-3">Badges: </span>
            {/* Replace this with dynamically generated services */}
            <div className="col">
              <Tag
                className="mr-2"
                icon="pi pi-verified"
                severity={worker.is_verified == "true" ? "success" : "warning"}
                value={worker.is_verified == "true" ? "Verified" : "Unverified"}
              ></Tag>
            </div>
          </div>
          <div className="services col-12 p-0 pl-2 grid">
            <span className="text-600 font-medium col-3">Services: </span>
            {/* Replace this with dynamically generated services */}
            {/* <div className="col">
                            <span className="p-tag p-tag-rounded p-tag-info">House Services</span>
                        </div> */}
            <ServicesTemplate services={worker.services} />
          </div>
          <div className="bio col-12">
            <span className="worker-bio">{worker.bio}</span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <EmployerNavbar session={session} />
      <Splitter>
        <SplitterPanel size={20} minSize={20} className="px-2">
          <div className="col-fixed" style={{ width: "25vw" }}>
            <div style={{ paddingLeft: "2.5vw", paddingTop: "5vh" }}>
              <span className="vertical-align-middle font-bold">
                <i className="pi pi-filter mr-1"></i>
                Filters
              </span>
              <Divider className="mt-2" />
              <label className="font-medium">Document Availability</label>
              <div className="py-3">
                <MultiSelect
                  value={selectedDocuments}
                  options={documentAvailOptions}
                  onChange={(e) => setSelectedDocuments(e.value)}
                  optionLabel="name"
                  placeholder="Select Document Availability"
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
                  value={sortSelectBookings}
                  options={bookingsOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Bookings", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Number of Bookings{" "}
                  {sortSelectBookings ? `(${sortSelectBookings})` : "(none)"}
                </span>
              </div>

              {/* Distance */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={sortSelectDistance}
                  options={distanceOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Distance", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Distance{" "}
                  {sortSelectDistance ? `(${sortSelectDistance})` : "(none)"}
                </span>
              </div>

              {/* Cost */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={sortSelectRate}
                  options={rateOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Rate", e.value)}
                  // disabled // disable cost sorting for now
                />
                <span className="vertical-align-middle ml-2">
                  Pay rate {sortSelectRate ? `(${sortSelectRate})` : "(none)"}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={sortSelectStars}
                  options={starsOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Stars", e.value)}
                  // disabled // disable duration sorting for now
                />
                <span className="vertical-align-middle ml-2">
                  Stars {sortSelectStars ? `(${sortSelectStars})` : "(none)"}
                </span>
              </div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel size={80} minSize={80} className="px-2">
          <h1 className="text-center py-4">Find Your Ideal Kasambahay</h1>
          <DataView
            value={filteredAndSortedJobs}
            itemTemplate={itemTemplate}
            layout={"grid"}
            paginator
            rows={12}
          />
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
