import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
    domainId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

lessonProgressSchema.index({userId: 1, lessonId: 1}, {unique: true});

const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

export default LessonProgress;

