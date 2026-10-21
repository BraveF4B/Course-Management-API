import prisma from "../db.js";
import AppError from "../utils/AppError.js";

const authenticate = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return next(
        new AppError("Please log in first", 401)
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return next(
        new AppError("User account not found", 401)
      );
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;