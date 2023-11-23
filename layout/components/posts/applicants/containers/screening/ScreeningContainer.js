import React, { useState, useEffect, useRef } from "react";
import AppliedLists from "@/layout/components/posts/applicants/containers/applied/subcomp/AppliedLists";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { LocationService } from "@/layout/service/LocationService";
import { ScreeningService } from "@/layout/service/ScreeningService";

export default function ScreeningContainer({
  applicants,
  distances,
  setScreeningResults,
  screeningResults,
  postId,
}) {
  const toast = useRef(null);
  const op = useRef(null);

  // State for filters and sorting
  const [selectTop, setSelectTop] = useState(3);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [sortSelectBookings, setSortSelectBookings] = useState(null);
  const [sortSelectDistance, setSortSelectDistance] = useState("Nearest");
  const [sortSelectRate, setSortSelectRate] = useState(null);
  const [sortSelectStars, setSortSelectStars] = useState(null);

  const [passedApplicants, setPassedApplicants] = useState([]);
  const [applicantsPool, setApplicantsPool] = useState(applicants); // Pool of applicants to be filtered and sorted
  const [shortlistedApplicants, setShortlistedApplicants] = useState([]);
  const [activeSortOption, setActiveSortOption] = useState("Distance");
  const [isFinished, setIsFinished] = useState(false);

  const documentAvailOptions = [
    {
      name: "Resume",
      value: "resume",
    },
    {
      name: "NBI clearance",
      value: "nbi clearance",
    },
    {
      name: "Police Clearance",
      value: "police clearance",
    },
    {
      name: "Barangay Clearance",
      value: "barangay clearance",
    },
  ];

  const distanceOptions = [
    {
      value: "Nearest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Farthest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const rateOptions = [
    {
      value: "Lowest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Highest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const starsOptions = [
    {
      value: "Shortest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Longest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const bookingsOptions = [
    {
      value: "Highest",
      icon: "pi pi-sort-amount-down",
    },
    {
      value: "Lowest",
      icon: "pi pi-sort-amount-up",
    },
  ];

  const handleCheckboxChange = (name, value) => {
    // console.log(name, value);
    switch (name) {
      case "Bookings":
        setSortSelectBookings(sortSelectBookings === value ? null : value);
        setSortSelectDistance(null);
        setSortSelectRate(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Distance":
        setSortSelectDistance(sortSelectDistance === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectRate(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Rate":
        setSortSelectRate(sortSelectRate === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectDistance(null);
        setSortSelectStars(null);
        setActiveSortOption(name);
        break;
      case "Stars":
        setSortSelectStars(sortSelectStars === value ? null : value);
        setSortSelectBookings(null);
        setSortSelectDistance(null);
        setSortSelectRate(null);
        setActiveSortOption(name);
        break;
      default:
        break;
    }
  };

  const handleAddApplicantAsPassed = (applicant) => {
    // console.log("Adding qualified applicant");
    setPassedApplicants([...passedApplicants, applicant]);

    // Remove applicant from pool
    setApplicantsPool(
      applicantsPool.filter(
        (app) => app.information.email !== applicant.information.email
      )
    );
  };

  const handleRemoveApplicantFromPassed = (applicant) => {
    // console.log("Removing qualified applicant");
    setPassedApplicants(
      passedApplicants.filter(
        (app) => app.information.email !== applicant.information.email
      )
    );

    // Add applicant back to pool
    setApplicantsPool([...applicantsPool, applicant]);
  };

  const handleConfirmScreening = () => {
    // access shortlistedApplicants and base it on selectTop and save it to passedApplicants
    // Access shortlistedApplicants and selectTop
    const topApplicants = shortlistedApplicants.slice(0, selectTop);

    // Save the filtered applicants to passedApplicants
    setPassedApplicants([...passedApplicants, ...topApplicants]);

    // Remove the filtered applicants from the pool
    setApplicantsPool(
      applicantsPool.filter(
        (applicant) =>
          !topApplicants.some(
            (topApplicant) =>
              topApplicant.information.email === applicant.information.email
          )
      )
    );
  };

  const confirmSaveScreening = () => {
    confirmDialog({
      message: "Are you sure you want to save the screening results?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        handleSaveScreening(isFinished);
      },
      reject: () => {}, // Do nothing
    });
  };

  const handleSaveScreening = async (isFinished) => {
    if (isFinished) {
      // Edit
      setIsFinished(false);
    } else {
      try {
        // Structure the screening results based on passed and failed applicants
        const formattedScreeningResults = [
          ...passedApplicants.map(({ application_id }) => ({
            application_id,
            result: "passed",
          })),
          ...applicantsPool.map(({ application_id }) => ({
            application_id,
            result: "failed",
          })),
        ];

        // Save in the server
        const response = await ScreeningService.saveScreeningResults(
          postId,
          formattedScreeningResults
        );

        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Screening results saved.",
            life: 3000,
          });

          setScreeningResults(formattedScreeningResults);
          // Save
          setIsFinished(true);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to save screening results.",
            life: 3000,
          });
        }

        // Update local state if necessary
      } catch (error) {
        console.error("Error saving screening results:", error);
        // Handle the error as needed
      }
    }
  };

  const handleCancelScreening = async () => {
    fetchScreeningResults();
    setIsFinished(true);
  };

  // Function to apply filtering and sorting to available applicants
  const applyFilterAndSort = () => {
    let filteredWorkers = [...applicantsPool];

    // Apply filters
    if (selectedDocuments.length > 0) {
      filteredWorkers = filteredWorkers.filter((worker) =>
        worker.information.documents.some((document) =>
          selectedDocuments.includes(document.type.toLowerCase())
        )
      );
    }

    // Apply sorting to whichever sort option is active
    switch (activeSortOption) {
      case "Bookings":
        // TODO: Implement sorting by date range

        break;
      case "Distance":
        // console.log("Before: ", filteredWorkers);
        if (sortSelectDistance === "Nearest") {
          filteredWorkers.sort(
            (a, b) => a.information.distance - b.information.distance
          );
        } else if (sortSelectDistance === "Farthest") {
          filteredWorkers.sort(
            (a, b) => b.information.distance - a.information.distance
          );
        }

        // console.log(filteredWorkers);
        break;
      case "Rate":
        // TODO: Implement sorting by cost
        if (sortSelectRate === "Lowest") {
          filteredWorkers.sort(
            (a, b) => a.information.hourly_rate - b.information.hourly_rate
          );
        } else if (sortSelectRate === "Highest") {
          filteredWorkers.sort(
            (a, b) => b.information.hourly_rate - a.information.hourly_rate
          );
        }
        break;
      case "Stars":
        // TODO: Implement sorting by duration

        break;
      default:
        // console.log("No active sort option");
        break;
    }

    // Update the state with filtered and sorted workers.
    setShortlistedApplicants(filteredWorkers);

    console.log("Filtered and sorted workers: ", filteredWorkers);
  };

  const handleResetFilterAndSort = () => {
    setSortSelectBookings(null);
    setSortSelectDistance(null);
    setSortSelectRate(null);
    setSortSelectStars(null);
    setSelectedDocuments([]);
    setActiveSortOption(null);
    setSelectTop(null);
  };

  const hideElement = () => {
    if (isFinished) return "hidden";
  };

  const EmptyMessage = (message) => (
    <div className="">
      <p className="">No qualified applicants found.</p>
      {/* You can customize the message or add additional content here */}
    </div>
  );

  const fetchScreeningResults = async () => {
    const response = await ScreeningService.getScreeningResults(postId);

    console.log("response: ", response.length);

    if (response.length > 0) {
      // Iterate over screening results and find corresponding applicant
      const updatedPassedApplicants = response
        .filter((result) => result.result === "passed")
        .map((result) => {
          const matchingApplicant = applicants.find(
            (applicant) => applicant.information.email === result.worker.email
          );

          return matchingApplicant
            ? { ...matchingApplicant, screeningResult: result }
            : null;
        })
        .filter(Boolean);

      // this is saved screening results of failed
      const updatedApplicantsPool = response
        .filter((result) => result.result === "failed")
        .map((result) => {
          const matchingApplicant = applicants.find(
            (applicant) => applicant.information.email === result.worker.email
          );

          return matchingApplicant
            ? { ...matchingApplicant, screeningResult: result }
            : null;
        })
        .filter(Boolean);

      // determine if there is a new applicant added that is not yet screened
      const newApplicants = applicants.filter(
        (applicant) =>
          !response.some(
            (result) => result.worker.email === applicant.information.email
          )
      );

      // add the new applicants to the pool
      updatedApplicantsPool.push(...newApplicants);

      setPassedApplicants(updatedPassedApplicants);
      setApplicantsPool(updatedApplicantsPool);

      // since there is an existing screening result, disable set isFinished to true
      setIsFinished(true);
    }
    // If there is no screening result saved, set the applicants pool to all applicants
    else if (response.length === 0) {
      setApplicantsPool(applicants);
    }
  };

  useEffect(() => {
    const setDistances = async () => {
      applicants.forEach((applicant) => {
        applicant.information.distance = LocationService.getDistance(
          applicant.information.city_municipality,
          distances
        );
      });
    };

    setDistances();
  }, [applicants, distances]);

  useEffect(() => {
    // Apply initial filtering and sorting when applicants change.
    applyFilterAndSort();
    console.log(applicants);
  }, [
    applicants,
    selectedDocuments,
    sortSelectBookings,
    sortSelectDistance,
    sortSelectRate,
    sortSelectStars,
  ]);

  useEffect(() => {
    setShortlistedApplicants([...applicantsPool]);
    applyFilterAndSort();
  }, [applicantsPool]); // Update shortlisted applicants when pool changes

  useEffect(() => {
    fetchScreeningResults();
  }, [applicants, postId]);

  return (
    <div className="">
      <Toast ref={toast} />
      <div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold leading-6 text-gray-900">
            Qualified Applicants
            {/* {console.log(shortlistedApplicants)} */}
          </p>
          <div className="flex items-center justify-center pl-3 rounded-md mb-3">
            {!isFinished && (
              <Button
                label="Save Screening Result"
                size="small"
                severity="primary"
                className="align-middle"
                iconPos="right"
                onClick={() => confirmSaveScreening()}
                disabled={!passedApplicants.length}
              />
            )}
            {isFinished && (
              <Button
                label="Edit"
                size="small"
                severity="secondary"
                className="align-middle"
                iconPos="right"
                onClick={() => handleSaveScreening(isFinished)}
              />
            )}
            {!isFinished && (
              <Button
                label="Cancel"
                size="small"
                severity="secondary"
                className="align-middle ml-3"
                onClick={() => handleCancelScreening()}
                outlined
              />
            )}
          </div>
        </div>
        <div className="w-full">
          {passedApplicants.length > 0 ? (
            passedApplicants.map((applicant, index) => (
              <div className="flex items-center justify-between mb-2.5 ml-2">
                <div className="flex items-center">
                  <p className="mr-3">{index + 1}.</p>
                  <div className="mr-3">
                    <img
                      src={
                        applicant.information.profile_url ||
                        "/layout/profile-default.png"
                      }
                      alt="profile"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-lg">
                      {applicant.information.first_name}{" "}
                      {applicant.information.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {applicant.information.city_municipality},{" LEYTE"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-grow">
                    <Button
                      type="button"
                      size="small"
                      icon="pi pi-chevron-right"
                      className={`align-middle ${hideElement()}`}
                      onClick={() => handleOpen(applicant)}
                      outlined
                    />
                  </div>
                  <div className="">
                    <Button
                      type="button"
                      size="small"
                      icon="pi pi-user-minus"
                      severity="danger"
                      className={`align-middle ${hideElement()}`}
                      onClick={() => handleRemoveApplicantFromPassed(applicant)}
                      outlined
                      rounded
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyMessage />
          )}
        </div>
        {/* <div className="flex items-center justify-center mb-2"></div> */}
      </div>
      <div className="mt-6">
        {!isFinished ? (
          <div className="shortListing-area">
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg font-semibold leading-6 text-gray-900 m-0">
                Select or Shortlist Applicants
                <i className="pi pi-chevron-bottom"></i>
              </p>
            </div>
            <div className="flex items-center justify-center mb-2">
              <div className="flex-grow">
                <span className="text-sm font-semibold mr-6">
                  Selecting Top:{" "}
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {selectTop}
                  </span>
                </span>
                <span className="text-sm font-semibold mr-6">
                  Shortisted By:{" "}
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {activeSortOption}
                  </span>
                </span>
                <span className="text-sm font-semibold mr-6">
                  Required Documents:{" "}
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {selectedDocuments
                      .map((doc) => doc.toUpperCase())
                      .join(", ")}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="small"
                    icon="pi pi-undo"
                    className="align-middle"
                    onClick={() => handleResetFilterAndSort()}
                    text
                  />
                  <Button
                    type="button"
                    size="small"
                    icon="pi pi-sliders-v"
                    onClick={(e) => op.current.toggle(e)}
                    text
                  />
                  <Button
                    type="button"
                    size="small"
                    icon="pi pi-check"
                    className="align-middle"
                    onClick={() => handleConfirmScreening()}
                    tooltip="Confirm Screening"
                    tooltipOptions={{ position: "top" }}
                    // text
                  />
                </div>
              </div>
            </div>
            <OverlayPanel
              ref={op}
              style={{ height: "50vh", overflowY: "auto" }}
            >
              <div className="">
                <div>
                  <span className="vertical-align-middle font-bold">
                    <i className="pi pi-filter mr-1"></i>
                    Requirement:
                  </span>
                  <Divider className="mt-2" />
                  <label className="font-medium">Shortlist Priority</label>
                  <div className="py-3 ml-1">
                    <div className="mb-3">
                      <MultiStateCheckbox
                        value={sortSelectBookings}
                        options={bookingsOptions}
                        optionValue="value"
                        onChange={(e) =>
                          handleCheckboxChange("Bookings", e.value)
                        }
                      />
                      <span className="vertical-align-middle ml-2">
                        Number of Bookings{" "}
                        {sortSelectBookings
                          ? `(${sortSelectBookings})`
                          : "(none)"}
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="mb-3">
                      <MultiStateCheckbox
                        value={sortSelectDistance}
                        options={distanceOptions}
                        optionValue="value"
                        onChange={(e) =>
                          handleCheckboxChange("Distance", e.value)
                        }
                      />
                      <span className="vertical-align-middle ml-2">
                        Distance{" "}
                        {sortSelectDistance
                          ? `(${sortSelectDistance})`
                          : "(none)"}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="mb-3">
                      <MultiStateCheckbox
                        value={sortSelectRate}
                        options={rateOptions}
                        optionValue="value"
                        onChange={(e) => handleCheckboxChange("Rate", e.value)}
                        // disabled // disable cost sorting for now
                      />
                      <span className="vertical-align-middle ml-2">
                        Pay rate{" "}
                        {sortSelectRate ? `(${sortSelectRate})` : "(none)"}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="mb-3">
                      <MultiStateCheckbox
                        value={sortSelectStars}
                        options={starsOptions}
                        optionValue="value"
                        onChange={(e) => handleCheckboxChange("Stars", e.value)}
                        disabled // disable duration sorting for now
                      />
                      <span className="vertical-align-middle ml-2">
                        Stars{" "}
                        {sortSelectStars ? `(${sortSelectStars})` : "(none)"}
                      </span>
                    </div>
                  </div>
                  <label className="font-medium">Document Availability</label>
                  <div className="py-3">
                    <MultiSelect
                      value={selectedDocuments}
                      options={documentAvailOptions}
                      onChange={(e) => setSelectedDocuments(e.value)}
                      optionLabel="name"
                      placeholder="Select Documents"
                      className="w-full"
                      maxSelectedLabels={2}
                    />
                  </div>
                  <label htmlFor="selectTop" className="font-medium">
                    Select Top
                  </label>
                  <div className="py-3">
                    <InputNumber
                      id="selectTop"
                      inputId="minmax"
                      value={selectTop}
                      onValueChange={(e) => setSelectTop(e.value)}
                      min={0}
                      max={100}
                      showButtons
                      inputClassName="w-full"
                      // pt={{ input: { className: "w-3 bg-red-500" } }}
                    />
                  </div>
                </div>
              </div>
            </OverlayPanel>
            <AppliedLists
              mode="screening"
              handleAddApplicantAsPassed={handleAddApplicantAsPassed}
              topNumber={selectTop} // Number of workers to be shortlisted
              applicants={shortlistedApplicants}
              distances={distances}
            />
          </div>
        ) : (
          <div className="disqualified-area">
            <p className="text-lg font-semibold leading-6 text-gray-900 mb-4">
              Applicants Pool
              <i className="pi pi-chevron-bottom"></i>
            </p>
            {applicantsPool.length > 0 ? (
              applicantsPool.map((applicant, index) => (
                <div
                  className="flex items-center justify-between mb-2.5 ml-2"
                  key={index}
                >
                  <div className="flex items-center">
                    <p className="mr-3">{index + 1}.</p>
                    <div className="mr-3">
                      <img
                        src={
                          applicant.information.profile_url ||
                          "/layout/profile-default.png"
                        }
                        alt="profile"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">
                        {applicant.information.first_name}{" "}
                        {applicant.information.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {applicant.information.city_municipality},{" LEYTE"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>
                No applicants left. Please go back to the previous step to
                select more applicants.
              </p>
            )}
          </div>
        )}
        {/* Displayed when isFinished is true */}
      </div>
    </div>
  );
}
