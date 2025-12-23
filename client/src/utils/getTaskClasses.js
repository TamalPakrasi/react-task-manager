export const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "text-[#5c1d70cc]";
    case "In Progress":
      return "text-[#0969b0cc]";
    case "Completed":
      return "text-[#22c55e]";
  }
};

export const getPriorityClass = (priority) => {
  switch (priority) {
    case "Low":
      return "text-[#22c55e]";
    case "Medium":
      return "text-[#f59e0b]";
    case "High":
      return "text-[#e11d48]";
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "primary";
    case "In Progress":
      return "info";
    case "Completed":
      return "success";
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "error";
  }
};
