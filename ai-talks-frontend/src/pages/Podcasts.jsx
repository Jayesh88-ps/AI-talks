import { useEffect, useState } from "react";
import { fetchPodcasts } from "../services/blogService";
import PodcastCard from "../components/PodcastCard";

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPodcasts();
      setPodcasts(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AI-Talks 🎙️ Podcasts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast._id} podcast={podcast} />
        ))}
      </div>
    </div>
  );
}

export default Podcasts;
