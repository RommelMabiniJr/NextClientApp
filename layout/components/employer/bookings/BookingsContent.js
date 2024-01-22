import { Dropdown } from "primereact/dropdown";
import BookingList from "./subcomp/BookingList";
import { useEffect, useState } from "react";
import { BookingService } from "@/layout/service/BookingService";
import { UUIDService } from "@/layout/service/UUIDService";

const BookingsContent = ({ session }) => {
  const [simpleBookings, setSimpleBookings] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState(null);
  const [filteredWorkers, setFilteredWorkers] = useState(null);
  const [simpleBookingRequests, setSimpleBookingRequests] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const bookingStatus = [
    { name: "All", code: "all" },
    { name: "Active", code: "active" },
    { name: "Upcoming", code: "upcoming" },
    { name: "Completed", code: "completed" },
    { name: "Pending", code: "pending" },
    { name: "Cancelled/Expired/Declined", code: "cancelled" },
  ];

  const FAQs = [
    {
      question: "How do I post a job?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptas, natus, voluptatum, dolorum quidem voluptatibus dolor consequatur quos quae quibusdam quia. Quisquam voluptas, natus, voluptatum, dolorum quidem voluptatibus dolor consequatur quos quae quibusdam quia.",
    },
    {
      question: "How do I post a job?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptas, natus, voluptatum, dolorum quidem voluptatibus dolor consequatur quos quae quibusdam quia. Quisquam voluptas, natus, voluptatum, dolorum quidem voluptatibus dolor consequatur quos quae quibusdam quia.",
    },
  ];

  const workerOptions = [
    { name: "All", code: "all" },
    { name: "John Doe", code: "john-doe" },
    { name: "Jane Smith", code: "jane-smith" },
    { name: "Bob Johnson", code: "bob-johnson" },
  ];

  const filterProgressAndWorker = (progress, worker) => {
    // handles filter for both the selected status and worker
    let filtered;

    if (progress.name === "All") {
      filtered = simpleBookings;
    } else {
      if (progress.name === "Active") {
        filtered = simpleBookings.filter(
          (booking) => booking.progress === "In Progress"
        );
      } else if (progress.name === "Upcoming") {
        filtered = simpleBookings.filter(
          (booking) => booking.progress === "Confirmed"
        );
      } else if (progress.name === "Cancelled/Expired/Declined") {
        filtered = simpleBookings.filter(
          (booking) =>
            booking.progress === "Cancelled" ||
            booking.progress === "Declined" ||
            booking.progress === "Expired"
        );
      } else {
        filtered = simpleBookings.filter(
          (booking) => booking.progress === progress.name
        );
      }
    }

    // Filter by selected worker if it is not 'All'
    if (worker && worker.code !== "all") {
      filtered = filtered.filter((booking) => booking.worker === worker.name);
    }

    setFilteredBookings(filtered);
  };

  const handleProgressFilter = (progress) => {
    setSelectedStatus(progress);
    filterProgressAndWorker(progress, selectedWorker);
  };

  const handleWorkerFilter = (worker) => {
    setSelectedWorker(worker);
    filterProgressAndWorker(selectedStatus, worker);
  };

  useEffect(() => {
    // get bookings simple
    const fetchAllBookings = async () => {
      const { userId } = await UUIDService.getUserId(session.user.uuid);
      const allBookings = await BookingService.getEmployerAllBookingsSimple(
        userId
      );
      // console.log(userId);
      setFilteredBookings(allBookings);
      setSimpleBookings(allBookings);

      // set worker options, display once a worker if there are multiple bookings for that worker
      const workerOptions = allBookings.map((booking) => {
        return {
          name: booking.worker,
          code: booking.worker.toLowerCase().replace(" ", "-"),
        };
      });

      const uniqueWorkerOptions = workerOptions.filter(
        (worker, index, self) =>
          index === self.findIndex((t) => t.name === worker.name)
      );

      setFilteredWorkers([
        { name: "All", code: "all" },
        ...uniqueWorkerOptions,
      ]);
    };

    fetchAllBookings();
  }, []);
  const TextLimit = ({ text, limit }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
      setShowMore(!showMore);
    };

    const displayText = showMore ? text : text.slice(0, limit);

    return (
      <div>
        <p className="whitespace-pre-line">
          {displayText}{" "}
          {text.length > limit && (
            <span
              onClick={toggleShowMore}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              {showMore ? "See less" : "See more"}
            </span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="px-6 ">
      <div className="py-3">
        <p className="font-medium text-3xl text-900 m-0">Bookings</p>
        <p className="text-gray-700 text-lg">
          You can view and manage your bookings here. You can also filter by
          status and worker.
        </p>
      </div>
      <div className="flex mt-3 gap-3 w-3/4 w-full">
        <div className="flex-1 md:flex-none">
          <p className="font-medium text-gray-900 mb-2">Status:</p>
          <Dropdown
            value={selectedStatus}
            options={bookingStatus}
            optionLabel="name"
            onChange={(e) => handleProgressFilter(e.value)}
            className="mr-2 w-full md:w-min"
            placeholder="Filter by Status"
          />
        </div>
        <div className="flex-1 md:flex-none">
          <p className="font-medium text-gray-900 mb-2">Kasambahay:</p>
          <Dropdown
            value={selectedWorker}
            options={filteredWorkers}
            optionLabel="name"
            onChange={(e) => handleWorkerFilter(e.value)}
            className="mr-2 w-full md:w-min"
            placeholder="Filter by Status"
          />
        </div>
      </div>
      <div className="flex flex-column md:flex-row gap-3">
        <div className="py-3 w-full md:w-3/4">
          <div className="rounded-md pt-2 divide-y">
            <BookingList bookings={filteredBookings} />
          </div>
        </div>
        <div className="md:w-1/4 mt-3">
          <h3 className="font-medium text-gray-900 mb-2 text-xl">
            Frequently Asked Questions
          </h3>
          <div className="divide-y mb-6">
            {FAQs.map((faq, index) => (
              <div className="py-1.5" key={index}>
                <p className="font-medium text-gray-900 mb-1">{faq.question}</p>
                <TextLimit text={faq.answer} limit={100} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsContent;
