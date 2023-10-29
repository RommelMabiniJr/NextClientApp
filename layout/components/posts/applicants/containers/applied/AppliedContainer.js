import { Button } from "primereact/button";
import AppliedLists from "@/layout/components/posts/applicants/containers/applied/subcomp/AppliedLists";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function AppliedContainer({
  applicants,
  distances,
  setActiveIndex,
}) {
  const handleConfirmScreening = (position) => {
    const accept = () => {
      setActiveIndex(1);
      console.log("Screening started");
    };

    const reject = () => {};

    confirmDialog({
      message: (
        <div className="">
          Are you sure you want to continue with the screening process?
          <span className="block text-sm text-gray-600">
            This will close the application and you will no longer receive new
            applicants.
          </span>
        </div>
      ),
      // "Are you sure you want to continue with the screening process? This will close the application and you will no longer receive new applicants.",
      header: "Screening Confirmation",
      icon: "pi pi-exclamation-triangle",
      position,
      accept,
      reject,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <ConfirmDialog
          contentClassName="w-3"
          pt={{ message: { className: "" } }}
        />
        <span>Total Applied: {applicants.length}</span>
        <Button
          label="Start Screening"
          icon="pi pi-arrow-right"
          iconPos="right"
          outlined
          onClick={() => handleConfirmScreening("top-right")}
        />
      </div>

      <AppliedLists applicants={applicants} distances={distances} />
    </div>
  );
}
