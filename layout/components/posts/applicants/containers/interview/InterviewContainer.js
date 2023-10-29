import { Calendar } from "primereact/calendar";
import { Rating } from "primereact/rating";
import { useState, useRef } from "react";
import DateConverter from "@/lib/dateConverter";
import * as dayjs from "dayjs";
import Link from "next/link";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import styles from "./InterviewContainer.module.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { VirtualScroller } from "primereact/virtualscroller";
import { classNames } from "primereact/utils";

export default function InterviewContainer({ applicants, distances }) {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [candidateForInterview, setCandidateForInterview] = useState(null);

  const [scheduleIntVisible, setScheduleIntVisible] = useState(false);

  const dateConverter = DateConverter();
  const op = useRef(null);

  const handleDateChange = (event) => {
    setInterviewDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setInterviewTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle form submission
  };

  const getMinimumDate = () => {
    // Calculate the minimum date (today)
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    return minDate;
  };

  const dateTemplate = (date) => {
    if (date.selectable === false) {
      return <span style={{ textDecoration: "line-through" }}>{date.day}</span>;
    }

    return date.day;
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-column gap-y-2">
        <Button
          // label="Schedule an Interview"
          icon="pi pi-calendar-plus"
          size="small"
          className="w-full"
          onClick={(e) => op.current.toggle(e)}
        />
      </div>
    );
  };

  const profileTemplate = (rowData) => {
    return (
      <div className="flex items-center">
        <img
          className="h-10 flex-none rounded-full bg-gray-50 mr-4"
          src={rowData.information.profile_url}
          alt=""
        />
        <div className="min-w-0 flex-auto flex flex-column">
          <span className="flex">
            <p className="m-0 mr-2 text-sm font-semibold leading-6 text-gray-900">
              {rowData.information.first_name +
                " " +
                rowData.information.last_name}
            </p>
          </span>
          <span className="truncate text-xs leading-5 text-gray-500 align-middle">
            {rowData.information.email}
          </span>
        </div>
      </div>
    );
  };

  const activeStatusTemplate = (rowData) => {
    return (
      <div class="mt-1 flex items-center gap-x-1.5">
        <div class="flex-none rounded-full bg-emerald-500/20 p-1">
          <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
        </div>
        <p class="text-xs leading-5 text-gray-500">Online</p>
      </div>
    );
  };

  const selectionToInterviewTemplate = (applicant, options) => {
    const className = classNames("flex align-items-center p-2 ", {
      //   "surface-hover": options.odd,
      "bg-gray-300":
        applicant.information.email ===
        candidateForInterview?.information.email,
    });

    return (
      <div
        index={options.index}
        className={className + " cursor-pointer hover:bg-gray-300"}
        onClick={() => setCandidateForInterview(applicant)}
      >
        <img
          className="h-7 flex-none rounded-full bg-gray-50 mr-2"
          src={applicant.information.profile_url}
          alt=""
        />
        {applicant.information.first_name +
          " " +
          applicant.information.last_name}
      </div>
    );
  };

  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No applicants yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-primary-100 flex items-center justify-between p-2 pl-3 rounded-md mb-3">
        <p className=" text-lg font-bold m-0">
          <i className="pi pi-check-square mr-3 text-green-700"></i>
          ALL INTERVIEWS COMPLETED!
        </p>
        <Button
          label="Move to Offer Stage"
          size="small"
          className="align-middle"
          icon="pi pi-chevron-right"
          iconPos="right"
          // disabled
          // onClick={handleMoveToNextTab}
        />
      </div>
      <div className="flex gap-x-5">
        <div className="flex-grow divide-y-2">
          <div className="">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              Upcoming Interviews (5)
            </p>
            <ul role="list" className="divide-y divide-gray-100">
              {/* map every applicants in applicants */}
              {applicants.map((applicant, index) => {
                return (
                  <li
                    key={applicant.information.email}
                    className={`rounded-md flex justify-between gap-x-6 py-5 px-2 cursor-pointer `}
                    //   onClick={onOpen}
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        className="h-12 flex-none rounded-full bg-gray-50"
                        src={applicant.information.profile_url}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <span className="flex">
                          <p className="m-0 mr-2 text-base font-semibold leading-6 text-gray-900">
                            {applicant.information.first_name +
                              " " +
                              applicant.information.last_name}
                          </p>
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-1 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                            Unverified
                          </span>
                        </span>

                        <p className="mt-1 truncate text-sm leading-5 text-gray-500 align-middle">
                          <span>
                            <i className="pi pi-calendar pr-2"></i>
                          </span>
                          {dayjs(applicant.application_date).format(
                            "MMMM D, YYYY [at] h:mm A"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-right">
                      <div className="flex justify-between w-full items-center">
                        <div>
                          <p className="m-0 text-sm leading-6 text-gray-900">
                            <Link href={"https://meet.google.com/ywb-jumg-dtr"}>
                              https://meet.google.com/ywb-jumg-dtr
                            </Link>
                          </p>

                          <div className="mt-1 flex items-center justify-end gap-x-1.5">
                            <i className="pi pi-link"></i>
                            <p className="text-xs leading-5 text-gray-600">
                              Google Meet
                            </p>
                          </div>
                        </div>

                        <i className="pi pi-chevron-right m-2 ml-3 text-xs"></i>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold leading-6 text-gray-900 mb-3">
                Awaiting Schedule (5)
              </p>
            </div>
            <DataTable value={applicants}>
              <Column body={profileTemplate} header="Profile"></Column>
              <Column
                field="information.availability"
                header="Availability"
              ></Column>
              <Column body={activeStatusTemplate} header="Status"></Column>
              <Column body={actionTemplate} header="Action"></Column>
            </DataTable>
          </div>
        </div>
        <div className="flex flex-column gap-y-4">
          <div className={` ${styles.calendarWrapper}`}>
            <Calendar
              value={interviewDate}
              onChange={handleDateChange}
              inline
              dateFormat=""
              dateTemplate={dateTemplate} // TODO
              className="border-0"
              minDate={getMinimumDate()}
              pt={{
                day: { className: "p-1 border-1" },
                panel: { className: "border-0" },
                header: { className: "border-0" },
              }}
            />
          </div>
          <Button
            label="Schedule an Interview"
            // icon="pi pi-calendar-plus"
            size="small"
            className="w-full"
            // onClick={(e) => op.current.toggle(e)}
            onClick={() => setScheduleIntVisible(true)}
          />
          <Dialog
            header="Set an Interview"
            visible={scheduleIntVisible}
            onHide={() => setScheduleIntVisible(false)}
            draggable={false}
            resizable={false}
            position="bottom-right"
          >
            <div className="flex flex-column gap-y-4 px-4">
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Date
                </label>
                <Calendar
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.value)}
                  dateFormat="MM dd, yy"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Time
                </label>
                <Calendar
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.value)}
                  timeOnly
                  hourFormat="12"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold leading-6 text-gray-900">
                    Interview Link
                  </label>
                  <a
                    target="_blank"
                    href="https://meet.google.com/"
                    rel="noopener noreferrer"
                  >
                    <i className="pi pi-video" />
                  </a>
                </div>
                <span className="p-input-icon-left">
                  <i className="pi pi-link" />
                  <InputText placeholder="" />
                </span>
              </div>
              <div className="">
                <label className="text-sm font-semibold leading-6 text-gray-900 mb-6">
                  Select Applicant
                </label>
                <div className="mt-2">
                  <VirtualScroller
                    items={applicants}
                    itemSize={applicants.length}
                    itemTemplate={selectionToInterviewTemplate}
                    className="border-1 surface-border border-round w-full h-40"
                    //   style={{ width: "200px", height: "200px" }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  label="Schedule"
                  // icon="pi pi-calendar-plus"
                  size="small"
                  className="w-full"
                />
              </div>
            </div>
          </Dialog>
          <OverlayPanel ref={op} showCloseIcon>
            <div className="flex flex-column gap-y-4">
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Date
                </label>
                <Calendar
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.value)}
                  dateFormat="MM dd, yy"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <label className="text-sm font-semibold leading-6 text-gray-900">
                  Interview Time
                </label>
                <Calendar
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.value)}
                  timeOnly
                  hourFormat="12"
                />
              </div>
              <div className="flex flex-column gap-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold leading-6 text-gray-900">
                    Interview Link
                  </label>
                  <a
                    target="_blank"
                    href="https://meet.google.com/"
                    rel="noopener noreferrer"
                  >
                    <i className="pi pi-video" />
                  </a>
                </div>
                <span className="p-input-icon-left">
                  <i className="pi pi-link" />
                  <InputText placeholder="" />
                </span>
              </div>
              <div className="flex justify-end">
                <Button
                  label="Schedule"
                  // icon="pi pi-calendar-plus"
                  size="small"
                  className="w-full"
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
      </div>
    </div>
  );
}
