import React, { useState } from "react";
import { Dialog } from "primereact/dialog";

const DocumentPreview = ({ selectedDocUrl, onClose }) => {
  const [dialogVisible, setDialogVisible] = useState(true);

  return (
    <Dialog
      header="Document Preview"
      maximizable
      visible={dialogVisible}
      className="w-5 h-screen"
      onHide={() => {
        setDialogVisible(false);
        onClose();
      }}
    >
      <div className="flex w-full relative flex flex-column">
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
  );
};

export default DocumentPreview;
