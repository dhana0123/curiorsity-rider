import express from "express";
import {getCourses} from "../controllers/courseController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with JWT authentication
router.use(authenticateToken);

router.get("/", getCourses);

export default router;
