import usersService from "../services/users.service.js";

// @desc    GET get all users
// @route   GET /api/users
// @access  private (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const usersWithTasksCounts = await usersService().getAll();

    return res.sendJSON(
      200,
      "Users Fetched Successfully",
      usersWithTasksCounts
    );
  } catch (error) {
    await next(error);
  }
};

// @desc    GET get a single user using id
// @route   GET /api/users?id=<userId>
// @access  private (auth user)
export const getUserById = async (req, res, next) => {};

// @desc    DELETE delete a single user using id
// @route   DELETE /api/users?id=<userId>
// @access  private (admin only)
export const deleteUser = async (req, res, next) => {};
