// models
import * as TasksModel from "../models/Tasks.model.js";

class Dashboard {
  async summary({ userId, role }) {
    const assignedTo = role !== "admin" ? userId : null;

    const { overDueTasks, status, priority } = await TasksModel.getStats(
      assignedTo
    );

    const recentTasks = await TasksModel.getLatest(10, assignedTo);

    return {
      statistics: {
        ...status,
        overDueTasks,
      },
      charts: {
        status,
        priority,
      },
      recentTasks,
    };
  }
}

const dashboardServices = () => new Dashboard();

export default dashboardServices;
