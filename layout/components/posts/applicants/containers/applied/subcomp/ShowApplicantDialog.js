import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import DateConverter from "@/lib/dateConverter";
import FormatHelper from "@/lib/formatHelper";
import AvailabilityInfo from "@/layout/components/employer/worker-search/AvailabilityInfo";
import { LocationService } from "@/layout/service/LocationService";
import ListItem from "./AppliedListItem";
import { displaySimpleDate } from "@/layout/components/utils/dateUtils";
import DialogFormat from "@/layout/components/employer/worker-search/worker-details/DialogFormat";

const ShowApplicantDialog = ({
  applicant,
  distances,
  displayAs,
  mode,
  handleAddApplicantAsPassed,
}) => {
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState([]);
  const dateConverter = DateConverter();

  // console.log(applicant);

  const formatHelper = FormatHelper();
  const languagesString = formatHelper.convertArrayToString(
    applicant.information.languages
  );
  const servicesString = formatHelper.convertArrayToString(
    applicant.information.services,
    "service_name"
  );

  return (
    <>
      <div className="relative">
        <ListItem
          handleAddApplicantAsPassed={handleAddApplicantAsPassed}
          mode={mode}
          applicant={applicant.information}
          applicant_full={applicant}
          applicationDate={applicant.application_date}
          distances={distances}
          onOpen={() => setVisible(true)}
          displayAs={displayAs}
        />
      </div>

      <DialogFormat
        visible={visible}
        setVisible={setVisible}
        dialogVisible={documentVisible}
        setDialogVisible={setDocumentVisible}
        selectedDocUrl={selectedDocUrl}
        setSelectedDocUrl={setSelectedDocUrl}
        worker={applicant.information}
        distances={distances}
      />
    </>
  );
};

export default ShowApplicantDialog;
