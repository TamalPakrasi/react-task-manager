import React from "react";

function Loader({ size = "lg", className = "loader" }) {
  return (
    <div className={className}>
      <span
        className={`loading loading-spinner text-primary loading-${size}`}
      ></span>
    </div>
  );
}

export default Loader;
