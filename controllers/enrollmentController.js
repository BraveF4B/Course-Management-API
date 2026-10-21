import prisma from "../db.js";
import AppError from "../utils/AppError.js";

export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user.id,
        courseId: course.id
      },
      include: {
        course: true
      }
    });

    res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: req.user.id
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      results: enrollments.length,
      courses: enrollments.map((enrollment) => ({
    //     ...enrollment.course,
    //     enrolledAt: enrollment.enrolledAt
      }))
    });
  } catch (err) {
    next(err);
  }
};