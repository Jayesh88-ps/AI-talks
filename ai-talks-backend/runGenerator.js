import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateAIContent } from "./ai/blogGenerator.js";
import Blog from "./models/Blog.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const blogCount = await Blog.countDocuments({
      type: "blog",
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    if (blogCount >= 7) {
      console.log("⛔ Weekly blog limit (7) reached. Skipping generation.");
    } else {
      await generateAIContent();
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error during blog generation:", err.message);
    process.exit(1);
  }
};


run();
