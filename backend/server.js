import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {automobile_courses} from "./courses.js";
import userProgressRoutes from "./routes/userProgressRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/curiosity-rider";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/progress", userProgressRoutes);

// Courses routes
app.get("/api/courses", (req, res) => {
  res.json(automobile_courses);
});

app.get("/api/courses/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const course = automobile_courses[courseId];

  if (!course) {
    return res.status(404).json({error: "Course not found"});
  }

  res.json(course);
});

// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
