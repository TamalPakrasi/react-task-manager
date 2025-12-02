import exceljs from "exceljs";

// models
import * as UsersModel from "../models/Users.model.js";
import * as TasksModel from "../models/Tasks.model.js";

class Reports {
  #data;

  #createWorkbook(sheetName, columns, rows) {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    rows.forEach((row) => worksheet.addRow(row));

    return workbook;
  }

  #formatAssignedUsers(assignedTo) {
    if (!Array.isArray(assignedTo) || assignedTo.length === 0)
      return "Unassigned";

    return assignedTo
      .map(({ username, email }) => `${username} ${email}`)
      .join(", ");
  }

  async tasks() {
    this.#data = await TasksModel.find({});

    const columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    const rows = this.#data.map((task) => ({
      _id: String(task._id).replace(/^"|"$/g, ""),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: this.#formatAssignedUsers(task.assignedTo),
    }));

    return this.#createWorkbook("Tasks Report", columns, rows);
  }

  async users() {
    this.#data = await UsersModel.findMembers();

    const columns = [
      { header: "User Id", key: "_id", width: 25 },
      { header: "User name", key: "username", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Tasks Assigned", key: "allCount", width: 20 },
      { header: "Pending Tasks Assigned", key: "pendingCount", width: 20 },
      {
        header: "In Progress Tasks Assigned",
        key: "inProgressCount",
        width: 20,
      },
      { header: "Completed Tasks Assigned", key: "completedCount", width: 20 },
    ];

    const rows = this.#data.map((user) => ({
      _id: String(user._id).replace(/^"|"$/g, ""),
      username: user.username,
      email: user.email,
      allCount: user.allCount,
      pendingCount: user.pendingCount,
      inProgressCount: user.inProgressCount,
      completedCount: user.completedCount,
    }));

    return this.#createWorkbook("User Tasks Report", columns, rows);
  }
}

const reportsServices = () => new Reports();

export default reportsServices;
