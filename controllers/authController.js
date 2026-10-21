import prisma from "../db.js";
import AppError from "../utils/AppError.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Email and password are required", 400)
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return next(
        new AppError("Invalid email or password", 401)
      );
    }

    // req.session.userId = user.id;

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const studentDashboard = async (req, res, next) => {
  try {
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
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};


export const courseDashboard = async (req, res, next) => {
  try {
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
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
