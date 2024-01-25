import React, { use, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import styles from "./Information.module.css";

const DocumentsInformation = ({ documents, session }) => {
  const [docs, setDocs] = useState(documents);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDocToUpload, setSelectedDocToUpload] = useState(null);
  const [selectedDocUrl, setSelectedDocUrl] = useState([]); // An array of URLs
  const [dialogVisible, setDialogVisible] = useState(false);
  const [docUploadVisible, setDocUploadVisible] = useState(false);

  const [filteredDocOptions, setFilteredDocOptions] = useState([]); // An array of URLs

  const docOptions = [
    { label: "NBI Clearance", value: "nbi clearance" },
    { label: "Barangay Clearance", value: "barangay clearance" },
    { label: "Police Clearance", value: "police clearance" },
    { label: "Resume", value: "resume" },
  ];

  const handleDocumentChange = (event) => {
    setSelectedDocToUpload(event.files[0]);
  };

  const handleDocumentUpload = () => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the selected file to the FormData object
    formData.append("pdfDocument", selectedDocToUpload);
    formData.append("type", selectedType);

    console.log(formData);

    // Make a POST request to upload the file
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/document/upload/${session.user.uuid}`,
        formData
      )
      .then((response) => {
        // Update the documents state with the new document
        setDocs([...docs, response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFileDelete = (documentId) => {
    const formData = new FormData();
    formData.append("uuid", session.user.uuid);

    // Make a DELETE request to delete the document
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/document/delete/${documentId}`
      )
      .then(() => {
        // Update the documents state by filtering out the deleted document
        setDocs(docs.filter((document) => document.document_id !== documentId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const confirmDelete = (e, documentId) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // Delete the document
        handleFileDelete(documentId);
      },
      reject: () => {
        // Do nothing
      },
    });
  };

  useEffect(() => {
    try {
      const fetchDocuments = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/documents/${session.user.uuid}`
        );
        setDocs(response.data);
      };

      fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // Filter Document Options

    if (!docs) {
      return;
    }

    // Filter out the document types that are already in the docs array
    const options = docOptions.filter((doc) => {
      // Check if the document type is in the docs array
      const docType = docs.find((document) => document.type === doc.value);

      // If the document type is in the docs array, then filter it out
      if (docType) {
        return false;
      }

      // If the document type is not in the docs array, then return true
      return true;
    });

    console.log(options);

    // Update the filteredDocOptions state
    setFilteredDocOptions(options);
  }, [docs]);

  if (!session) {
    return <div>loading...</div>;
  }

  const emptyTemplate = () => {
    return (
      <div className="w-full py-3 cursor-copy">
        <div className="h-full flex flex-column justify-content-center align-items-center">
          <i className="pi pi-upload text-900 text-2xl mb-3"></i>
          <span className="font-bold text-900 text-xl mb-3">Upload Files</span>
          <span className="font-medium text-600 text-md text-center">
            Drop or select files
          </span>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <span className="flex flex-column text-left ml-3 ">
            {file.name}
            <span className="flex align-items-center">
              <small className="mr-2">{props.formatSize}</small>
              <Tag value="pending" severity="warning" />
            </span>
          </span>
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => {
            props.onRemove(file);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {console.log(filteredDocOptions)}
      <div className="px-4 my-4">
        <Dialog
          header="Document Upload"
          className="w-5 h-screen"
          visible={docUploadVisible}
          onHide={() => setDocUploadVisible(false)}
        >
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="documentType" className="mb-2 font-medium text-lg">
              Document Type
            </label>
            <Dropdown
              id="documentType"
              value={selectedType}
              options={filteredDocOptions}
              placeholder="Select Document Type"
              onChange={(e) => setSelectedType(e.value)}
              optionLabel="label"
              className="w-full"
            />
          </div>
          <div className="flex flex-col mb-4 w-full">
            <label htmlFor="fileUpload" className="mb-2 font-medium text-lg">
              Upload File
            </label>
            <FileUpload
              id="fileUpload"
              chooseLabel="Select"
              uploadLabel="Upload"
              cancelLabel="Cancel"
              accept=".pdf"
              //   maxFileSize={1000000}
              emptyTemplate={emptyTemplate}
              itemTemplate={itemTemplate}
              onSelect={handleDocumentChange}
              customUpload
              uploadHandler={handleDocumentUpload}
              className="w-full"
            />
          </div>
        </Dialog>
      </div>
      <div className="px-4 grid w-full">
        <div className="col-12 flex items-center w-full gap-3 mb-4">
          <h2 className="text-xl font-semibold m-0">Uploaded Documents</h2>
          <div>
            <Button
              size="small"
              rounded
              outlined
              className="flex-1"
              icon="pi pi-plus"
              onClick={() => setDocUploadVisible(true)}
              pt={{
                root: {
                  className: "p-0 h-2rem w-2rem",
                },
                icon: {
                  className: "text-xs",
                },
              }}
            />
          </div>
        </div>

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

            {/* <object
              width="100%"
              height="100%"
              type="application/pdf"
              data={
                selectedDocUrl + "#zoom=55&scrollbar=0&toolbar=0&navpanes=0"
              }
            ></object> */}

            {/* Cover to prevent right clicking */}
            <div className="absolute top-0 bottom-0 left-0 right-0 "></div>
          </div>
        </Dialog>

        {docs &&
          docs.map((document, index) => (
            <div key={index} className="col-6">
              <div className="border-1 border-round border-400 p-4 flex align-content-center justify-content-between ">
                <div>
                  <i
                    className="pi pi-file mr-3"
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                  <span className="font-semibold">
                    {/* Capitalize each letter */}
                    {document.type.toUpperCase()}:{" "}
                  </span>
                  <span>{document.status}</span>
                </div>
                <ConfirmPopup />
                <div>
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

                  <i
                    onClick={(e) => confirmDelete(e, document.document_id)}
                    className={
                      "pi pi-trash text-red-600 " + styles.deleteConfirm
                    }
                  ></i>
                </div>
              </div>
            </div>
          ))}

        {/* Compare docOptions to docs, if docOptions is not in docs, then render the docOptions */}
      </div>
    </div>
  );
};

export default DocumentsInformation;
