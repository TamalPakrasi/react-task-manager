const validateTask = ({
  title,
  description,
  priority,
  dueDate,
  assignedTo = [],
  taskCheckList,
}) => {
  const errors = [];

  const date = dueDate.value.length > 0 ? new Date(dueDate.value) : null;

  if (typeof title.value === "string" && title.value.trim().length === 0) {
    errors.push({ title: "Invalid Title" });
  }

  if (
    typeof description.value === "string" &&
    description.value.trim().length === 0
  ) {
    errors.push({ description: "Invalid Description" });
  }

  if (!["low", "medium", "high"].includes(priority.value.trim())) {
    errors.push({ priority: "Invalid Priority" });
  }

  if (!(date instanceof Date)) errors.push({ dueDate: "Invalid Due Date" });

  if (assignedTo.value.length === 0)
    errors.push({ assignedTo: "Assigned To must not be empty" });

  if (taskCheckList.value.length === 0)
    errors.push({ taskCheckList: "Task CheckList must not be empty" });

  return errors;
};

export default validateTask;
