import LessonProgress from "../models/lessonProgress.js";
import UserProgress from "../models/userProgress.js";

export const getLessonProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || "default";
    const lessonId = req.params.lessonId || req.query.lessonId;

    if (lessonId) {
      const progress = await LessonProgress.findOne({userId, lessonId});
      res.json(progress || {status: "not_started"});
    } else {
      const progress = await LessonProgress.find({userId});
      res.json(progress);
    }
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

export const completeLesson = async (req, res) => {
  try {
    const userId = req.body.userId || "default";
    const {
      lessonId,
      courseId,
      branchId,
      domainId,
      xpEarned = 10,
    } = req.body;

    if (!lessonId || !courseId || !branchId || !domainId) {
      return res.status(400).json({error: "Missing required fields"});
    }

    let lessonProgress = await LessonProgress.findOne({userId, lessonId});

    if (!lessonProgress) {
      lessonProgress = new LessonProgress({
        userId,
        lessonId,
        courseId,
        branchId,
        domainId,
        status: "completed",
        completedAt: new Date(),
        xpEarned,
      });
    } else {
      lessonProgress.status = "completed";
      lessonProgress.completedAt = new Date();
      lessonProgress.xpEarned = xpEarned;
    }

    await lessonProgress.save();

    let userProgress = await UserProgress.findOne({userId});
    if (!userProgress) {
      userProgress = new UserProgress({userId});
    }
    await userProgress.updateProgress(xpEarned);

    res.json({
      lessonProgress,
      userProgress,
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

export const updateLessonStatus = async (req, res) => {
  try {
    const userId = req.body.userId || "default";
    const {lessonId, status, courseId, branchId, domainId} = req.body;

    if (!lessonId || !status) {
      return res.status(400).json({error: "Missing required fields"});
    }

    let lessonProgress = await LessonProgress.findOne({userId, lessonId});

    if (!lessonProgress) {
      if (!courseId || !branchId || !domainId) {
        return res.status(400).json({error: "Missing course information"});
      }
      lessonProgress = new LessonProgress({
        userId,
        lessonId,
        courseId,
        branchId,
        domainId,
        status,
      });
    } else {
      lessonProgress.status = status;
      if (status === "completed" && !lessonProgress.completedAt) {
        lessonProgress.completedAt = new Date();
      }
    }

    await lessonProgress.save();
    res.json(lessonProgress);
  } catch (error) {
    console.error("Error updating lesson status:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

