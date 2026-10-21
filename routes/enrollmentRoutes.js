import { Router } from "express";
import { getMyCourses } from "../controllers/enrollmentController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get(
  "/my-courses",
  authenticate,
  authorize("STUDENT"),
  getMyCourses
);

export default router;