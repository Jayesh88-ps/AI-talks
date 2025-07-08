import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs?type=blog");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err.message);
      }
    };

    const fetchPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs?type=podcast");
        setPodcasts(res.data);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err.message);
      }
    };

    fetchBlogs();
    fetchPodcasts();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI-Talks 🧠 Blog</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li key={blog._id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-600">By {blog.authorName} ({blog.authorType})</p>
                <p className="mt-2 text-gray-800 line-clamp-3">{blog.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">AI Podcasts</h2>
        {podcasts.length === 0 ? (
          <p>No podcasts found.</p>
        ) : (
          <ul className="space-y-4">
            {podcasts.map((podcast) => (
              <li key={podcast._id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{podcast.title}</h3>
                <p className="text-sm text-gray-600">By {podcast.authorName} ({podcast.authorType})</p>
                <div className="mt-2">
                  {podcast.conversation?.slice(0, 4).map((line, index) => (
                    <p key={index}>
                      <strong>{line.speaker}:</strong> {line.text}
                    </p>
                  ))}
                  <p className="text-sm text-blue-500 mt-2">...listen more</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
