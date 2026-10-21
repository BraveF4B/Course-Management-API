import { Router } from "express";
import {
  login,
  studentDashboard,
  courseDashboard,
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/login", login);
router.get("/student", authenticate, studentDashboard);
router.get("/course", authenticate, courseDashboard);


export default router;