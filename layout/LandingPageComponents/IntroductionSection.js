import React from "react";
import { Button } from "primereact/button";

export function IntroductionSection() {
  return (
    <div
      id="introductionSection"
      className="flex flex-col justify-center m-8 lg:flex-row lg:justify-between"
    >
      <div className="grid card grid-cols-12 bg-teal-100">
        <div className="col-span-12 md:col-span-6 lg:w-1/3 p-6 text-center md:text-left flex flex-col justify-center">
          <img
            src="/layout/cleaning.svg"
            className="w-full"
            alt="Service Offered"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:w-2/3 p-6 text-center md:text-left flex flex-col justify-center">
          <div>
            <h2 className="text-6xl font-bold text-black-alpha-90 mb-5">
              Your trust, security, and satisfaction are our top priorities
            </h2>
            <p className="text-800 text-black-alpha-90 mb-5 line-height-3 text-justify overflow-hidden">
              KasambahayKo is a hybrid on-demand gig platform that connects you
              to a network of pre-screened, qualified, and trustworthy
              household, pet, and elderly care professionals. Our goal is to
              make it easier for you to find the right person to help you with
              your household tasks so you can focus on what matters most.
            </p>

            {/* <Button
              label="About Us"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => {
                router.push("/aboutus");
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroductionSection;
