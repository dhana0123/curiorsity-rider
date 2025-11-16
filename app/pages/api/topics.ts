import connectDB from "../lib/mongodb";
import TopicModel, { Topic } from "../modals/topics";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    const topics = await TopicModel.find({});
    res.status(200).json(topics);
  } else if (req.method === "POST") {
    const topic = new TopicModel(req.body as Partial<Topic>);
    await topic.save();
    res.status(201).json(topic);
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;
    const topic = await TopicModel.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(topic);
  } else {
    res.status(405).end();
  }
}
