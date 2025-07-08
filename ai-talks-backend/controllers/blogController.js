import Blog from "../models/Blog.js";

// @desc    Create a new blog or podcast
// @route   POST /api/blogs
// @access  Public
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      authorType,
      authorName,
      tags,
      imageUrl,
      type,
      conversation, // for podcast
    } = req.body;

    // Validate podcast-specific fields
    if (type === "podcast") {
      if (!conversation || !Array.isArray(conversation)) {
        return res
          .status(400)
          .json({ message: "Podcast must include a valid conversation array." });
      }
    }

    const blog = new Blog({
      title,
      content,
      authorType,
      authorName,
      tags,
      imageUrl,
      type,
      conversation,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// @desc    Get all blogs or podcasts
// @route   GET /api/blogs?type=podcast
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

