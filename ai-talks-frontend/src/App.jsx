import { useEffect, useState } from "react";
import api from "./services/api";
import PodcastCard from "./components/PodcastCard"; // 👈 import
import BlogCard from "./components/BlogCard"; // if you separate BlogCard too

function App() {
  const [blogs, setBlogs] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs?type=blog");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err.message);
    }
  };

  const fetchPodcasts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs?type=podcast");
      const data = await res.json();
      setPodcasts(data);
    } catch (err) {
      console.error("Failed to fetch podcasts:", err.message);
    }
  };

  fetchBlogs();
  fetchPodcasts();
}, []);



  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AI-Talks 🧠 Blog</h1>

      {/* 📝 Blogs Section */}
      <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* 🎙️ Podcasts Section */}
      <h2 className="text-2xl font-semibold mb-4">AI Podcasts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast._id} podcast={podcast} />
        ))}
      </div>
    </div>
  );
}

export default App;


