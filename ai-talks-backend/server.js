import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import mongoose from "mongoose";
import cleanupRoutes from "./routes/cleanupRoutes.js";



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use the router
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", cleanupRoutes);

app.get("/", (req, res) => {
  res.send("AI-Talks Backend is running 🧠");
});

// Removed auto-generation of AI content on server start. Use scripts or protected routes instead.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});


