import { capitalizeFirstLetter } from "@/layout/components/utils/letterCasingUtils";
import { formatSalary } from "@/layout/components/utils/moneyFormatUtils";
import { BookingService } from "@/layout/service/BookingService";
import dayjs from "dayjs";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useRef } from "react";

const BookingExtensionTable = ({
  booking,
  bookingExtensions,
  onRefetchData,
}) => {
  const toast = useRef(null);

  const handleDeleteExtension = async (extensionId) => {
    const success = await BookingService.deleteExtensionRequest(
      booking.booking_id,
      extensionId
    );

    if (success) {
      await onRefetchData();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Extension request deleted",
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  const confirmDelete = (event, extensionId) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Confirm delete of this extension?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary p-button-text",
      accept: () => handleDeleteExtension(extensionId),
    });
  };

  return (
    <>
      {bookingExtensions.length > 0 && (
        <div className="my-4">
          <p className="font-bold mb-2">Booking Extensions</p>
          <div className="gap-8">
            <Toast ref={toast} />
            <ConfirmPopup />
            <DataTable value={bookingExtensions}>
              <Column
                field="extended_start_date"
                header="Start & End Dates"
                headerClassName="font-medium"
                body={(rowData) => (
                  <span className="flex items-center">
                    <div className="my-1.5">
                      <p className="m-0">
                        {dayjs(rowData.extended_start_date).format(
                          "MMM D, YYYY"
                        )}{" "}
                        -{" "}
                        {dayjs(rowData.extended_end_date).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </span>
                )}
              ></Column>

              <Column
                field="extended_salary"
                header="Salary"
                headerClassName="font-medium"
                body={(rowData) => (
                  <span className="flex items-center">
                    <div className="my-1.5">
                      <p className="m-0">
                        {formatSalary(rowData.extended_salary)}
                      </p>
                    </div>
                  </span>
                )}
              ></Column>

              <Column
                field="status"
                header="Status"
                headerClassName="font-medium"
                body={(rowData) => (
                  <span className="flex items-center">
                    <div className="my-1.5">
                      <p
                        className={classNames("m-0", {
                          "text-green-400": rowData.status === "approved",
                          "text-red-400":
                            rowData.status === "rejected" ||
                            rowData.status === "expired",
                          "text-yellow-400": rowData.status === "pending",
                        })}
                      >
                        {capitalizeFirstLetter(rowData.status)}
                      </p>
                    </div>
                  </span>
                )}
              ></Column>
              <Column
                field="actions"
                header="Actions"
                headerClassName="font-medium"
                body={(rowData) => (
                  <div className="flex gap-2">
                    {rowData.status === "pending" && (
                      <Button
                        size="small"
                        // label="Cancel"
                        icon="pi pi-times"
                        outlined
                        severity="danger"
                        tooltip="Cancel Extension"
                        onClick={(e) => confirmDelete(e, rowData.extension_id)}
                      />
                    )}
                    {(rowData.status === "rejected" ||
                      rowData.status === "expired") && (
                      <Button
                        size="small"
                        // label="Delete"
                        icon="pi pi-trash"
                        outlined
                        severity="danger"
                        tooltip="Delete Extension"
                        onClick={(e) => confirmDelete(e, rowData.extension_id)}
                      />
                    )}
                    {rowData.status === "approved" && (
                      <Button
                        size="small"
                        // label="Cancel"
                        outlined
                        icon="pi pi-times"
                        severity="danger"
                        tooltip="Cancel Extension"
                        onClick={(e) => confirmDelete(e, rowData.extension_id)}
                        // Disable when an extension is approved and the end date passed
                        disabled={dayjs(rowData.extended_end_date).isBefore(
                          dayjs()
                        )}
                      />
                    )}
                  </div>
                )}
              ></Column>
            </DataTable>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingExtensionTable;
