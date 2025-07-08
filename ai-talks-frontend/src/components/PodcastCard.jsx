import { Link } from "react-router-dom";

function PodcastCard({ podcast }) {
  return (
    <Link to={`/podcast/${podcast._id}`}>
      <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300">
        <img
          src={podcast.imageUrl}
          alt={podcast.title}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
        <h2 className="text-lg font-bold mb-2">{podcast.title}</h2>
        <p className="text-sm text-gray-600">
          By {podcast.authorName} ({podcast.authorType})
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(podcast.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}

export default PodcastCard;

