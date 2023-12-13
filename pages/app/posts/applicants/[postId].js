import EmployerNavbar from "@/layout/EmployerNavbar";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { LocationService } from "@/layout/service/LocationService";
import ServicesTemplate from "@/layout/components/ServicesTemplate";
import ShowWorkerDetailsBtn from "@/layout/components/employer/worker-search/worker-details/ShowWorkerDetailsBtn";
import ApplicationTabs from "@/layout/components/posts/applicants/ApplicationTabs";

const Applicants = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [distances, setDistances] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [shortlistedApplicants, setShortlistedApplicants] = useState([]);

  useEffect(() => {
    // console.log(session);
    const fetchApplicants = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/job-applicants/${router.query.postId}`
      );

      setApplicants(response.data);
    };

    const getDistances = async () => {
      if (!session) return;

      const distances =
        await LocationService.calculateDistancesToAllMunicipalities(
          "LEYTE",
          session.user.city
        );
      setDistances(distances);
    };

    fetchApplicants(); // get applicants for the post
    getDistances(); // get distances from employer's city to all municipalities
  }, [session]);

  const handleSignOut = () => {
    signOut();
  };

  const handleShortlist = (applicant) => {
    // Move the applicant from applicants to shortlistedApplicants
    setApplicants((prevApplicant) =>
      prevApplicant.filter((w) => w !== applicant)
    );
    setShortlistedApplicants((prevShortlisted) => [
      ...prevShortlisted,
      applicant,
    ]);
  };

  const handleRemoveShortlist = (applicant) => {
    // Move the applicant from shortlistedApplicants to applicants
    setShortlistedApplicants((prevShortlisted) =>
      prevShortlisted.filter((a) => a !== applicant)
    );
    setApplicants((prevApplicant) => [...prevApplicant, applicant]);
  };

  if (!session) {
    return <div>loading...</div>;
  }

  const itemTemplate = (worker) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 col lg:col-6">
        <div className="card grid col">
          <div className="col-12 flex">
            <div className="pr-3">
              <Avatar
                image={
                  worker.information.profile_url ||
                  "/layout/profile-default.png"
                }
                alt="profile"
                shape="circle"
                className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
              />
            </div>
            <div className="">
              <h4 className="mb-2">
                {worker.information.first_name +
                  " " +
                  worker.information.last_name}
              </h4>
              <Rating
                className="mb-2"
                value={0}
                readOnly
                stars={5}
                cancel={false}
              />
              <div className="rate text-lg font-semibold">
                ₱{worker.information.hourly_rate}/hr
              </div>
            </div>
            <div className="ml-auto flex flex-column">
              <Button
                className="interview-btn p-button-sm p-button-primary font-bold mb-3"
                tooltip="Shortlist Applicant"
                tooltipOptions={{ position: "top" }}
                onClick={() => handleShortlist(worker)}
              >
                <i className="pi pi-calendar mr-2" /> Shortlist
              </Button>

              <ShowWorkerDetailsBtn
                worker={worker.information}
                distances={distances}
              />
            </div>
          </div>
          <div className="location col-12">
            <span className="pi pi-map-marker"></span>
            <span className="ml-2">
              {worker.information.city_municipality} |{" "}
              {LocationService.getDistance(
                worker.information.city_municipality,
                distances
              )}{" "}
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
                severity={
                  worker.information.is_verified == "true"
                    ? "success"
                    : "warning"
                }
                value={
                  worker.information.is_verified == "true"
                    ? "Verified"
                    : "Unverified"
                }
              ></Tag>
            </div>
          </div>
          <div className="services col-12 p-0 pl-2 grid">
            <span className="text-600 font-medium col-3">Services: </span>
            <ServicesTemplate services={worker.information.services} />
          </div>
          <div className="bio col-12 ">
            <span className="worker-bio">{worker.information.bio}</span>
          </div>
        </div>
      </div>
    );
  };

  const shortlistItemTemplate = (worker) => {
    return (
      <div className="p-col-12 p-md-3 px-3 pb-4 col lg:col-6">
        <div className="card grid col">
          <div className="col-12 flex">
            <div className="pr-3">
              <Avatar
                image={
                  worker.information.profile_url ||
                  "/layout/profile-default.png"
                }
                alt="profile"
                shape="circle"
                className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
              />
            </div>
            <div className="">
              <h4 className="mb-2">
                {worker.information.first_name +
                  " " +
                  worker.information.last_name}
              </h4>
              <Rating
                className="mb-2"
                value={0}
                readOnly
                stars={5}
                cancel={false}
              />
              <div className="rate text-lg font-semibold">
                ₱{worker.information.hourly_rate}/hr
              </div>
            </div>
            <div className="ml-auto flex flex-column">
              <Button
                className="interview-btn p-button-sm p-button-primary font-bold mb-3"
                tooltip="Unshortlist Applicant"
                tooltipOptions={{ position: "top" }}
                onClick={() => handleRemoveShortlist(worker)}
              >
                <i className="pi pi-calendar mr-2" /> Remove
              </Button>

              <ShowWorkerDetailsBtn
                worker={worker.information}
                distances={distances}
              />
            </div>
          </div>
          <div className="location col-12">
            <span className="pi pi-map-marker"></span>
            <span className="ml-2">
              {worker.information.city_municipality} |{" "}
              {LocationService.getDistance(
                worker.information.city_municipality,
                distances
              )}{" "}
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
                severity={
                  worker.information.is_verified == "true"
                    ? "success"
                    : "warning"
                }
                value={
                  worker.information.is_verified == "true"
                    ? "Verified"
                    : "Unverified"
                }
              ></Tag>
            </div>
          </div>
          <div className="services col-12 p-0 pl-2 grid">
            <span className="text-600 font-medium col-3">Services: </span>
            <ServicesTemplate services={worker.information.services} />
          </div>
          <div className="bio col-12 ">
            <span className="worker-bio">{worker.information.bio}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="border-round m-4 p-4">
        {applicants.length > 0 && distances.length > 0 && (
          <ApplicationTabs
            applicants={applicants}
            distances={distances}
            postId={router.query.postId}
            session={session}
          />
        )}
      </div>
    </div>
  );
};

export default Applicants;
