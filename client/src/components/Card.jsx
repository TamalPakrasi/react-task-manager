import React from "react";

function Card({ className = "", children }) {
  return (
    <div className={`card border border-base-300 bg-base-200 ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;
