import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/Blog.js";

dotenv.config();

const cleanupBrokenPodcasts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const result = await Blog.deleteMany({
      type: "podcast",
      $or: [
        { conversation: { $exists: false } },
        { conversation: { $size: 0 } },
        { conversation: { $not: { $size: 4 } } }, // Less than 4 entries (optional)
      ],
    });

    console.log(`🧹 Deleted ${result.deletedCount} broken podcast(s)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup Failed:", err.message);
    process.exit(1);
  }
};

cleanupBrokenPodcasts();
