// Create a page that shows list of applicants for a post

import EmployerNavbar from "@/layout/EmployerNavbar";
import React, { useState, useEffect, useRef } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { LocationService } from "@/layout/service/LocationService";
import ServicesTemplate from "@/layout/components/ServicesTemplate";

const Applicants = () => {
  const router = useRouter();
  const { data: session } = useSession();
  //   dUMMY DATA
  const workers = [
    {
      id: 1,
      first_name: "Jasper",
      last_name: "Dela Cruz",
      email: "jasperdelacruz@gmail.com",
      city_municipality: "Makati City",
      bio: "I am a hardworking person",
      hourly_rate: 100,
      services: [
        { service_id: 1, service_name: "House Cleaning" },
        { service_id: 2, service_name: "Laundry" },
      ],
    },
    {
      id: 2,
      first_name: "Martin",
      last_name: "Porter",
      email: "martinporter@gmail.com",
      city_municipality: "Makati City",
      bio: "I am a hardworking person but I am not a good person to work with because I am a bad person so please don't hire me",
      hourly_rate: 100,
      services: [
        { service_id: 1, service_name: "House Cleaning" },
        { service_id: 2, service_name: "Laundry" },
      ],
    },
  ];

  const handleSignOut = () => {
    signOut();
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
                image={"/layout/profile-default.png"}
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
            </div>
            <div className="ml-auto flex flex-column justify-content-between">
              <Button label="Hire" className="p-button-sm p-button-primary" />
            </div>
          </div>
          <div className="location col-12">
            <span className="pi pi-map-marker"></span>
            <span className="ml-2">{worker.city_municipality}</span>
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
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="border-round bg-white m-4 p-4">
        <div className="font-medium text-800 text-2xl mb-3">Applicants</div>
        <div className="mb-5">People that Applied</div>
        <div className="p-grid">
          <DataView
            value={workers}
            layout="grid"
            itemTemplate={itemTemplate}
            paginator
            rows={12}
            className="p-col-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Applicants;
