import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function PodcastDetail() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await api.get(`/blogs`);
        const foundPodcast = res.data.find(
          (item) => item._id === id && item.type === "podcast"
        );
        setPodcast(foundPodcast);
      } catch (err) {
        console.error("Failed to fetch podcast:", err);
      }
    };

    fetchPodcast();
  }, [id]);

  if (!podcast) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{podcast.title}</h1>
      <img
        src={podcast.imageUrl}
        alt={podcast.title}
        className="w-full h-60 object-cover rounded-xl mb-4"
      />
      <p className="text-gray-600 mb-4">
        By {podcast.authorName} ({podcast.authorType}) on{" "}
        {new Date(podcast.createdAt).toLocaleDateString()}
      </p>

      <div className="space-y-4">
        {podcast.conversation?.map((line, index) => (
          <div key={index}>
            <p className={`font-semibold ${line.role === "question" ? "text-blue-700" : "text-green-700"}`}>
              {line.speaker}:
            </p>
            <p className="ml-4 text-gray-800">{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PodcastDetail;

