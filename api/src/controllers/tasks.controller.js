import tasksService from "../services/tasks.service.js";

// @desc    GET get dashboard data
// @route   GET /api/tasks/dashboard-data
// @access  private (auth user)
export const getDashboradData = async (req, res, next) => {};

// @desc    GET get user dashboard data
// @route   GET /api/tasks/user-dashboard-data
// @access  private (auth user)
export const getUserDashboardData = async (req, res, next) => {};

// @desc    PUT update task status of a specific task
// @route   PUT /api/tasks/status?id=<id>
// @access  private (auth user)
export const updateTaskStatus = async (req, res, next) => {};

// @desc    PUT update task checklist of a specific task
// @route   PUT /api/tasks/todo?id=<id>
// @access  private (auth user)
export const updateTaskCheckList = async (req, res, next) => {};

// @desc    GET get tasks
// @route   GET /api/tasks or /api/tasks?status=<pending | in_progress | completed>
// @access  private (auth user)
export const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;

    const [tasks, statusSummary] = await tasksService().getAll({
      assignedTo: req.user._id,
      role: req.user.role,
      sts: status,
    });

    return res.sendJSON(
      200,
      "Tasks Fetched Successfully",
      tasks,
      statusSummary
    );
  } catch (error) {
    await next(error);
  }
};

// @desc    GET get a specific task
// @route   GET /api/tasks?id=<id>
// @access  private (auth user)
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.query;

    const task = await tasksService().getById(id);

    return res.sendJSON(200, `Task With Id (${id}) Fetched Successfilly`, task);
  } catch (error) {
    await next(error);
  }
};

// @desc    PUT update a task
// @route   PUT /api/tasks?id=<id>
// @access  private (auth user)
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.query;

    const updatedTask = await tasksService().update(id, req.body);

    return res.sendJSON(200, "Task Updated Successfully", updatedTask);
  } catch (error) {
    await next(error);
  }
};

// @desc    DELETE delete a task
// @route   DELETE /api/tasks?id=<id>
// @access  private (admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.query;

    await tasksService().delete(id);

    return res.sendJSON(200, `Task Deleted Successfully`);
  } catch (error) {
    await next(error);
  }
};

// @desc    POST create a task
// @route   POST /api/tasks
// @access  private (admin only)
export const createTask = async (req, res, next) => {
  try {
    const task = await tasksService().create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.sendJSON(201, "Task Created Successfully", task);
  } catch (error) {
    await next(error);
  }
};
