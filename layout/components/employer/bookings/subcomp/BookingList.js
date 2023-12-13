import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { useRouter } from "next/router";
import BookingStatus from "./BookingStatus";

const BookingList = ({ bookings }) => {
  const router = useRouter();
  const [layout, setLayout] = useState("list");

  const handleBookingClick = (bookingType, bookingId) => {
    return bookingType === "booking"
      ? router.push("/app/employer/bookings/view/" + bookingId)
      : router.push("/app/employer/bookings/request/" + bookingId);
  };

  const listItem = (booking) => {
    return (
      <div
        className="booking-item w-full px-2 py-4 cursor-pointer rounded-md hover:bg-gray-100"
        onClick={() => handleBookingClick(booking.type, booking.id)}
      >
        <div className="booking-item__header flex justify-between">
          <div className="booking-item__header__left ">
            <h3 className="m-0 mb-2  text-xl">{booking.title}</h3>
            <div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{booking.service}</span>
                </span>

                <BookingStatus status={booking.progress} />
              </div>
            </div>
          </div>
          <div className="booking-item__header__right flex flex-column justify-center">
            <div className="text-right">
              {booking.date} • <span>{booking.time}</span>
            </div>
            <div className="flex items-center justify-end">
              {/* <p className="m-0 text-right">Kasambahay: </p> */}
              <img
                src={booking.profile_url}
                alt="profile picture"
                className="mr-2 h-6 rounded-full"
              />
              <span>{booking.worker}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-list">
      <DataView
        value={bookings}
        itemTemplate={listItem}
        layout={"list"}
        paginator
        rows={10}
      />
    </div>
  );
};

export default BookingList;
