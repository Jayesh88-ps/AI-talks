import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs`);
        const found = res.data.find(b => b._id === id);
        setBlog(found);
      } catch (err) {
        console.error("Error loading blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {blog.imageUrl && (
        <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-xl mb-4" />
      )}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        By <strong>{blog.authorName}</strong> ({blog.authorType}) —{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="text-gray-800 leading-relaxed text-md">
        {blog.content}
      </div>
    </div>
  );
}

export default BlogDetail;
