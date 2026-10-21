import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents
} from "../controllers/courseController.js";
import { enrollInCourse } from "../controllers/enrollmentController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();


router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/:id/enroll", authenticate,authorize("STUDENT"),enrollInCourse);

router.post("/",authenticate,authorize("INSTRUCTOR"),createCourse);

router.patch("/:id",authenticate,authorize("INSTRUCTOR"),updateCourse);

router.get("/:id/students",authenticate,authorize("INSTRUCTOR"),getCourseStudents);

router.delete("/:id",authenticate,authorize("INSTRUCTOR", "ADMIN"),deleteCourse);

export default router;