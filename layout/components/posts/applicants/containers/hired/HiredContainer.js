import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { HiredService } from "@/layout/service/HiredService";

const HiredContainer = ({ postId }) => {
  const [hiredApplicant, setHiredApplicant] = useState({});

  useEffect(() => {
    const fetchHiredApplicant = async () => {
      const response = await HiredService.getHiredApplicant(postId);
      setHiredApplicant(response);
    };

    fetchHiredApplicant();
  }, [postId]);

  if (!hiredApplicant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10">
      <div className="flex items-center">
        <img
          src="/layout/hire-success.png"
          alt="Hiring Successful"
          className="h-60"
        />
        <div>
          <h2>Hiring Successful</h2>
          <p className="m-0 text-xl font-medium">
            Congratulations!! You hired{" "}
            <a>
              <span>
                {hiredApplicant.first_name + " " + hiredApplicant.last_name}
              </span>
            </a>
          </p>
          <p className="text-sm">
            You can now view your booking details and contact your worker
            anytime.
          </p>
          <Button
            label="CANCEL"
            outlined
            severity="secondary"
            className="mr-2"
          />
          <Button
            label="VIEW BOOKING"
            icon="pi pi-chevron-right"
            iconPos="right"
          />
        </div>
      </div>
      {/* <div className="">
        <h5>Offer Overview</h5>
        <div>
          <ul>
            <li>Salary: {offer.salary}</li>
            <li>Pay Frequency: {offer.payFrequency}</li>
            <li>Benefits: </li>
            <ul>
              {offer.benefits.map((benefit) => (
                <li className="ml-4" key={benefit}>
                  {benefit}
                </li>
              ))}
            </ul>
          </ul>
        </div>
      </div>
      <h5>Work Details</h5>
      <ul>
        <li>Job Title: Part-time Nanny for 2 children</li>
        <li>Department: Child Care</li>
        <li>Location: General Luna St, Buntay, Abuyog, Leyte</li>
      </ul>
      <button>Continue</button> */}
    </div>
  );
};

export default HiredContainer;
