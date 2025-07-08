import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

export const fetchBlogs = async (type = "blog") => {
  try {
    const response = await axios.get(`${API_URL}?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const fetchPodcasts = async () => {
  try {
    const response = await axios.get(`${API_URL}?type=podcast`);
    return response.data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};
