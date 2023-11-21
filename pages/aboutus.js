import Head from "next/head";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

const AboutUs = () => {
  return (
    <div>
      <div className="text-center p-5">
        <h1 className="text-5xl font-bold text-900">About Us</h1>
      </div>
      <div className="grid">
        <div className="font-medium text-3xl text-900 text-center">
          <div className="flex justify-content-center flex-wrap">
            <div className="col-12 md:col-6">
              <div className="text-xl p-5 shadow-2">
                <p>
                  "Our mission is to streamline the search for the perfect care
                  services, providing peace of mind to our users. We are
                  committed to connecting individuals and families with
                  dedicated and skilled service providers, ensuring the
                  well-being and happiness of their loved ones. Our platform is
                  designed to simplify the process of finding high-quality care,
                  making it accessible, safe, and efficient. We strive to
                  empower our users to make informed choices, fostering trust
                  and satisfaction in every care service experience."
                </p>
              </div>
            </div>
            <div className="col-12 sm:col-6">
              <div className="text-xl p-5 shadow-2">
                <p>
                  "Our vision is to be the leading and most trusted platform for
                  care services, recognized for our dedication to excellence,
                  safety, and convenience. We aspire to create a world where
                  finding the perfect care services is as easy as a click away.
                  Kasambahayko envisions a community of users who can rely on
                  our platform to access a diverse range of exceptional care
                  services, offered by skilled and compassionate service
                  providers. We aim to set new standards in the care services
                  industry, making a positive impact on the lives of individuals
                  and families by providing a seamless and caring experience."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default AboutUs;
