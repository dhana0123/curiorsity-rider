// pages/api/topics.js
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
declare global {
  var mongoose: { conn: any; promise: any };
}

const MONGO_URI = "mongodb://localhost:27017/engineering"; // update with your URI

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

const topicSchema = new mongoose.Schema({
  domain: String,
  branch: String,
  course: String,
  topic: String,
  status: String,
});

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const topics = await Topic.find({});
  res.status(200).json(topics);
}
