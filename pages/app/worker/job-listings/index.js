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
import axios from "axios";
import WorkerNavbar from "@/layout/WorkerNavbar";
const DistanceCalculator = require("/lib/distanceCalc");
import { LocationService } from "@/layout/service/LocationService";

export default function WorkerSearchPage() {
    const { data: session, status: sessionStatus } = useSession();
    const [jobLists, setJobLists] = useState();
    const [distances, setDistances] = useState([]);
    const [selectedJobOption, setSelectedJobOption] = useState(null);
    const [distanceAO, setdistanceAO] = useState(false);
    const [costAO, setcostAO] = useState(false);
    const [bookingsAO, setbookingsAO] = useState(false);
    const jTypeOptions = [
        {
            name: 'All'
        },
        {
            name: 'Occassional'
        },
        {
            name: 'Full-time'
        },
        {
            name: 'Part-time'
        }
    ];

    const router = useRouter();

    useEffect(() => {
        if (!sessionStatus && !session) {
            router.push("/auth/login");
        } else if (sessionStatus && session) {
            fetchDistances();
            // console.log(distances)
        }

        async function fetchDistances() {
            const distances = await LocationService.calculateDistancesToAllMunicipalities("LEYTE", session.user.city);
            setDistances(distances);
        }

        // setDistances(DistanceCalculator.getDistanceMatrix(jobLists, session.user));

    }, [sessionStatus, session, router]);

    useEffect(() => {

        const fetchPosts = async () => {
            // setLoadingWorkers(true);
            try {
                const response = await axios.get(`http://localhost:5000/worker/job-listings`);
                // response.data.services = response.data.services[0];
                // console.log(response.data[0].services)
                setJobLists(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
            // setLoadingWorkers(false);
        };

        fetchPosts();
    }, []);

    const ServiceTemplate = ({ service }) => {
        return (
            jobLists && (
                <div className="ml-2">
                    <Tag icon="pi pi-tag" key={service[0].service_id ? service[0].service_id : ""} className="mr-2" value={service[0].service_name ? service[0].service_name : ""} />
                </div>
            )
        );
    };

    const getDistance = (city_municipality) => {
        const result = distances.find((item) => item.municipality === city_municipality);
        return result ? result.distance_val : "N/A";
    }


    const itemTemplate = (employer) => {
        return (

            <div className="p-col-12 p-md-3 px-3 pb-4">
                <div className="card grid col">
                    <div className="col-12 flex flex-column md:flex-row">
                        <div className="w-full mb-4">
                            <div className="flex flex-row">
                                <div className="pr-3">
                                    <img src="/layout/profile-default.png" alt={employer.first_name} width={'80px'} />
                                </div>
                                <div className="w-full md:w-8 lg:w-6 ">
                                    <h4 className="mb-2">{employer.job_title}</h4>
                                    <div className="flex w-full justify-content-between flex-wrap">
                                        <div className="flex py-1">
                                            <span className="text-600 font-medium ">Looking For: </span>
                                            {/* {console.log(employer.services)} */}
                                            <ServiceTemplate service={employer.services} />
                                        </div>
                                        <div className="flex py-1">
                                            <span className="text-600 font-medium ">Job Type: </span>
                                            <Tag className="ml-2" icon="pi pi-clock" value={employer.job_type} />
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
                                        <span className="ml-2">{getDistance(employer.city_municipality)}</span>
                                        <span className="sitance-value"> Kilometers</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bio col-12 ">
                                <span className="worker-bio">{employer.job_description}</span>
                            </div>
                        </div>
                        <div className="ml-auto flex flex-column w-full md:w-auto">
                            <Button label="Apply" className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-primary mb-2" />
                            <Button label="View Details" className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-secondary" />
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
                    <div className="col-fixed" style={{ width: '25vw' }}>
                        <div style={{ paddingLeft: '2.5vw', paddingTop: '5vh' }}>
                            <label className="font-bold">Type of Job</label>
                            <div className="py-3">
                                <Dropdown value={selectedJobOption} onChange={(e) => setSelectedJobOption(e.value)} options={jTypeOptions} optionLabel="name"
                                    placeholder="All" className="w-full" />
                            </div>
                            <div style={{ paddingTop: '5vh' }} className="card">
                                <label style={{ fontWeight: 'bold' }}>Filters</label>
                                <Divider />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ToggleButton checked={distanceAO} onChange={(e) => setdistanceAO(e.value)}
                                        onIcon="pi pi-angle-up" offIcon="pi pi-angle-down" onLabel="" offLabel=""
                                        style={{ width: '2vw', height: '2vh' }} />
                                    <label className="pl-3 text-lg">Distance</label>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ToggleButton checked={costAO} onChange={(e) => setcostAO(e.value)}
                                        onIcon="pi pi-angle-up" offIcon="pi pi-angle-down" onLabel="" offLabel=""
                                        style={{ width: '2vw', height: '2vh' }} />
                                    <label className="pl-3 text-lg">Cost</label>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ToggleButton checked={bookingsAO} onChange={(e) => setbookingsAO(e.value)}
                                        onIcon="pi pi-angle-up" offIcon="pi pi-angle-down" onLabel="" offLabel=""
                                        style={{ width: '2vw', height: '2vh' }} />
                                    <label className="pl-3 text-lg">Bookings</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </SplitterPanel>
                <SplitterPanel size={80} minSize={80} className="px-2">
                    <h1 className="text-center py-4">Apply for Jobs Near You</h1>
                    <DataView value={jobLists} itemTemplate={itemTemplate} layout={"grid"} paginator rows={12} />
                </SplitterPanel>
            </Splitter>
        </div>
    );
}

