import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4">
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-44 object-cover rounded-xl mb-4"
          />
        )}
        <h2 className="text-xl font-bold mb-1 line-clamp-2">{blog.title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          By <strong>{blog.authorName}</strong> ({blog.authorType})
        </p>
      </div>
    </Link>
  );
}

export default BlogCard;

