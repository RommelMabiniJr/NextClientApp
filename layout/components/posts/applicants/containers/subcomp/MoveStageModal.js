import React, { useState, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

export default function MoveStageModal({
  visible,
  setVisible,
  stages,
  currentStage,
  currentStageIndex,
  handleMoveStage,
}) {
  const moveToast = useRef(null);

  if (currentStageIndex == 5) {
    return null;
  }

  const accept = () => {
    handleMoveStage();
    moveToast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Moved to next stage",
      life: 3000,
    });
    setVisible(false);
  };

  const reject = () => {};

  const headerTemplate = (
    <div className="flex flex-column align-items-center gap-2">
      <h5 className="m-0 font-bold text-2xl">Move to Next Stage</h5>
      <p className="font-normal text-sm">
        Are you sure you want to move this posting to the next stage?
      </p>
    </div>
  );

  // show the current stage and the stage to move to
  const messageTemplate = () => {
    const nextStage = stages[currentStageIndex + 1];

    if (!nextStage) {
      return null; // Handle the case where nextStage is undefined
    }

    return (
      <div className="flex justify-center gap-2 w-full">
        <div className="flex flex-1 divide-y flex-col items-center gap-1">
          <span className="font-medium text-3xl text-secondary text-right">
            {currentStage.toUpperCase()}
          </span>
          {/* <span className="font-bold text-sm">From</span> */}
        </div>
        <span className="mt-1.5">
          <i className="pi pi-arrow-right" />
        </span>
        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="font-medium text-3xl text-primary">
            {nextStage.toUpperCase()}
          </span>
          {/* <span className="font-bold text-sm">To</span> */}
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={moveToast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={headerTemplate}
        message={messageTemplate}
        className="w-screen lg:w-30rem"
        accept={accept}
        reject={reject}
        pt={{
          headerIcons: {
            className: "hidden",
          },
          message: {
            className: "w-full mx-3",
          },
        }}
      />
    </>
  );
}
