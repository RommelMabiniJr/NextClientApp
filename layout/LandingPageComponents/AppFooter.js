import React from "react";

const linkData = [
  {
    category: "About KasambahayKo",
    links: [
      { text: "Services", href: "/" },
      { text: "Pricing", href: "/" },
      { text: "Testimonials", href: "/" },
    ],
  },
  {
    category: "Services & Support",
    links: [
      { text: "Find a Nanny", href: "/" },
      { text: "Apply as Nanny", href: "/" },
      { text: "Contact Us", href: "/" },
    ],
  },
  {
    category: "Company",
    links: [
      { text: "About Us", href: "/" },
      { text: "Careers", href: "/aboutus" },
      { text: "Contact Us", href: "/" },
    ],
  },
];

export function FooterLinks() {
  return (
    <div className="mt-5">
      <footer className="bg-blue-100 pt-10 sm:mt-10 pt-10">
        <div className="max-w-6xl m-auto text-black-alpha-90 flex justify-content-center">
          {linkData.map((category, index) => (
            <div key={index} className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
              <div className="text-xs uppercase text-black-alpha-90 font-medium mb-4">
                {category.category}
              </div>
              {category.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="my-3 block text-black-alpha-90 hover:text-gray-100 text-sm font-medium duration-700"
                >
                  {link.text}
                </a>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default FooterLinks;
