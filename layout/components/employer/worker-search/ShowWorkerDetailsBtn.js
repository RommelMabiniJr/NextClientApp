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
        <div className="grid">
          <div className="col-5">
            <center>
              {/* <img src={`/layout/profile-default.png`} alt="defaultProfile" style={{ width: '10vw', height: 'auto' }} /> */}
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
                <label className="text-base">₱ {worker.hourly_rate} / hr</label>
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
                {/* <Button style={{ marginTop: '1vh', width: '13vw' }} label="View Full Details" rounded /> */}
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
      </Dialog>
    </>
  );
};

export default ShowWorkerDetailsBtn;
