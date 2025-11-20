// @desc GET get user profile
// @route GET /api/profile
export const get = async (req, res, next) => {
  return res.sendJSON({ msg: "profile" }, 201);
};

// @desc PUT update user profile
// @route PUT /api/profile
export const update = async (req, res, next) => {};
