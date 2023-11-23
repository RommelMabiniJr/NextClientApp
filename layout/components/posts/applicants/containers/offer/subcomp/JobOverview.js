import { Tag } from "primereact/tag";

const JobOverview = ({ job }) => {
  return (
    <div className="flex-1 mt-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-2">Job Overview</h3>
      </div>
      <div className="mb-4">
        <h3 className="text-sm text-primary-400 font-medium mb-2">Title</h3>
        <p className="text-xl font-medium m-0 mb-1">
          Part-time Nanny for 2 children
        </p>
        <div className="">
          <Tag value="Part-time" className="mr-2 text-xs"></Tag>
          <Tag value="Child Care" className=" text-xs" severity="warning"></Tag>
        </div>
      </div>
      <h3 className="text-sm text-primary-400 font-medium mb-2">Description</h3>
      <p className="text-sm font-base mb-4 text-justify">
        We are looking for a part-time nanny for our 2 children. We are looking
        for someone who can work 3 days a week from 8am to 5pm. We are looking
        for someone who can help with light housework and meal preparation for
        the children.
      </p>
      <div style={{ display: "grid" }} className="grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Location
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-map-marker mr-2"></span> */}
              General Luna St, Buntay, Abuyog, Leyte
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Arrangement
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-calendar mr-2"></span> */}
              Live-in with shared room
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "grid" }} className="grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">Dates</h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-calendar mr-2"></span> */}
              October 1 - November 30, 2021
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm text-primary-400 font-medium mb-2">
            Working Hours
          </h3>
          <div className="mb-4">
            <p className="text-sm font-base mb-0 align-middle">
              {/* <span className="pi pi-clock mr-2"></span> */}
              8am - 5pm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
