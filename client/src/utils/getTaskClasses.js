export const getStatusClass = (status, isOverDue) => {
  if (isOverDue) return "text-error";

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

export const getStatusBadgeClass = (status, isOverDue) => {
  if (isOverDue) return "badge-error";

  switch (status) {
    case "Pending":
      return "badge-primary";
    case "In Progress":
      return "badge-info";
    case "Completed":
      return "badge-success";
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case "Low":
      return "badge-success";
    case "Medium":
      return "badge-warning";
    case "High":
      return "badge-error";
  }
};
