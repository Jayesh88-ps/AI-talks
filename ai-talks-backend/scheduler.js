// ✅ scheduler.js – Weekly AI Blog & Podcast Scheduler

import cron from "node-cron";
import dotenv from "dotenv";
import connectMongo from "./config/db.js";
import { generateAllBlogs } from "./ai/blogGenerator.js";
import { generateAllPodcasts } from "./ai/podcastGenerator.js";

dotenv.config();

// Step 1: Connect to MongoDB
connectMongo();

// Step 2: Run Every Saturday at 10:00 AM IST
cron.schedule(
  "0 10 * * 6",
  async () => {
    console.log("⏰ Scheduler Triggered: Starting Weekly Content Generation...\n");

    try {
      // Generate Blogs (7: 2 startup, 2 AI, 3 trending)
      await generateAllBlogs();

      // Generate Podcasts (3, human-like tone)
      await generateAllPodcasts();

      console.log("\n✅ All content generated successfully.");
    } catch (error) {
      console.error("❌ Scheduler Error:", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

console.log("✅ AI Blogger Scheduler is running and ready to trigger every Saturday 10 AM IST.");

