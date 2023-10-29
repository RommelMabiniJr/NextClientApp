import React, { useState, useEffect, useRef } from "react";
import AppliedLists from "@/layout/components/posts/applicants/containers/applied/subcomp/AppliedLists";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { LocationService } from "@/layout/service/LocationService";

export default function ScreeningContainer({ applicants, distances }) {
  const op = useRef(null);

  // State for filters and sorting
  const [selectTop, setSelectTop] = useState(10);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [sortSelectBookings, setSortSelectBookings] = useState(null);
  const [sortSelectDistance, setSortSelectDistance] = useState("Nearest");
  const [sortSelectRate, setSortSelectRate] = useState(null);
  const [sortSelectStars, setSortSelectStars] = useState(null);

  const [shortlistedApplicants, setShortlistedApplicants] =
    useState(applicants);
  const [activeSortOption, setActiveSortOption] = useState("Distance");

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

  // Function to apply filtering and sorting to available applicants
  const applyFilterAndSort = () => {
    let filteredWorkers = [...applicants];

    console.log(applicants);

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

    console.log(filteredWorkers);
    // Update the state with filtered and sorted workers.
    setShortlistedApplicants(filteredWorkers);
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
    // console.log("filtering");
  }, [
    applicants,
    selectedDocuments,
    sortSelectBookings,
    sortSelectDistance,
    sortSelectRate,
    sortSelectStars,
  ]);

  return (
    <div className="">
      <div className="bg-primary-100 flex items-center justify-between p-2 pl-3 rounded-md mb-3">
        <p className=" text-lg font-bold m-0">
          <i className="pi pi-check-square mr-3 text-green-700"></i>
          SHORTLISTING ONGOING!
        </p>
        <Button
          label="Confirm Screening"
          size="small"
          className="align-middle"
          icon="pi pi-chevron-right"
          iconPos="right"
          // disabled
          // onClick={handleMoveToNextTab}
        />
        {/* <Button
          label="Confirm Screening"
          icon="pi pi-arrow-right"
          iconPos="right"
          outlined
          onClick={() => handleConfirmScreening("top-right")}
        /> */}
      </div>
      <div className="flex items-center justify-center mb-2">
        <div className="mr-3">
          <Button
            type="button"
            icon="pi pi-sliders-v"
            onClick={(e) => op.current.toggle(e)}
            outlined
          />
        </div>
        <div className="flex-grow">
          <span className="font-semibold mr-6">
            Selecting Top:{" "}
            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {selectTop}
            </span>
          </span>
          <span className="font-semibold mr-6">
            Shortisted By:{" "}
            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {activeSortOption}
            </span>
          </span>
          <span className="font-semibold mr-6">
            Required Documents:{" "}
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {selectedDocuments.map((doc) => doc.toUpperCase()).join(", ")}
            </span>
          </span>
        </div>
      </div>
      <OverlayPanel ref={op} style={{ height: "50vh", overflowY: "auto" }}>
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
                  onChange={(e) => handleCheckboxChange("Bookings", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Number of Bookings{" "}
                  {sortSelectBookings ? `(${sortSelectBookings})` : "(none)"}
                </span>
              </div>

              {/* Distance */}
              <div className="mb-3">
                <MultiStateCheckbox
                  value={sortSelectDistance}
                  options={distanceOptions}
                  optionValue="value"
                  onChange={(e) => handleCheckboxChange("Distance", e.value)}
                />
                <span className="vertical-align-middle ml-2">
                  Distance{" "}
                  {sortSelectDistance ? `(${sortSelectDistance})` : "(none)"}
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
                  Pay rate {sortSelectRate ? `(${sortSelectRate})` : "(none)"}
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
                  Stars {sortSelectStars ? `(${sortSelectStars})` : "(none)"}
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
            <div className="py-3">
              <Button
                label="Apply"
                className="w-full"
                onClick={applyFilterAndSort}
              />
            </div>
          </div>
        </div>
      </OverlayPanel>
      <AppliedLists
        topNumber={selectTop} // Number of workers to be shortlisted
        applicants={shortlistedApplicants}
        distances={distances}
      />
    </div>
  );
}
