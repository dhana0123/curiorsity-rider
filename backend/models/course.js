import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      index: true,
    },
    branch: {
      type: String,
      required: true,
      index: true,
    },
    courseKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    topics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
courseSchema.index({ domain: 1, branch: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;

