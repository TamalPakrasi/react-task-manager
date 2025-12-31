import reportsServices from "../services/reports.service.js";

// @desc    GET exporting tasks
// @route   GET /api/reports/exports/tasks
// @access  Private (admin only)
export const exportTasks = async (req, res, next) => {
  try {
    const workbook = await reportsServices().tasks();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );

    // return workbook.xlsx.write(res).then(() => {
    //   res.end();
    // });

    return await workbook.xlsx.write(res);
  } catch (error) {
    await next(error);
  }
};

// @desc    GET exporting users data
// @route   GET /api/reports/exports/users
// @access  Private (admin only)
export const exportUsers = async (req, res, next) => {
  try {
    const workbook = await reportsServices().users();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="user_tasks_report.xlsx"'
    );

    // return workbook.xlsx.write(res).then(() => {
    //   res.end();
    // });

    return await workbook.xlsx.write(res);
  } catch (error) {
    await next(error);
  }
};
