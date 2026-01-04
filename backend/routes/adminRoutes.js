import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  patchCourse,
  deleteCourse,
  addTopic,
  replaceTopics,
  deleteTopic,
  getCoursesAsJson,
  bulkImportCourses,
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes with JWT authentication
router.use(authenticateToken);

// Course CRUD operations
router.get("/courses", getCourses);
router.get("/courses/json", getCoursesAsJson);
router.get("/courses/:id", getCourseById);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.patch("/courses/:id", patchCourse);
router.delete("/courses/:id", deleteCourse);

// Topic operations
router.post("/courses/:id/topics", addTopic);
router.put("/courses/:id/topics", replaceTopics);
router.delete("/courses/:id/topics/:topicIndex", deleteTopic);

// Bulk operations
router.post("/courses/bulk", bulkImportCourses);

export default router;

