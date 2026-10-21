import prisma from "../db.js";
import AppError from "../utils/AppError.js";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: { select: { id: true, name: true } },
      }
    });

    res.status(200).json({ results: courses.length, courses });
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        instructor: { select: { id: true, name: true } },
      }
    });

    if (!course) return next(new AppError("Course not found", 404));

    res.status(200).json({ course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim() ||
        typeof description !== "string" || !description.trim()) {
      return next(new AppError("Title and description are required", 400));
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        instructorId: req.user.id
      }
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (title === undefined && description === undefined)
      return next(new AppError("Enter a title or description", 400));

    if ((title !== undefined && (typeof title !== "string" || !title.trim())) ||
        (description !== undefined && (typeof description !== "string" || !description.trim()))) {
      return next(new AppError("Title and description must be valid text", 400));
    }

    const id = Number(req.params.id);
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) return next(new AppError("Course not found", 404));

    if (course.instructorId !== req.user.id)
      return next(new AppError("You can only update your own courses", 403));

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() })
      }
    });

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) return next(new AppError("Course not found", 404));

    if (req.user.role === "INSTRUCTOR" && course.instructorId !== req.user.id)
      return next(new AppError("You can only delete your own courses", 403));

    await prisma.course.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCourseStudents = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!course) return next(new AppError("Course not found", 404));

    if (course.instructorId !== req.user.id)
      return next(new AppError("You can only view students in your own courses", 403));

    res.status(200).json({
      course: { id: course.id, title: course.title },
      students: course.enrollments.map(({ student }) => student)
    });
  } catch (err) {
    next(err);
  }
};
