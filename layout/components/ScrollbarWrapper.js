// ScrollbarWrapper.js

import React from "react";

const ScrollbarWrapper = ({ scrollTop, onScroll, children }) => {
  return (
    <div
      style={{ height: "100vh", overflow: "auto" }}
      onScroll={onScroll} // Attach the onScroll event here
    >
      {children}
    </div>
  );
};

export default ScrollbarWrapper;
