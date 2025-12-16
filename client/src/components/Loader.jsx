import React from "react";

function Loader({ size = "lg" }) {
  return (
    <div className="loader">
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}

export default Loader;
