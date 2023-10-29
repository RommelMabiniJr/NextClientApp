const BookingViewContent = ({ booking }) => {
  return (
    <div className="divide-y px-6 py-4 lg:w-900px">
      <div className="pb-4">
        <h3 className="font-bold m-0">
          Nanny Needed For My Children In Waltham.
        </h3>
      </div>
      <div className="pt-2">
        <div className="flex mb-4">
          <div className="flex pr-2 flex-1">
            <span className="my-2 mr-2">
              <i className="pi pi-calendar text-lg"></i>
            </span>
            <div className="my-1.5">
              <p className="m-0">Job Start Date:</p>
              <p className="m-0 font-medium">Mon, Oct 1, 2021</p>
            </div>
          </div>
          <div className="flex px-2 flex-1">
            <span className="my-2 mr-2">
              <i className="pi pi-briefcase text-lg"></i>
            </span>
            <div className="my-1.5">
              <p className="m-0">Job & Service Type:</p>
              <p className="m-0 font-medium">Full-Time, Elder Care</p>
            </div>
          </div>
          <div className="flex px-2 flex-1">
            <span className="my-2 mr-2">
              <i className="pi pi-money-bill text-lg"></i>
            </span>
            <div className="my-1.5">
              <p className="m-0">Pay Rate:</p>
              <p className="m-0 font-medium">₱20-35/hr</p>
            </div>
          </div>
          <div className="flex px-2 flex-1">
            <span className="my-2 mr-2">
              <i className="pi pi-map-marker text-lg"></i>
            </span>
            <div className="my-1.5">
              <p className="m-0">Location:</p>
              <p className="m-0 font-medium">Buntay, Abuyog, Leyte</p>
            </div>
          </div>
        </div>
        <div className="my-4">
          <p className="font-bold mb-2">Job Description</p>
          <p className="m-0">
            We are looking for a great nanny for 2 children in Waltham. We would
            prefer someone who could help out with light housekeeping, meal
            preparation and laundry. We would prefer a nanny who has their own
            car, who does not smoke, who is willing to drive children, who is
            comfortable with pets and who is CPR certified.
          </p>
        </div>
        <div className="my-4">
          <p className="font-bold mb-2">Job Schedule</p>
          <div className="flex gap-8">
            <div className="flex">
              <span className="my-2 mr-2">
                <i className="pi pi-calendar text-lg"></i>
              </span>
              <div className="my-1.5">
                <p className="m-0">Duration</p>
                <p className="m-0 font-medium">Oct 1, 2021 - Nov 31, 2021</p>
              </div>
            </div>
            <div className="flex">
              <span className="my-2 mr-2">
                <i className="pi pi-clock text-lg"></i>
              </span>
              <div className="my-1.5">
                <p className="m-0">Working Hours:</p>
                <p className="m-0 font-medium">8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <p className="font-bold mb-2">Hired Kasambahay</p>
          <div className="flex gap-8">
            <div className="flex">
              <span className="my-2 mr-2">
                <i className="pi pi-user text-lg"></i>
              </span>
              <div className="my-1.5">
                {/* <p className="m-0">Name:</p> */}
                <p className="m-0 font-medium">Maria Cristina</p>
              </div>
            </div>
            <div className="flex">
              <span className="my-2 mr-2">
                <i className="pi pi-phone text-lg"></i>
              </span>
              <div className="my-1.5">
                {/* <p className="m-0">Contact Number:</p> */}
                <p className="m-0 font-medium">09123456789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingViewContent;
