import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import DateConverter from "@/lib/dateConverter";
import FormatHelper from "@/lib/formatHelper";
import AvailabilityInfo from "@/layout/components/employer/worker-search/AvailabilityInfo";

const ShowWorkerDetailsBtn = ({ worker, getDistance }) => {
  const [visible, setVisible] = useState(false);
  const dateConverter = DateConverter();
  const availability = {
    Monday: true,
    Tuesday: false,
    Wednesday: true,
    Thursday: true,
    Friday: false,
    Saturday: false,
    Sunday: true,
  };

  worker.documents = [
    {
      type: "Resume",
      status: "Approved",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      type: "Barangay Clearance",
      status: "Not Submitted",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  const formatHelper = FormatHelper();
  const languagesString = formatHelper.convertArrayToString(worker.languages);
  const servicesString = formatHelper.convertArrayToString(
    worker.services,
    "service_name"
  );

  return (
    <>
      <Button
        label="View Profile"
        className="p-button-sm p-button-secondary"
        onClick={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        className="w-full md:w-8 border-solid border-1 border-black-alpha-90"
        onHide={() => setVisible(false)}
      >
        <div>
          <div className="grid">
            <div className="col-5">
              <center>
                <Avatar
                  image={worker.profile_url || "/layout/profile-default.png"}
                  alt="profile"
                  shape="circle"
                  className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
                />
                <div className="flex flex-column align-items-center">
                  <h1 className="my-2">
                    {worker.first_name + " " + worker.last_name}
                  </h1>
                  <div className="flex align-items-center mb-2">
                    <Rating value={0} readOnly cancel={false} />
                    {/* <h3 style={{ paddingLeft: '1vw' }}>34</h3> */}
                  </div>
                  <label className="text-base">
                    ₱ {worker.hourly_rate} / hr
                  </label>
                  <label className="block mb-2">
                    <i className="pi pi-map-marker" />{" "}
                    {getDistance(worker.city_municipality)} Kilometers -{" "}
                    {worker.city_municipality}
                  </label>
                </div>
                <div className="btn-action-container">
                  <Button
                    className="p-mt-2 p-w-13"
                    outlined
                    label="Hire Nanny"
                    rounded
                  />
                </div>
              </center>
            </div>
            <div className="col">
              <div className="flex flex-column md:flex-row flex-wrap">
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-book" /> Languages Spoken
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {" "}
                    {languagesString}
                  </label>
                </div>
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-check-circle" /> Services Offered
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {" "}
                    {servicesString}
                  </label>
                </div>
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-briefcase" /> Experiences
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {/* Experience 1 <br />
                                    Experience 2 */}
                    {worker.work_experience}
                  </label>
                </div>
                <div style={{ flexBasis: "50%" }}>
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

              <label style={{ fontWeight: "bold" }}>
                <i className="pi pi-megaphone" /> Bio
              </label>
              <label style={{ display: "block", paddingBottom: "2vh" }}>
                {worker.bio}
              </label>
            </div>
          </div>
          {/* DOCUMENTS PART SUCH AS RESUME, BRGY CLEARANCE, ETC. */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            {worker.documents.map((document, index) => (
              <div
                key={index}
                className="mb-2 flex align-content-center justify-content-between border-1 border-round border-400 p-4"
              >
                <div>
                  <i
                    className="pi pi-file mr-3"
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  <span className="font-semibold">{document.type}: </span>
                  <span>{document.status}</span>
                </div>
                {document.fileUrl && (
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500"
                  >
                    View Document
                    <i className="pi pi-arrow-up-right ml-3 text-base"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ShowWorkerDetailsBtn;
