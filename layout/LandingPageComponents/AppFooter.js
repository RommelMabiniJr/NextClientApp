// import React from "react";

// const linkData = [
//   {
//     category: "About KasambahayKo",
//     links: [
//       { text: "Services", href: "/" },
//       { text: "Pricing", href: "/" },
//       { text: "Testimonials", href: "/" },
//     ],
//   },
//   {
//     category: "Services & Support",
//     links: [
//       { text: "Find a Nanny", href: "/" },
//       { text: "Apply as Nanny", href: "/" },
//       { text: "Contact Us", href: "/" },
//     ],
//   },
//   {
//     category: "Company",
//     links: [
//       { text: "About Us", href: "/" },
//       { text: "Careers", href: "/aboutus" },
//       { text: "Contact Us", href: "/" },
//     ],
//   },
// ];

// export function FooterLinks() {
//   return (
//     <div className="mt-5">
//       <footer className="bg-blue-100 pt-10 sm:mt-10 pt-10">
//         <div className="max-w-6xl m-auto text-black-alpha-90 flex justify-content-center">
//           {linkData.map((category, index) => (
//             <div key={index} className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
//               <div className="text-xs uppercase text-black-alpha-90 font-medium mb-4">
//                 {category.category}
//               </div>
//               {category.links.map((link, linkIndex) => (
//                 <a
//                   key={linkIndex}
//                   href={link.href}
//                   className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
//                 >
//                   {link.text}
//                 </a>
//               ))}
//             </div>
//           ))}
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default FooterLinks;

import React from "react";
// import { FaInstagram } from "react-icons/fa";
// import { FaTwitter } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";

import "primeicons/primeicons.css";

export function FooterLinks() {
  return (
    <>
      <div className="bg-gray-50 h-1/2 w-full flex md:flex-row flex-col justify-around items-start p-20">
        <div className="p-5 ">
          <ul>
            <p className="text-gray-800 font-bold text-3xl pb-2">
              KasambahayKo :
              <div className="text-blue-600">streamlining your search</div>
              <div className="text-blue-600">for the perfect care services</div>
            </p>
            <div className="flex gap-6 pb-5">
              <i className=" pi pi-instagram text-2xl cursor-pointer hover:text-yellow-600" />
              <i className="pi pi-twitter text-2xl cursor-pointer hover:text-blue-600" />
              <i className="pi pi-linkedin text-2xl cursor-pointer hover:text-blue-600" />
              <i className="pi pi-youtube text-2xl cursor-pointer hover:text-red-600" />
            </div>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="text-gray-800 font-bold text-2xl pb-4">About</p>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Stocks
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Trust & safety
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Privacy Policy{" "}
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {/* Fixed deposits */}
            </li>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="text-gray-800 font-bold text-2xl pb-4">Company</p>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              About
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Products
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Pricing
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {/* Careers */}
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {/* Press & Media */}
            </li>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="text-gray-800 font-bold text-2xl pb-4">Support</p>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Contact
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              FAQs
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              List Of Charges
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {/* Downloads & Resources */}
            </li>
            <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              {/* Videos */}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-center  p-5 bg-gray-50">
        <div className=" text-gray-800 font-semibold">
          © 2022-2023 All rights reserved | Build with ❤ by{" "}
          <span className="hover:text-blue-600 font-semibold cursor-pointer">
            StudentLink Solution{" "}
          </span>
        </div>
      </div>
    </>
  );
}

export default FooterLinks;
