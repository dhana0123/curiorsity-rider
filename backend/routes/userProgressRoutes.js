import express from "express";
import {
  getUserProgress,
  updateUserProgress,
  getUserStreak,
} from "../controllers/userProgressController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with JWT authentication
router.use(authenticateToken);

// Get user progress
router.get("/", getUserProgress);

// Update user progress
router.post("/update", updateUserProgress);

export default router;
