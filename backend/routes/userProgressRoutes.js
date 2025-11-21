import express from "express";
import {
  getUserProgress,
  updateUserProgress,
  getUserStreak,
} from "../controllers/userProgressController.js";

const router = express.Router();

// Get user progress
router.get("/:userId", getUserProgress);

// Update user progress
router.post("/:userId/update", updateUserProgress);

// Get user streak information
router.get("/:userId/streak", getUserStreak);

export default router;
