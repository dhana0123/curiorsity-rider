import express from "express";
import {
  getUserProgress,
  updateUserProgress,
  getUserStreak,
} from "../controllers/userProgressController.js";

const router = express.Router();

// Get user progress
router.get("/", getUserProgress);

// Update user progress
router.post("/update", updateUserProgress);

export default router;
