import AppError from "../utils/AppError.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Please log in first", 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to perform this action", 403)
      );
    }

    next();
  };
};

export default authorize;