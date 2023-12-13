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
import dayjs from "dayjs";
import {
  getNumReviews,
  getTotalAverageRating,
} from "@/layout/components/utils/ratingreviewutils";
import { Divider } from "primereact/divider";
import { useRouter } from "next/router";
import DialogFormat from "./DialogFormat";

const ShowWorkerDetailsBtn = ({ worker, distances }) => {
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState([]);
  const dateConverter = DateConverter();
  const router = useRouter();

  // TO BE TESTED
  // const availability = {
  //   Monday: true,
  //   Tuesday: false,
  //   Wednesday: true,
  //   Thursday: true,
  //   Friday: false,
  //   Saturday: false,
  //   Sunday: true,
  // };

  return (
    <>
      <Button
        label="View Profile"
        className="p-button-sm p-button-secondary "
        onClick={() => setVisible(true)}
      />
      <DialogFormat
        visible={visible}
        setVisible={setVisible}
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        selectedDocUrl={selectedDocUrl}
        setSelectedDocUrl={setSelectedDocUrl}
        worker={worker}
        distances={distances}
      />
    </>
  );
};

export default ShowWorkerDetailsBtn;
