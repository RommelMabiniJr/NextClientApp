import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useRef, useState } from "react";

export default function DocumentsUpload({ selectedFiles, onFileSelect }) {
  const inputRefs = {
    resume: useRef(),
    nbiClearance: useRef(),
    barangayClearance: useRef(),
    policeClearance: useRef(),
  };

  const handleRemoveFile = (documentType) => {
    onFileSelect(null, documentType);
    inputRefs[documentType].current.value = "";
  };

  const handleFileSelect = (documentType) => {
    inputRefs[documentType].current.click();
  };

  const onSelectFile = (event, documentType) => {
    const files = event.target.files;
    onFileSelect(files[0], documentType);
  };

  const renderFileInfo = (documentType) => {
    const file = selectedFiles[documentType];
    if (file) {
      return (
        <div className="">
          <span className="">{file.name}</span>
          <span>{` (${(file.size / 1024).toFixed(2)} KB)`}</span>
        </div>
      );
    }
    return null;
  };

  const renderActionButtons = (documentType) => {
    if (selectedFiles[documentType]) {
      return (
        <Button
          type="button"
          outlined
          size="small"
          icon="pi pi-times"
          className="mx-2"
          severity="danger"
          onClick={() => handleRemoveFile(documentType)}
        />
      );
    } else {
      return (
        <Button
          type="button"
          outlined
          size="small"
          icon="pi pi-upload"
          className="mx-2"
          onClick={() => handleFileSelect(documentType)}
        />
      );
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="border-1 border-round border-400 p-3 flex align-center justify-between ">
          <span className="font-semibold pt-2 pr-3 whitespace-nowrap">
            <i
              className="pi pi-paperclip mr-3"
              style={{ fontSize: "1rem" }}
            ></i>
            RESUME
          </span>
          <div className="pt-2">{renderFileInfo("resume")}</div>
          <div>
            {/* Hidden file input element */}
            <input
              ref={inputRefs.resume}
              id="resume"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onSelectFile(e, "resume")}
            />

            {renderActionButtons("resume")}
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="border-1 border-round border-400 p-3 flex align-center justify-between ">
          <span className="font-semibold pt-2 pr-3 whitespace-nowrap">
            <i
              className="pi pi-paperclip mr-3"
              style={{ fontSize: "1rem" }}
            ></i>
            NBI CLEARANCE
          </span>
          <div className="pt-2">{renderFileInfo("nbiClearance")}</div>
          <div>
            {/* Hidden file input element */}
            <input
              ref={inputRefs.nbiClearance}
              id="nbiClearance"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onSelectFile(e, "nbiClearance")}
            />

            {renderActionButtons("nbiClearance")}
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="border-1 border-round border-400 p-3 flex align-center justify-between ">
          <span className="font-semibold pt-2 pr-3 whitespace-nowrap">
            <i
              className="pi pi-paperclip mr-3 "
              style={{ fontSize: "1rem" }}
            ></i>
            BARANGAY CLEARANCE
          </span>
          <div className="pt-2">{renderFileInfo("barangayClearance")}</div>
          <div>
            {/* Hidden file input element */}
            <input
              ref={inputRefs.barangayClearance}
              id="barangayClearance"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onSelectFile(e, "barangayClearance")}
            />

            {renderActionButtons("barangayClearance")}
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="border-1 border-round border-400 p-3 flex align-center justify-between ">
          <span className="font-semibold pt-2 pr-3 whitespace-nowrap">
            <i
              className="pi pi-paperclip mr-3"
              style={{ fontSize: "1rem" }}
            ></i>
            POLICE CLEARANCE
          </span>
          <div className="pt-2">{renderFileInfo("policeClearance")}</div>
          <div>
            {/* Hidden file input element */}
            <input
              ref={inputRefs.policeClearance}
              id="policeClearance"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onSelectFile(e, "policeClearance")}
            />

            {renderActionButtons("policeClearance")}
          </div>
        </div>
      </div>
    </div>
  );
}
