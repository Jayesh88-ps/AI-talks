import express from "express";
import { createBlog, getAllBlogs } from "../controllers/blogController.js";

const router = express.Router();

// ✅ Middleware to allow only admin to POST
const adminMiddleware = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  const expectedKey = process.env.ADMIN_KEY;

  if (adminKey && adminKey === expectedKey) {
    next(); // allow access
  } else {
    res.status(403).json({ message: "Unauthorized: Admin key required" });
  }
};

// 🔓 Public route: Get all blogs
router.get("/", getAllBlogs);

// 🔐 Protected route: Create blog (AI or human)
router.post("/", adminMiddleware, createBlog);

export default router;

