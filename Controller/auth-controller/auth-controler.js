const jwt = require("jsonwebtoken");
const User = require("../../Models/user");
const { catchAsync, AppError } = require("../misc/errorHander");

module.exports = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError("No token Provided", 400));
  }

  const verify = jwt.verify(token, "gphgphgphgph");

  if (!verify) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!verify.changed) {
    return next(
      new AppError(
        "Please reset you password to login for the first time!!",
        401
      )
    );
  }

  const user = await User.findOne({ _id: verify._id });

  if (user.sessToken.indexOf(token) >= 0) {
    req.user = verify;
    return next();
  } else {
    return next(new AppError("Unauthorized", 401));
  }
});
