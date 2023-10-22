import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import Link from "next/link";

const AboutUs = () => {
  const header = <img alt="Kasambahay ko Logo" src="/layout/logo.pg" />;

  const footer = (
    <Link href="/register">
      <Button
        label="Join Us"
        icon="pi pi-envelope"
        className="p-button-rounded p-button-secondary"
      />
    </Link>
  );

  return (
    <div
      className="p-d-flex p-jc-center p-ai-center p-mt-6"
      style={{ backgroundColor: "#F5F5F5", height: "100vh" }}
    >
      <div className="p-grid p-justify-center">
        <div className="p-col-12 p-md-8 p-lg-6">
          <Card
            header={header}
            footer={footer}
            className="p-shadow-24"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="text-5xl font-bold" style={{ color: "#1E90FF" }}>
              <p className="p-m-0">About Us</p>
              <Divider style={{ backgroundColor: "#1E90FF" }} />
            </div>
            <div>
              <p className="p-m-0" style={{ color: "#333333" }}>
                We are a platform that connects employers with caretakers,
                making it easier for both parties to find the right match.
              </p>
              <Divider style={{ backgroundColor: "#1E90FF" }} />
              <p className="p-m-0" style={{ color: "#333333" }}>
                Our mission is to simplify the process of finding a caretaker or
                employer, and to provide a safe and reliable platform for both
                parties.
              </p>
              <Divider style={{ backgroundColor: "#1E90FF" }} />
              <p className="p-m-0" style={{ color: "#333333" }}>
                Contact us to learn more about how we can help you find the
                right match
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
