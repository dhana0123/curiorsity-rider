import express from "express";
import {
  getLessonProgress,
  completeLesson,
  updateLessonStatus,
} from "../controllers/lessonController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with JWT authentication
router.use(authenticateToken);

router.get("/", getLessonProgress);
router.get("/:userId", getLessonProgress);
router.get("/:userId/:lessonId", getLessonProgress);
router.post("/complete", completeLesson);
router.post("/status", updateLessonStatus);

export default router;

