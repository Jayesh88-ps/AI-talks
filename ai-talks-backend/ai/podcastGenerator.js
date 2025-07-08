// ✅ podcastGenerator.js – AI-Driven, Conversational, Human-Tone Podcast Generator

import axios from "axios";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_BASE_URL = process.env.HUGGINGFACE_BASE_URL;

// === Call OpenRouter ===
const callOpenRouter = async (prompt, model = "mistral-7b") => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
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

// === Hugging Face SDXL Image Generator ===
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

// === Step 1: Brainstorm 3 Podcast Topics ===
const getUniquePodcastTopics = async () => {
  const prompt = `List 3 engaging podcast topics that spark curiosity and resonate with lifestyle, growth, or the future of AI/tech.
Avoid news headlines. Make them suitable for a conversational, fun podcast with emotional depth.`;
  const content = await callOpenRouter(prompt);
  return content
    .split("\n")
    .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
};

// === Step 2: Generate Conversational Podcast Script ===
const generatePodcastScript = async (title) => {
  const prompt = `
Simulate a podcast titled: "${title}"

Characters:
- AI-Host: Curious, funny, warm
- AI-Guest: Insightful, humorous, emotional

Format:
- Intro
- 6 question-answer pairs
- Reflection ending

Tone:
Motivational, witty, like a smart podcast (e.g., Chris Williamson or HelpBnk). Use this exact format:
AI-Host: ...
AI-Guest: ...
Return only the conversation.`;

  return await callOpenRouter(prompt);
};

// === Step 3: Generate Image Prompts ===
const generateImagePrompts = async (title) => {
  const prompt = `
Suggest two AI image prompts for a podcast titled "${title}":
1. Eye-catching podcast thumbnail
2. Conceptual visual to explain the theme`;
  const response = await callOpenRouter(prompt);
  return response
    .split("\n")
    .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 2);
};

// === Step 4: Main Podcast Generator ===
export const generateAllPodcasts = async () => {
  try {
    const topics = await getUniquePodcastTopics();

    for (const title of topics) {
      const exists = await Blog.findOne({ title, type: "podcast" });
      if (exists) {
        console.log(`⏩ Skipping existing podcast: ${title}`);
        continue;
      }

      const script = await generatePodcastScript(title);
      if (!script || !script.includes("AI-Host") || script.length < 300) {
        console.log(`⚠️ Skipping invalid podcast: ${title}`);
        continue;
      }

      // Structure conversation
      const conversation = script
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("AI-Host:") || line.startsWith("AI-Guest:"))
        .map((line) => {
          const [speaker, ...rest] = line.split(":");
          return {
            role: speaker.trim() === "AI-Host" ? "question" : "answer",
            speaker: speaker.trim(),
            text: rest.join(":").trim(),
          };
        });

      if (conversation.length < 6) {
        console.log(`⚠️ Skipping short podcast: ${title}`);
        continue;
      }

      // Image Generation
      const imagePrompts = await generateImagePrompts(title);
      const [imageUrl, imageExplainUrl] = await Promise.all([
        callHuggingFaceSDXL(imagePrompts[0]),
        callHuggingFaceSDXL(imagePrompts[1]),
      ]);

      // Read Time = Roughly 1 min per Q&A
      const readTime = Math.ceil(conversation.length / 2);

      // Save to MongoDB
      const podcast = new Blog({
        title,
        content: script,
        authorType: "ai",
        authorName: "AI-Talks Duo",
        tags: ["Podcast", "Growth", "Mindset"],
        imageUrl,
        supportImage: imageExplainUrl,
        type: "podcast",
        readTime,
        conversation,
        createdAt: new Date(),
      });

      await podcast.save();
      console.log(`✅ Podcast saved: ${title}`);
    }
  } catch (err) {
    console.error("❌ Podcast Generation Failed:", err.message);
  }
};




