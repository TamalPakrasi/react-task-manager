import React from "react";

import { useParams } from "react-router-dom";

function updateTask() {
  const { id } = useParams();

  return <div>updateTask</div>;
}

export default updateTask;
