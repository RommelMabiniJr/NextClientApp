// Import AppNavbar component
import Navbar from "../layout/AppNavbar";
import ClientOnly from "../layout/components/ClientOnly";
import React, { useContext, useRef, useState } from "react";

const LandingPage = () => {
  return (
    <div className="surface-0 flex justify-content-center">
      {/*Allow Two-pass rendering */}
      <ClientOnly>
        <Navbar />
      </ClientOnly>
    </div>
  );
};

// Export the Landing Page component
export default LandingPage;
