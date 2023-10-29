import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import Link from "next/link";
import Router from "next/router";
import DeletePopup from "@/layout/components/posts/show/subcomp/DeletePopup";

export default function ShowPostButton({ post }) {
  const [visible, setVisible] = useState(false);
  const [displayDelConfirm, setDisplayDelConfirm] = useState(false); // for delete confirm
  const toast = useRef(null);

  const footerContent = (
    <div>
      {/* Component for delete confirm */}
      <DeletePopup
        post={post}
        displayDelConfirm={displayDelConfirm}
        setDisplayDelConfirm={setDisplayDelConfirm}
      />
      <Button
        label="Delete"
        severity="danger"
        icon="pi pi-times"
        onClick={() => setDisplayDelConfirm(true)}
        className="p-button-danger p-button-outlined"
      />
      <Button
        label="Edit"
        icon="pi pi-pencil"
        onClick={() =>
          Router.push({
            pathname: "/app/posts/edit",
            query: { edit: true, post: JSON.stringify(post) },
          })
        }
        autoFocus
      />
    </div>
  );

  return (
    <div className="flex-grow-1">
      <Button
        className="w-full"
        label="View Details"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
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
          <h5 className="m-0">{post.job_title}</h5>
          {/* <div className="d-flex align-items-center">
                        <span className="p-mr-2">{post.job_type}</span>
                        <span className="p-mr-2">{post.job_status}</span>
                    </div> */}
          <div className="mt-3 flex justify-content-between">
            <div className="">
              <span className="text-sm font-medium mr-1">Job type: </span>
              <Tag value={post.job_type} severity="info" className="p-mr-2" />
            </div>
            <p className="text-300"> | </p>
            <div>
              <span className="text-sm font-medium mr-1">Service: </span>
              <Tag value={post.service_name} severity="warning" />
            </div>
            <p className="text-300"> | </p>
            <div>
              <span className="text-sm font-medium mr-1">Job Status: </span>
              <Tag value={post.job_status} severity="success" />
            </div>
          </div>
        </div>
        <p className="my-4">{post.job_description}</p>
        <div className="d-flex justify-content-between">
          <div className="grid">
            <div className="col-6 mb-2">
              <strong>Start Date:</strong>{" "}
              {console.log("DISPLAY:" + post.job_title, post.job_start_date)}
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
            <strong>Living Arrangement:</strong> {post.living_arrangement}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
