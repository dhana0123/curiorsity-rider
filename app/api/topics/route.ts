// app/api/items/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import TopicModel from "../../modals/topics";

export async function GET(req: NextRequest) {
  await connectDB();
  const items = await TopicModel.find({});
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const result = await TopicModel.create(body);
  return NextResponse.json(result);
}
