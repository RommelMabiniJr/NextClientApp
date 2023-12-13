import { displaySimpleDate } from "@/layout/components/utils/dateUtils";
import {
  getNumReviews,
  getTotalAverageRating,
} from "@/layout/components/utils/ratingreviewutils";
import { LocationService } from "@/layout/service/LocationService";
import FormatHelper from "@/lib/formatHelper";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Rating } from "primereact/rating";
import React, { useState } from "react";

const DialogFormat = ({
  worker,
  visible,
  setVisible,
  dialogVisible,
  setDialogVisible,
  selectedDocUrl,
  setSelectedDocUrl,
  distances,
}) => {
  const router = useRouter();
  const formatHelper = FormatHelper();
  const languagesString = formatHelper.convertArrayToString(worker.languages);
  const servicesString = formatHelper.convertArrayToString(
    worker.services,
    "service_name"
  );

  return (
    <Dialog
      visible={visible}
      className="w-full md:w-8 border-solid border-1 border-black-alpha-90"
      onHide={() => setVisible(false)}
      footer={
        <div>
          <div className="flex justify-center ">
            <Button
              className=" mt-4"
              outlined
              label="HIRE KASAMBAHAY"
              rounded
              onClick={() => {
                router.push({
                  pathname: `/app/employer/worker-search/${worker.worker_id}/booking-request`,
                });
              }}
            />
          </div>
        </div>
      }
    >
      <div className="mx-3 ">
        <div>
          <div className="flex justify-between">
            <div className="flex items-center ">
              <div>
                <Avatar
                  image={worker.profile_url || "/layout/profile-default.png"}
                  alt="profile"
                  shape="circle"
                  className="h-8rem w-8rem shadow-2 cursor-pointer mx-4"
                />
              </div>
              <div className="flex flex-column align-items-start">
                <h1 className="my-2">
                  {worker.first_name + " " + worker.last_name}
                </h1>
                <div className="flex align-items-center mb-2">
                  <Rating
                    value={getTotalAverageRating(worker)}
                    readOnly
                    cancel={false}
                    pt={{
                      onIcon: {
                        className: "text-orange-400",
                      },
                    }}
                  />
                  <span className="ml-2">
                    ({getNumReviews(worker)} Ratings)
                  </span>
                </div>
                <div className="flex gap-4">
                  <label className="text-base">
                    ₱ {worker.hourly_rate} / hr
                  </label>
                  <label className="block mb-2">
                    <i className="pi pi-map-marker" />{" "}
                    {LocationService.getDistance(
                      worker.city_municipality,
                      distances
                    )}{" "}
                    Kilometers - {worker.city_municipality}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center my-4 gap-2">
            <h2 className="text-lg font-bold whitespace-nowrap m-0 ">
              Personal Information
            </h2>
            <Divider layout="horizontal" className="w-full" />{" "}
          </div>
          <div className="flex flex-column md:flex-row gap-2">
            <div className="flex-1">
              <label style={{ fontWeight: "bold" }}>
                <i className="pi pi-book" /> Languages Spoken
              </label>
              <label style={{ display: "block", paddingBottom: "2vh" }}>
                {" "}
                {languagesString}
              </label>
            </div>
            <div className="flex-1">
              <label style={{ fontWeight: "bold" }}>
                <i className="pi pi-check-circle" /> Services Offered
              </label>
              <label style={{ display: "block", paddingBottom: "2vh" }}>
                {" "}
                {servicesString}
              </label>
            </div>

            <div className="flex-1">
              <label style={{ fontWeight: "bold" }}>
                <i className="pi pi-calendar" /> Availability
              </label>
              <label style={{ display: "block", paddingBottom: "2vh" }}>
                {" "}
                {worker.availability}
              </label>
              {/* <AvailabilityInfo availability={availability}/> */}
            </div>
          </div>
          <div className="my-3">
            <label style={{ fontWeight: "bold" }}>
              <i className="pi pi-megaphone" /> Bio
            </label>
            <label style={{ display: "block", paddingBottom: "2vh" }}>
              {worker.bio}
            </label>
          </div>
          <div className="mb-4">
            <label style={{ fontWeight: "bold" }}>
              <i className="pi pi-briefcase" /> Experiences
            </label>
            <label style={{ display: "block", paddingBottom: "2vh" }}>
              {/* Experience 1 <br />
                                    Experience 2 */}
              {worker.work_experience}
            </label>
          </div>
        </div>

        {/* DOCUMENTS PART SUCH AS RESUME, BRGY CLEARANCE, ETC. */}
        <div className="mb-4">
          <div className="flex items-center mb-4 gap-2">
            <h2 className="text-lg font-bold whitespace-nowrap m-0 ">
              Documents
            </h2>
            <Divider layout="horizontal" className="w-full" />{" "}
          </div>
          {worker.documents &&
            worker.documents.map((document, index) => (
              <div
                key={index}
                className="mb-2 flex align-content-center justify-content-between border-1 border-round border-400 p-4"
              >
                <Dialog
                  header="Document Preview"
                  maximizable
                  visible={dialogVisible}
                  className="w-5 h-screen"
                  onHide={() => setDialogVisible(false)}
                >
                  <div className="flex w-full relative flex flex-column">
                    {/* Check how many urls are there in selectedDocUrl, then renders the image*/}
                    {selectedDocUrl &&
                      selectedDocUrl.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt=""
                          className="w-full border-round border-solid border-1 mb-2"
                        />
                      ))}

                    {/* Cover to prevent right clicking */}
                    <div className="absolute top-0 bottom-0 left-0 right-0 "></div>
                  </div>
                </Dialog>
                <div>
                  <i
                    className="pi pi-paperclip mr-3"
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  <span className="font-semibold">
                    {document.type.toUpperCase()}
                  </span>
                  {/* <span>{document.status}</span> */}
                </div>
                {document.fileUrl && (
                  <a
                    // href={document.fileUrl}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(document.fileUrl);
                      setSelectedDocUrl(document.fileUrl); // stores an array of URLs
                      setDialogVisible(true);
                    }}
                  >
                    View Document
                    <i className="pi pi-arrow-up-right mx-3 text-base"></i>
                  </a>
                )}
              </div>
            ))}
        </div>

        {/* REVIEWS PART */}
        <div>
          <div className="flex items-center mb-4 gap-2">
            <h2 className="text-lg font-bold whitespace-nowrap m-0 ">
              Latest Reviews
            </h2>
            <Divider layout="horizontal" className="w-full" />{" "}
          </div>
          {worker.reviews && worker.reviews.length > 0 ? (
            worker.reviews.map((review, index) => (
              <div key={index} className="mb-2 flex flex-column gap-2">
                <div>
                  <div className="flex gap-2">
                    <h5 className="text-base m-0">
                      {review.employer.first_name +
                        " " +
                        review.employer.last_name}
                    </h5>
                    <p className="text-sm ">
                      {displaySimpleDate(review.created_at)}
                    </p>
                  </div>
                  <Rating
                    value={review.rating}
                    readOnly
                    cancel={false}
                    pt={{
                      onIcon: {
                        className: "text-orange-400",
                        style: { width: "1rem", height: "1rem" },
                      },
                      offIcon: {
                        style: { width: "1rem", height: "1rem" },
                      },
                    }}
                  />
                </div>
                <p className="text-base text-gray-800">{review.comments}</p>
                <div className="divider w-4 border-1 border-solid border-gray-300"></div>
              </div>
            ))
          ) : (
            <div className="flex gap-2 justify-center items-center">
              <i className="pi pi-comments text-xl "></i>
              <p className="text-lg m-0"> No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default DialogFormat;
