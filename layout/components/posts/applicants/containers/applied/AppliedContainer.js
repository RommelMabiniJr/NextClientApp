import { Button } from "primereact/button";
import AppliedLists from "@/layout/components/posts/applicants/containers/applied/subcomp/AppliedLists";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function AppliedContainer({ applicants, distances }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Total Applied: {applicants.length}</span>
      </div>
      <AppliedLists applicants={applicants} distances={distances} />
    </div>
  );
}
