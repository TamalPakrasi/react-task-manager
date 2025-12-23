import React from "react";

function Image({ img = null }) {
  return <img src={img ?? "/user.png"} />;
}

export default Image;
