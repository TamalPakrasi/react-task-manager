import dashboardServices from "../services/dashboard.service.js";

// @desc    GET get dashboard summary
// @route   GET /api/dashboard/summary
// @access  private (auth user)
export const summary = async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    const summary = await dashboardServices().summary({ userId: _id, role });

    return res.sendJSON(200, "Dashboard Summary Fetched Successfully", summary);
  } catch (error) {
    await next(error);
  }
};
