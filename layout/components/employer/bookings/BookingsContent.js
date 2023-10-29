import { Dropdown } from "primereact/dropdown";
import BookingList from "./subcomp/BookingList";
import { useState } from "react";

const BookingsContent = ({ bookings, loading, error }) => {
  bookings = [
    {
      id: 1,
      title: "Nanny Needed For My Children In Waltham.",
      service: "Pet Care",
      status: "Confirmed",
      profile_url: "/layout/profile-default.png",
      worker: "John Doe",
      date: "2023-11-01",
      time: "10:00 AM",
      salary: 15000,
      payFrequency: "Monthly",
      benefits: ["Health Insurance", "Paid Time Off"],
    },
    {
      id: 2,
      title: "Kasambahay for 2 weeks",
      service: "Household Services",
      status: "Pending",
      profile_url: "/layout/profile-default.png",
      worker: "Jane Smith",
      date: "2023-11-05",
      time: "02:30 PM",
      salary: 18000,
      payFrequency: "Bi-weekly",
      benefits: ["Flexible Schedule"],
    },
    {
      id: 3,
      title: "Looking for a Nanny",
      service: "Elder Care",
      status: "Confirmed",
      profile_url: "/layout/profile-default.png",
      worker: "Bob Johnson",
      date: "2023-11-10",
      time: "08:00 AM",
      salary: 20000,
      payFrequency: "Weekly",
      benefits: ["401(k) Matching", "Gym Membership"],
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const bookingStatus = [
    { name: "All", code: "all" },
    { name: "Active", code: "active" },
    { name: "Upcoming", code: "upcoming" },
    { name: "Completed", code: "completed" },
    { name: "Canceled", code: "cancelled" },
  ];

  const workerOptions = [
    { name: "All", code: "all" },
    { name: "John Doe", code: "john-doe" },
    { name: "Jane Smith", code: "jane-smith" },
    { name: "Bob Johnson", code: "bob-johnson" },
  ];

  return (
    <div className="px-6 py-3 divide-y">
      <div className="pb-4 flex justify-between items-end">
        <div>
          <p className="font-medium text-3xl text-800 m-0">Bookings</p>
          <p className="text-gray-500 text-lg">
            View and manage your nanny bookings here.
          </p>
        </div>

        <div className="flex">
          <div>
            <p>Status:</p>
            <Dropdown
              value={selectedStatus}
              options={bookingStatus}
              optionLabel="name"
              onChange={(e) => setSelectedStatus(e.value)}
              className="mr-2"
              placeholder="Filter by Status"
            />
          </div>
          <div>
            <p>Worker:</p>
            <Dropdown
              value={selectedWorker}
              options={workerOptions}
              optionLabel="name"
              onChange={(e) => setSelectedWorker(e.value)}
              className="mr-2"
              placeholder="Filter by Status"
            />
          </div>
        </div>
      </div>
      <div className="rounded-md pt-2 ">
        <BookingList bookings={bookings} />
      </div>
    </div>
  );
};

export default BookingsContent;
