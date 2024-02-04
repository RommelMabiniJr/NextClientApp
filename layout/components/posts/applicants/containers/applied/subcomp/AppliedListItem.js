import { Rating } from "primereact/rating";
import { LocationService } from "@/layout/service/LocationService";
import DateConverter from "@/lib/dateConverter";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

export default function ListItem({
  applicant,
  applicant_full,
  applicationDate,
  distances,
  mode, // "applied" or "screening"
  onOpen,
  displayAs,
  handleAddApplicantAsPassed,
}) {
  const dateConverter = DateConverter();

  // Determine background color based on displayAs parameter
  const getBackgroundColor = () => {
    if (displayAs === "green") {
      return "border-l-8 border-teal-400"; // Green with opacity
    } else if (displayAs === "red") {
      return "border-l-8 border-orange-500"; // Red with opacity
    } else {
      return ""; // Default to white
    }
  };

  const ShortListBtn = () => {
    if (mode === "screening") {
      return (
        <div>
          <Button
            icon="pi pi-user-plus"
            className=""
            onClick={() => handleAddApplicantAsPassed(applicant_full)}
            rounded
            outlined
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <li
            key={applicant.email}
            className={`rounded-md flex justify-between gap-x-6 py-5 px-2 cursor-pointer flex-1`}
            onClick={onOpen}
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 flex-none rounded-full bg-gray-50"
                src={applicant.profile_url}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <span className="flex">
                  <p className="m-0 mr-2 text-base font-semibold leading-6 text-gray-900">
                    {applicant.first_name + " " + applicant.last_name}
                  </p>
                  <span
                    className={classNames(
                      "inline-flex items-center rounded-md px-1 py-0.5 text-xs font-medium ring-1 ring-inset ",
                      {
                        "bg-green-50 text-green-700 ring-green-600/20":
                          applicant.verified,
                        "text-yellow-700 bg-yellow-50 ring-yellow-600/20":
                          !applicant.verified,
                      }
                    )}
                  >
                    {applicant.verified ? "Verified" : "Unverified"}
                  </span>
                </span>

                <Rating
                  className="mt-1 truncate text-xs leading-5 text-gray-600"
                  pt={{
                    root: { className: "gap-1" },
                    onIcon: { className: "h-10 w-10 text-orange-400" },
                    offIcon: { className: "h-10 w-10" },
                  }}
                  // for every reviews, the value will be added to the total value and divided by the number of reviews
                  value={
                    applicant.reviews.length > 0
                      ? applicant.reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / applicant.reviews.length
                      : 0
                  }
                  readOnly
                  cancel={false}
                />
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-right">
              <div className="flex justify-between w-full items-center">
                <div>
                  <p className="m-0 text-sm leading-6 text-gray-900">
                    {dateConverter.convertDateToReadableDetailed(
                      applicationDate
                    )}
                  </p>

                  <div className="mt-1 flex items-center justify-end gap-x-1.5">
                    <i className="pi pi-map-marker"></i>
                    <p className="text-xs leading-5 text-gray-600">
                      {applicant.barangay + " | " + applicant.city_municipality}
                    </p>
                  </div>
                </div>

                <i className="pi pi-chevron-right m-2 ml-3 text-xs"></i>
              </div>
            </div>
          </li>
          <div
            className={`cursor-pointer absolute top-0 left-0 w-full h-full rounded-md ${getBackgroundColor()}`}
            onClick={onOpen}
          ></div>
        </div>
        <ShortListBtn />
      </div>
      {/* Cover the whole li */}
    </>
  );
}
