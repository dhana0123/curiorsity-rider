import mongoose from "mongoose";

export interface Topic {
  _id: string;
  domain: string;
  branch: string;
  course: string;
  topic: string;
  status: "not-started" | "learning" | "completed";
  order?: number;
}

const topicSchema = new mongoose.Schema({
  domain: String,
  branch: String,
  course: String,
  topic: String,
  status: { type: String, default: "not-started" },
  order: Number,
});

export default mongoose.models.Topic || mongoose.model("Topic", topicSchema);
