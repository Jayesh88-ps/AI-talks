import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["blog", "podcast"],
    default: "blog",
  },
  category: {
    type: String,
    default: "General",
  },
  authorType: {
    type: String,
    default: "ai",
  },
  authorName: {
    type: String,
    default: "AI-Blogger",
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
  },
  supportImage: {
    type: String,
  },
  readTime: {
    type: Number,
    default: 3,
  },
  conversation: {
    type: [
      {
        role: String,       // "question" or "answer"
        speaker: String,    // "AI-Host" or "AI-Guest"
        text: String,
      },
    ],
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Blog", blogSchema);
