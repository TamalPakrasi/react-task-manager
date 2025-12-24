const validateTask = ({
  title,
  description,
  priority,
  dueDate,
  assignedTo = [],
  taskCheckList,
}) => {
  const errors = [];

  if (typeof title.value === "string" && title.value.trim().length === 0) {
    errors.push({ title: "Invalid Title" });
  }

  if (
    typeof description.value === "string" &&
    description.value.trim().length === 0
  ) {
    errors.push({ description: "Invalid Description" });
  }

  if (!["Low", "Medium", "High"].includes(priority.value.trim())) {
    errors.push({ priority: "Invalid Priority" });
  }

  if (dueDate.value instanceof Date && isNaN(dueDate.value.getTime()))
    errors.push({ dueDate: "Invalid Due Date" });

  if (assignedTo.value.length === 0)
    errors.push({ assignedTo: "Assigned To must not be empty" });

  if (taskCheckList.value.length === 0)
    errors.push({ taskCheckList: "Task CheckList must not be empty" });

  return errors;
};

export default validateTask;
