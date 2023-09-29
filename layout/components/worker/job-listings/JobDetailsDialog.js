import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import DateConverter from "@/lib/dateConverter";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const JobDetailsDialog = ({
  workerUUID,
  job,
  distances,
  getDistance,
  onApply,
}) => {
  const [visible, setVisible] = useState(false);
  const dateConverter = DateConverter();
  const router = useRouter();
  const postingDateReadable = dateConverter.convertDateToReadable(
    job.job_posting_date
  );
  const startDateReadable = dateConverter.convertDateToReadableDetailed(
    job.job_start_date
  );
  const endDateReadable = dateConverter.convertDateToReadableDetailed(
    job.job_end_date
  );
  const startTimeReadable = dateConverter.convertTimeToReadable(
    job.job_start_time
  );
  const endTimeReadable = dateConverter.convertTimeToReadable(job.job_end_time);

  const header = (
    <div className="flex justify-content-between">
      <h5 className="font-bold">{job.job_title}</h5>
      <span className="font-medium text-sm text-600 py-1 pr-3">
        Posted on: <span className="">{postingDateReadable}</span>
      </span>
    </div>
  );

  const confirmApplication = async (applyDetails) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    try {
      const response = await axios.post(
        `${serverUrl}/worker/application`,
        applyDetails
      );

      console.log(applyDetails);
      // onApply(applyDetails);

      return response.data; // Return response or handle as needed
    } catch (error) {
      console.error("Error confirming application: ", error);
    }
  };

  useEffect(() => {
    // Check if the dialog has been closed
    if (!visible) {
      // Refresh the page when the dialog is closed
      router.replace(router.asPath, undefined, { scroll: false });
    }
  }, [visible]);

  return (
    <>
      <Button
        label="Apply"
        className="flex-grow-1 md:flex-grow-0 p-button-sm p-button-primary"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header={header}
        className="w-full md:w-8 border-solid border-1 border-black-alpha-90"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <div className="grid">
          <div className="col-3">
            <center>
              <Avatar
                image={job.profile_url || "/layout/profile-default.png"}
                alt="profile"
                shape="circle"
                className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
              />
              <label className="block mt-2 text-xl font-medium">
                {job.first_name}
              </label>
              <label className="block">
                <i className="pi pi-map-marker" /> {job.city_municipality}
              </label>
              <label className="block">
                {getDistance(job.city_municipality, distances)} Kilometers
              </label>
              <div className="flex mt-2 w-full flex-wrap justify-content-center">
                <Tag
                  severity="primary"
                  className="block mb-1"
                  icon="pi pi-check-square"
                  value="Eco-conscious"
                />
                <Tag
                  severity="success"
                  className="block mb-1"
                  icon="pi pi-check-square"
                  value="LGBTQ-friendly"
                />
                <Tag
                  severity="warning"
                  className="block mb-1"
                  icon="pi pi-check-square"
                  value="Family-oriented"
                />
              </div>
            </center>
          </div>
          <div className="col">
            <div className="flex w-full flex-wrap">
              <div className="flex pt-1">
                <span className="font-medium">Looking For: </span>
                <Tag
                  className="ml-2"
                  icon="pi pi-tag"
                  value={job.services[0].service_name}
                />
              </div>
              <div className="flex pt-1">
                <span className="font-medium pl-2">Job Type: </span>
                <Tag className="ml-2" icon="pi pi-clock" value={job.job_type} />
              </div>
              <label className="pt-3 w-full font-medium text-lg">
                <i className="pi pi-book" /> Description
              </label>
              <label className="text-justify mr-3">{job.job_description}</label>
              <label className="pt-4 font-medium text-lg">
                <i className="pi pi-calendar-plus" /> Living Arrangement
              </label>
              <label className="w-full">
                <span className="mr-2">{job.living_arrangement}</span>
              </label>
              <label className="pt-4 font-medium text-lg">
                <i className="pi pi-calendar-plus" /> Work Schedule
              </label>
              <label className="w-full">
                <span className="mr-2">Start:</span> {startDateReadable} |{" "}
                {startTimeReadable}
              </label>
              <label className="w-full">
                <span className="mr-2">End:</span> {endDateReadable} |{" "}
                {endTimeReadable}
              </label>
              <label className="pt-4 font-medium text-lg">
                <i className="pi pi-id-card" /> Application Requirements
              </label>
              <label className="w-full">Barangay Clearance</label>
              <label className="w-full">Social Security System (SSS)</label>
              <label className="w-full">Government-Issued ID</label>
              <label className="w-full">PhilHealth Membership</label>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-content-end">
          <Button
            label="Confirm Application"
            onClick={async () => {
              console.log(job);
              const confirmationResult = await confirmApplication({
                workerUUID,
                jobId: job.job_id,
              });

              onApply({ post: job });

              setVisible(false);
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default JobDetailsDialog;
