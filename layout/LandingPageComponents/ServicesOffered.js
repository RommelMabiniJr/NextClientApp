// import React from "react";

// const ServiceItem = ({ icon, title, description }) => (
//   <div className="service-item">
//     <img
//       src={`layout/lp services/${icon}.png`}
//       className="h-5 w-5"
//       alt={title}
//     />
//     <div className="text-800 text-lg mb-3 font-semibold">{title}</div>
//     <p className="text-justify-center text-700 line-height-3">{description}</p>
//   </div>
// );

// export function Services() {
//   const services = [
//     {
//       icon: "childcare",
//       title: "Child Care",
//       description:
//         "Connect with screened professionals for child care while you're away.",
//     },
//     {
//       icon: "elderlycare",
//       title: "Elderly Care",
//       description:
//         "Find trusted professionals for elderly care and companionship.",
//     },
//     {
//       icon: "petcare",
//       title: "Pet Care",
//       description:
//         "Reliable pet care professionals for your furry friends while you're away.",
//     },
//     {
//       icon: "housekeeping",
//       title: "Housekeeping",
//       description: "Get help with household tasks like cleaning and laundry.",
//     },
//     {
//       icon: "jobarrangement",
//       title: "Job Arrangement",
//       description:
//         "Explore part-time and full-time job opportunities for flexibility.",
//     },
//     {
//       icon: "livingarrangement",
//       title: "Living Arrangement",
//       description:
//         "Choose between live-in and live-out arrangements based on your preferences.",
//     },
//   ];

//   return (
//     <div className="p-5 surface-0 text-center">
//       <div className="p-3 font-bold text-5xl">
//         <span className="text-900">Connecting families, </span>
//         <span className="text-blue-600">through Services</span>
//       </div>
//       <div className="text-700 px-2 font-semibold font-italic">
//         We are KasambahayKo, dedicated to helping you find the right person for
//         your household tasks.
//       </div>
//       <div className="col-12 md:col-3">
//         {services.map((service, index) => (
//           <div className="col" key={index}>
//             <ServiceItem {...service} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Services;
// Path: layout/LandingPageComponents/ServicesOffered.js

import React from "react";

const ServiceItem = ({ icon, title, description }) => (
  <div
    className="flex flex-col items-center mb-3 mx-2 inline-block"
    style={{ borderRadius: "20px" }}
  >
    <img
      src={`layout/lp services/${icon}.png`}
      className="h-40 w-40"
      alt={title}
    />
    <div className="text-900 font-bold text-lg mb-1 font-semibold">{title}</div>
    <p className="text-justify-center text-800 line-height-3 p-2">
      {description}
    </p>
  </div>
);

export function ServicesOffered() {
  const services = [
    {
      icon: "childcare",
      title: "Child Care",
      description:
        "Connect with screened professionals for child care while you're away.",
    },
    {
      icon: "elderlycare",
      title: "Elderly Care",
      description:
        "Find trusted professionals for elderly care and companionship.",
    },
    {
      icon: "petcare",
      title: "Pet Care",
      description:
        "Reliable pet care professionals for your furry friends while you're away.",
    },
    {
      icon: "housekeeping",
      title: "Housekeeping",
      description: "Get help with household tasks like cleaning and laundry.",
    },
    {
      icon: "jobarrangement",
      title: "Job Arrangement",
      description:
        "Explore part-time and full-time job opportunities for flexibility.",
    },
    {
      icon: "livingarrangement",
      title: "Living Arrangement",
      description:
        "Choose between live-in and live-out arrangements based on your preferences.",
    },
  ];
  return (
    <div id="ServicesOffered" className="p-5 text-center">
      <div className="p-3 font-bold text-6xl">
        <span className="text-900">Connecting families, </span>
        <span className="text-blue-600">through Services</span>
      </div>
      <div className="text-700 mb-5 font-semibold font-italic">
        We are KasambahayKo, dedicated to helping you find the right person for
        your household tasks.
      </div>
      <div className="grid justify-center">
        {services.map((service, index) => (
          <div className=" col-12 md:col-4" key={index}>
            <ServiceItem {...service} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesOffered;
