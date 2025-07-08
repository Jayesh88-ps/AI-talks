// ✅ blogGenerator.js – Autonomous, Sectional, Emotional, Scalable
import axios from "axios";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_BASE_URL = process.env.HUGGINGFACE_BASE_URL;

// === OpenRouter API ===
const callOpenRouter = async (prompt) => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistral-7b", // Explicit lowercase model name
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices?.[0]?.message?.content || "";
};

// === Hugging Face SDXL ===
const callHuggingFaceSDXL = async (prompt) => {
  try {
    const response = await axios.post(
      HUGGINGFACE_BASE_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("Image generation failed:", err.message);
    return null;
  }
};

// === Sectional Blog Topic Generation ===
const getBlogIdeasByCategory = async (category, count) => {
  const prompt = `You are a trend-aware AI content strategist. Suggest ${count} unique, smart blog titles based on current events and insights.
But don't directly mention news — instead, reframe it with practical wisdom and creativity.
Category: ${category}
Tone: Emotional, inspirational, personal-growth-driven (like HelpBnk).
Avoid generic or repeated ideas.`;

  const response = await callOpenRouter(prompt);
  return response
    .split("\n")
    .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, count);
};

// === HelpBnk-style Blog Generator ===
const generateFullBlog = async (title) => {
  const prompt = `Write a blog titled: "${title}".
Make it sound like a HelpBnk email: emotionally engaging, personal-growth focused, casual, witty, and practical.
Structure: Hook, Story/Narrative, Insight, Motivation, Actionable Tip.`;
  return await callOpenRouter(prompt);
};

// === Image Prompting & Generation ===
const generateImagePrompts = async (title) => {
  const prompt = `Suggest two vivid image prompts for a blog titled "${title}".
1. Cover image idea (visual, attractive)
2. Supporting image idea (diagram/chart/metaphor)`;
  const response = await callOpenRouter(prompt);
  return response
    .split("\n")
    .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
    .slice(0, 2);
};

const generateImageUrls = async (prompts) => {
  const images = [];
  for (const prompt of prompts) {
    const img = await callHuggingFaceSDXL(prompt);
    images.push(img);
  }
  return images;
};

// === Main Function: Sectional Blog Generation ===
export const generateAllBlogs = async () => {
  const categories = [
    { label: "Startup Ecosystem", count: 2 },
    { label: "AI Ecosystem", count: 2 },
    { label: "Trending Topics", count: 3 },
  ];

  for (const category of categories) {
    const titles = await getBlogIdeasByCategory(category.label, category.count);

    for (const title of titles) {
      try {
        const exists = await Blog.findOne({ title, type: "blog" });
        if (exists) {
          console.log(`⏭️ Skipped existing blog: ${title}`);
          continue;
        }

        const content = await generateFullBlog(title);
        if (!content || content.length < 300) {
          console.log(`⚠️ Skipped short blog: ${title}`);
          continue;
        }

        const imagePrompts = await generateImagePrompts(title);
        const [coverImage, supportImage] = await generateImageUrls(imagePrompts);

        const blog = new Blog({
          title,
          content,
          category: category.label,
          authorType: "ai",
          authorName: "AI-Blogger",
          tags: [category.label, "Inspiration", "Growth"],
          readTime: Math.ceil(content.split(" ").length / 200),
          imageUrl: coverImage,
          supportImage,
          type: "blog",
          createdAt: new Date(),
        });

        await blog.save();
        console.log(`✅ Blog saved: ${title}`);
      } catch (err) {
        console.error(`❌ Blog error (${title}):`, err.message);
      }
    }
  }
};

