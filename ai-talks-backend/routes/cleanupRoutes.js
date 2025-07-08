import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Admin middleware (reuse)
const adminMiddleware = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};

// DELETE DUPLICATE BLOGS & PODCASTS BY TITLE+TYPE (case-insensitive, keep newest)
router.delete("/cleanup", adminMiddleware, async (req, res) => {
  try {
    const allDocs = await Blog.find({}).sort({ createdAt: -1 });
    const seen = new Map();
    const duplicates = [];

    allDocs.forEach((doc) => {
      const key = `${doc.title.trim().toLowerCase()}-${doc.type}`;
      if (seen.has(key)) {
        duplicates.push(doc._id);
      } else {
        seen.set(key, true);
      }
    });

    await Blog.deleteMany({ _id: { $in: duplicates } });

    res.json({ message: `Deleted ${duplicates.length} duplicate blogs/podcasts.` });
  } catch (err) {
    res.status(500).json({ message: "Error cleaning up", error: err.message });
  }
});

export default router;
