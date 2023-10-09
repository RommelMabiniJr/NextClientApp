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
import axios from "axios";
import EmployerNavbar from "@/layout/EmployerNavbar";
import ShowWorkerDetailsBtn from "@/layout/components/employer/worker-search/ShowWorkerDetailsBtn";
import { LocationService } from "@/layout/service/LocationService";

export default function WorkerSearchPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [workers, setWorkers] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedJobOption, setSelectedJobOption] = useState(null);
  const [distanceAO, setdistanceAO] = useState(false);
  const [costAO, setcostAO] = useState(false);
  const [bookingsAO, setbookingsAO] = useState(false);
  const jTypeOptions = [
    {
      name: "All",
    },
    {
      name: "Occassional",
    },
    {
      name: "Full-time",
    },
    {
      name: "Part-time",
    },
  ];

  const [sortedWorkers, setSortedWorkers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (!sessionStatus && !session) {
      router.push("/auth/login");
    }
  }, [sessionStatus, session, router]);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoadingWorkers(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      try {
        const response = await axios.get(
          `${serverUrl}/employer/search/workers`
        );
        const sortedData = response.data.sort(
          (a, b) => a.hourly_rate - b.hourly_rate
        );
        setWorkers(sortedData);
        setSortedWorkers(sortedData);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      setLoadingWorkers(false);
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

    fetchWorkers();
    fetchDistances();
  }, [sessionStatus, session, router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const sortData = (field, order) => {
    let sortedData = [...sortedWorkers];
    sortedData.sort((a, b) => {
      if (order === "asc") {
        return a[field] - b[field];
      } else {
        return b[field] - a[field];
      }
    });
    setSortedWorkers(sortedData);
  };

  const getDistance = (city_municipality) => {
    const result = distances.find(
      (item) => item.municipality === city_municipality
    );
    return result ? result.distance_val : "N/A";
  };

  const ServicesTemplate = (worker) => {
    return (
      <div className="col flex flex-wrap">
        {worker.services &&
          worker.services.map((service) => (
            <Tag
              key={service.service_id}
              className="mr-2"
              value={service.service_name}
            />
          ))}
      </div>
    );
  };

  const itemTemplate = (worker) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 col lg:col-6">
        <div className="card grid col">
          <div className="col-12 flex">
            <div className="pr-3">
              {/* <img src="/layout/profile-default.png" alt={worker.first_name} width={'80px'} /> */}
              <Avatar
                image={worker.profile_url || "/layout/profile-default.png"}
                alt="profile"
                shape="circle"
                className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
              />
            </div>
            <div className="">
              <h4 className="mb-2">
                {worker.first_name + " " + worker.last_name}
              </h4>
              <Rating
                className="mb-2"
                value={0}
                readOnly
                stars={5}
                cancel={false}
              />
              <div className="rate text-lg font-semibold">
                ₱{worker.hourly_rate}/hr
              </div>
              {/* <span className="p-tag p-tag-success">{worker.category}</span> */}
            </div>
            <div className="ml-auto flex flex-column justify-content-between">
              <Button label="Hire" className="p-button-sm p-button-primary" />
              <ShowWorkerDetailsBtn worker={worker} getDistance={getDistance} />
            </div>
          </div>
          <div className="location col-12">
            <span className="pi pi-map-marker"></span>
            <span className="ml-2">
              {worker.city_municipality} |{" "}
              {getDistance(worker.city_municipality)} Kilometers
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
          <div className="bio col-12 ">
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
              <label className="font-bold">Type of Job</label>
              <div className="py-3">
                <Dropdown
                  value={selectedJobOption}
                  onChange={(e) => setSelectedJobOption(e.value)}
                  options={jTypeOptions}
                  optionLabel="name"
                  placeholder="All"
                  className="w-full"
                />
              </div>
              <label className="rate font-bold">Rate</label>
              <div className="py-3">
                <Dropdown
                  value={sortField}
                  options={[
                    {
                      label: "Hourly Rate (Low to High)",
                      value: "hourly_rate_asc",
                    },
                    {
                      label: "Hourly Rate (High to Low)",
                      value: "hourly_rate_desc",
                    },
                  ]}
                  onChange={(e) => {
                    const value = e.value;
                    const field = "hourly_rate";
                    const order = value.split("_")[2];
                    setSortField(field);
                    setSortOrder(order);
                    sortData(field, order);
                    console.log(sortedWorkers);
                    console.log(order);
                    console.log(field);
                  }}
                  placeholder="Sort by Hourly Rate"
                  className="w-full"
                />
              </div>
              <div style={{ paddingTop: "5vh" }} className="card">
                <label style={{ fontWeight: "bold" }}>Filters</label>
                <Divider />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ToggleButton
                    checked={distanceAO}
                    onChange={(e) => setdistanceAO(e.value)}
                    onIcon="pi pi-angle-up"
                    offIcon="pi pi-angle-down"
                    onLabel=""
                    offLabel=""
                    style={{ width: "2vw", height: "2vh" }}
                  />
                  <label className="pl-3 text-lg">Distance</label>
                </div>
                {/* <Divider />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ToggleButton checked={costAO} onChange={(e) => setcostAO(e.value)}
                                        onIcon="pi pi-angle-up" offIcon="pi pi-angle-down" onLabel="" offLabel=""
                                        style={{ width: '2vw', height: '2vh' }} />
                                    <label className="pl-3 text-lg">Cost</label>
                                </div> */}
                <Divider />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ToggleButton
                    checked={bookingsAO}
                    onChange={(e) => setbookingsAO(e.value)}
                    onIcon="pi pi-angle-up"
                    offIcon="pi pi-angle-down"
                    onLabel=""
                    offLabel=""
                    style={{ width: "2vw", height: "2vh" }}
                  />
                  <label className="pl-3 text-lg">Bookings</label>
                </div>
              </div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel size={80} minSize={80} className="px-2">
          <h1 className="text-center py-4">Find Your Ideal Kasambahay</h1>
          <DataView
            value={sortedWorkers}
            itemTemplate={itemTemplate}
            layout={"grid"}
            paginator
            rows={12}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
