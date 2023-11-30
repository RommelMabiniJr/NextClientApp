// import { Avatar } from "primereact/avatar";

// export function Testimonials() {
//   const testimonials = [
//     {
//       id: 1,
//       avatar: "layout/test/esie.jpg",
//       message:
//         "I am very happy with the service. I was able to find a trustworthy and reliable nanny for my kids. I will definitely recommend this to my friends.",
//       name: "Markyy",
//     },
//     {
//       id: 2,
//       avatar: "layout/test/ryan.jpg",
//       message:
//         "I needed someone to take care of my dog while I was away on vacation and KasambahayKo helped me find the perfect pet sitter. I will definitely use this service again in the future.",
//       name: "Christopher",
//     },
//     {
//       id: 3,
//       avatar: "layout/test/rommel.jpg",
//       message:
//         "I was hesitant to try this service at first, but I'm so glad I did. The housekeeper I found through KasambahayKo is amazing and has made my life so much easier.",
//       name: "Rommel",
//     },
//   ];

//   return (
//     <div id="Testimonials" className="surface-0 p-5">
//       <div className="text-center font-normal text-alpha-800 text-xl">
//         Testimonials
//       </div>
//       <div className="font-bold text-green-800 text-6xl mb-4 text-center">
//         What Our Clients Say
//       </div>
//       <div className="text-900 text-1xl mb-6 text-center line-height-3">
//         We are proud to have helped families find the perfect household help.
//         Here's what some of them have to say about our service.
//       </div>

//       <div className="grid">
//         {testimonials.map((testimonial) => (
//           <div className="col-12 lg:col-4" key={testimonial.id}>
//             <div className="p-3 h-full">
//               <div
//                 className="shadow-1 p-6 h-full flex flex-column"
//                 style={{ borderRadius: "30px", backgroundColor: "#ebebeb" }}
//               >
//                 <div className="text-center">
//                   <img
//                     src={testimonial.avatar}
//                     className="h-40 w-40 p-2 mb-4 rounded-full mx-auto"
//                     alt={`Avatar of ${testimonial.name}`}
//                   />
//                 </div>
//                 <div className="p-4">
//                   <p className="text-center font-normal mt-2 text-gray-900">
//                     "{testimonial.message}"
//                   </p>
//                 </div>
//                 <div className="p-4 text-center  ">
//                   <p className=" 	font-bold mt-2 text-gray-600">
//                     - {testimonial.name}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Testimonials;

import { Avatar } from "primereact/avatar";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      avatar: "layout/test/esie.jpg",
      message:
        "I am very happy with the service. I was able to find a trustworthy and reliable nanny for my kids. I will definitely recommend this to my friends.",
      name: "Markyy",
    },
    {
      id: 2,
      avatar: "layout/test/ryan.jpg",
      message:
        "I needed someone to take care of my dog while I was away on vacation and KasambahayKo helped me find the perfect pet sitter. I will definitely use this service again in the future.",
      name: "Christopher",
    },
    {
      id: 3,
      avatar: "layout/test/rommel.jpg",
      message:
        "I was hesitant to try this service at first, but I'm so glad I did. The housekeeper I found through KasambahayKo is amazing and has made my life so much easier.",
      name: "Rommel",
    },
  ];

  return (
    <div id="Testimonials" className="surface-0 p-8">
      <div className="text-center font-normal text-alpha-800 text-xl">
        Testimonials
      </div>
      <div className="font-bold text-green-800 text-6xl mb-4 text-center">
        What Our Clients Say
      </div>
      <div className="text-900 text-1xl mb-6 text-center line-height-3">
        We are proud to have helped families find the perfect household help.
        Here's what some of them have to say about our service.
      </div>

      <div className="grid">
        {testimonials.map((testimonial) => (
          <div className="col-12 lg:col-4" key={testimonial.id}>
            <div className="p-3 h-full">
              <div
                className="shadow-1 p-6 h-full flex flex-column"
                style={{ borderRadius: "30px", backgroundColor: "#ebebeb" }}
              >
                <div className="flex-grow">
                  <p
                    className="text-center font-semibold text-gray-900 overflow-hidden"
                    style={{ maxHeight: "120px", textOverflow: "ellipsis" }}
                  >
                    "{testimonial.message}"
                  </p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <img
                    src={testimonial.avatar}
                    className="h-40 w-40 p-2 mb-4 rounded-full mx-auto m-1"
                    alt={`Avatar of ${testimonial.name}`}
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-600">
                    - {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
