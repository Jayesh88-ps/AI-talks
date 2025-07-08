// deleteDuplicates.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/Blog.js";

dotenv.config();

const deleteDuplicateTitles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Find all blogs and podcasts, sorted by newest first
    const allDocs = await Blog.find({}).sort({ createdAt: -1 });
    const seen = new Map();
    const duplicatesToDelete = [];

    for (const doc of allDocs) {
      // Use both title and type for uniqueness
      const key = `${doc.title.trim().toLowerCase()}-${doc.type}`;
      if (seen.has(key)) {
        // Keep the newest, delete the rest
        duplicatesToDelete.push(doc._id);
      } else {
        seen.set(key, true);
      }
    }

    if (duplicatesToDelete.length > 0) {
      const result = await Blog.deleteMany({ _id: { $in: duplicatesToDelete } });
      console.log(`🧹 Deleted ${result.deletedCount} duplicate blog(s)/podcast(s)`);
    } else {
      console.log("✅ No duplicates found");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Deletion failed:", err.message);
    process.exit(1);
  }
};

// Only run this script directly, not on import
if (require.main === module) {
  deleteDuplicateTitles();
}
