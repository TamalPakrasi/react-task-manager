import { useState } from "react";

import useAxios from "@hooks/useAxios";
import useAlert from "@hooks/useAlert";

import { Download } from "lucide-react";

function DownloadButton({ api = "tasks" }) {
  const { get } = useAxios(true);
  const { error } = useAlert();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const { data: blob, headers } = await get({
        api: `/reports/exports/${api}`,
        config: {
          responseType: "blob",
        },
      });

      console.log(blob);

      console.log(headers);

      const filename = headers["content-disposition"]
        .split(";")
        .at(1)
        .split("=")
        .at(1)
        .replace(/^"|"$/g, "");

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error(
        err?.status
          ? `${err.status} - ${err.message}`
          : "500 - Internal Server Error"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      className={`btn btn-success btn-sm ${isDownloading ? "opacity-90" : ""}`}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? (
        "Downloading..."
      ) : (
        <>
          <Download size={15} /> Download Report
        </>
      )}
    </button>
  );
}

export default DownloadButton;
