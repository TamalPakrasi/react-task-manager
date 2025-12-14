import React from "react";
import { RotateCcw } from "lucide-react";

import { Card } from "@components";

function ErrorState({ title, desc = "", onRetry }) {
  return (
    <div className="h-dvh flex-center">
      <Card>
        <h2 className="text-2xl text-center">{title}</h2>
        {desc.length > 0 && <h4 className="text-lg text-center">{desc}</h4>}

        <button
          className="btn btn-primary btn-sm w-fit mx-auto mt-5"
          onClick={onRetry}
        >
          Retry <RotateCcw />
        </button>
      </Card>
    </div>
  );
}

export default ErrorState;
