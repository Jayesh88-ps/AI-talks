import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogDetail from './pages/BlogDetail';
import PodcastDetail from "./pages/PodcastDetail";
import Podcasts from "./pages/Podcasts"; // ✅ If you've created the Podcasts list page

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/podcast/:id" element={<PodcastDetail />} />
      <Route path="/podcasts" element={<Podcasts />} /> {/* Optional */}
    </Routes>
  </BrowserRouter>
);

