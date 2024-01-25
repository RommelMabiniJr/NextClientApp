import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Badge } from "primereact/badge";
// import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
// import Link from "next/link";
import Router from "next/router";
import DeletePopup from "@/layout/components/posts/show/subcomp/DeletePopup";
import { JobPostService } from "@/layout/service/JobPostService";
import axios from "axios";

export default function ShowPostButton({ post, isModifiable = true }) {
  const [visible, setVisible] = useState(false);
  const [displayDelConfirm, setDisplayDelConfirm] = useState(false); // for delete confirm
  const [applicants, setApplicants] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      const fetchedApplicants = await JobPostService.getApplicants(post.job_id);
      console.log("FETCHED APPLICANTS: ", fetchedApplicants);
      setApplicants(fetchedApplicants);
    };
    fetchApplicants();
  }, [post]);

  const footerContent = (
    <div className="flex">
      {/* Component for delete confirm */}
      <div className="flex items-center">
        <label className="mr-2 text-large font-bold">APPLICANTS:</label>
        <AvatarGroup>
          {/* If more than 4, show 4 and +{applicants.length - 4} */}
          {applicants.slice(0, 4).map((applicant) => (
            <Avatar
              key={applicant.application_id}
              image={applicant.information.profile_url}
              size="normal"
              shape="circle"
              className="p-mr-2"
              tooltip={applicant.information.first_name}
              tooltipOptions={{ position: "top" }}
            />
          ))}
          {applicants.length > 4 && (
            <Avatar
              label={`+${applicants.length - 4}`}
              size="normal"
              shape="circle"
              className="p-mr-2"
            />
          )}
        </AvatarGroup>
      </div>
      <div className="flex-grow-1">
        <Button
          label="MANAGE APPLICATIONS"
          // icon="pi pi-angle-double-right"
          iconPos="right"
          className="p-button-secondary p-button-outlined flex-1 "
          onClick={() =>
            Router.push({
              pathname: `/app/posts/applicants/${post.job_id}`,
            })
          }
          disabled={!isModifiable}
        />
      </div>
    </div>
  );

  return (
    <div className="flex-grow-1 mb-2">
      <Button
        className="w-full"
        label="View Details"
        // icon="pi pi-external-link"
        onClick={() => setVisible(true)}
        text
      />
      <Dialog
        header="Job Details"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <Toast ref={toast} />
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex justify-between items-center">
            <h5 className="m-0">{post.job_title}</h5>
            <div>
              {/* Component for delete confirm */}
              <DeletePopup
                post={post}
                displayDelConfirm={displayDelConfirm}
                setDisplayDelConfirm={setDisplayDelConfirm}
              />
              <Button
                // label="Edit"
                text
                size="small"
                icon="pi pi-pencil"
                tooltip="Edit Job Post"
                disabled={!isModifiable}
                onClick={() =>
                  Router.push({
                    pathname: "/app/posts/edit",
                    query: { edit: true, post: JSON.stringify(post) },
                  })
                }
              />
              <Button
                // label="Delete"
                text
                size="small"
                severity="danger"
                icon="pi pi-trash"
                disabled={!isModifiable}
                onClick={() => setDisplayDelConfirm(true)}
                className="p-button-danger p-button-outlined"
                tooltip="Delete Job Post"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-content-between">
            <div className="">
              <span className="text-sm font-medium mr-1">Job type: </span>
              <Tag value={post.job_type} severity="info" className="p-mr-2" />
            </div>
            <p className="text-300 m-0"> | </p>
            <div>
              <span className="text-sm font-medium mr-1">Service: </span>
              <Tag value={post.service_name} severity="warning" />
            </div>
            <p className="text-300 m-0"> | </p>
            <div>
              <span className="text-sm font-medium mr-1">Job Status: </span>
              <Tag
                value={post.job_status}
                className={`${
                  post.job_status == "open"
                    ? "p-tag-success"
                    : "bg-gray-300 text-gray-600"
                }`}
              />
            </div>
          </div>
        </div>
        <p className="my-3">{post.job_description}</p>
        <div className="d-flex justify-content-between">
          <div className="grid">
            <div className="col-6 mb-2">
              <strong>Start Date:</strong>{" "}
              {/* {console.log("DISPLAY:" + post.job_title, post.job_start_date)} */}
              {new Date(post.job_start_date).toDateString()}
            </div>
            <div className="col-6 mb-2">
              <strong>End Date:</strong>{" "}
              {new Date(post.job_end_date).toDateString()}
            </div>
          </div>
          <div className="grid">
            <div className="col-6 mb-2">
              <strong>Start Time:</strong>{" "}
              {new Date(
                `1970-01-01T${post.job_start_time}Z`
              ).toLocaleTimeString([], { timeStyle: "short" })}
            </div>
            <div className="col-6 mb-2">
              <strong>End Time:</strong>{" "}
              {new Date(`1970-01-01T${post.job_end_time}Z`).toLocaleTimeString(
                [],
                { timeStyle: "short" }
              )}
            </div>
          </div>
          <div className="col-12 mb-2 px-0">
            <strong>Salary: </strong>
            {Number(post.salary).toLocaleString("fil-PH", {
              style: "currency",
              currency: "PHP",
            })}
            {post.pay_frequency ? " " + post.pay_frequency : ""}
          </div>
          <div className="col-12 mb-2 px-0">
            <strong>Benefits :</strong>
            {console.log("BENEFITS: ", post.benefits)}
            <ul>
              {Array.isArray(post.benefits) &&
                post.benefits.length > 0 &&
                post.benefits.map((benefit, index) => (
                  <li key={index} className="list-disc ml-3">
                    {benefit}
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-12 mb-2 px-0">
            <strong>Living Arrangement:</strong> {post.living_arrangement}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
