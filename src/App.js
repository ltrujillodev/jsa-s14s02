import React, { useState } from "react";
import axios from "axios";

function App() {
  const [channelName, setChannelName] = useState("");
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyBt9Lwv8DZbB-m_gRrhHnJxbhRp0KbhFSs"; // Reemplaza con tu clave de API
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setVideos([]);

    try {
      // Paso 1: Buscar el canal por nombre
      const channelResponse = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: {
          part: "snippet",
          q: channelName,
          type: "channel",
          key: API_KEY,
        },
      });

      if (channelResponse.data.items.length === 0) {
        throw new Error("No se encontró ningún canal con ese nombre.");
      }

      const channelId = channelResponse.data.items[0].id.channelId;

      // Paso 2: Obtener los videos del canal
      const videosResponse = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: {
          part: "snippet",
          channelId: channelId,
          maxResults: 10,
          type: "video",
          key: API_KEY,
        },
      });

      setVideos(videosResponse.data.items);
    } catch (err) {
      setError(err.message || "Error al realizar la búsqueda.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Buscador de Videos de YouTube</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Ingresa el nombre del canal"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          style={{ width: "300px", padding: "10px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Buscar
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {videos.map((video, index) => (
          <div key={index} style={{ margin: "10px", textAlign: "center" }}>
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                style={{ width: "320px", height: "180px", objectFit: "cover" }}
              />
            </a>
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
