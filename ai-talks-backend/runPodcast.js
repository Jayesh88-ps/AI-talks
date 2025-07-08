import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateAIPodcast } from "./ai/podcastGenerator.js";
import Blog from "./models/Blog.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const podcastCount = await Blog.countDocuments({
    type: "podcast",
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });

  if (podcastCount >= 3) {
    console.log("⛔ Weekly podcast limit (3) reached. Skipping generation.");
  } else {
    await generateAIPodcast();
  }

  process.exit();
};

run();



