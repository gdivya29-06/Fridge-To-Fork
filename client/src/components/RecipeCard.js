import React, { useState } from 'react';

function RecipeCard({ recipe }) {
  const [showVideo, setShowVideo] = useState(false);

  // ✅ CLEAN YOUTUBE EMBED FUNCTION
  const getEmbedUrl = (url) => {
    if (!url) return "";

    const match = url.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return "";
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      
      <img
        src={recipe.imageUrl}
        alt={recipe.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
      />

      <h3 style={{ marginTop: '10px' }}>{recipe.name}</h3>

      <p>{recipe.description}</p>

      {/* BUTTON */}
      {recipe.youtubeUrl && (
        <button onClick={() => setShowVideo(!showVideo)}>
          {showVideo ? "Hide Video" : "Watch Video"}
        </button>
      )}

      {/* ✅ WORKING VIDEO */}
      {showVideo && getEmbedUrl(recipe.youtubeUrl) && (
        <iframe
          width="100%"
          height="200"
          src={getEmbedUrl(recipe.youtubeUrl)}
          title="YouTube video"
          frameBorder="0"
          allowFullScreen
        />
      )}
    </div>
  );
}

export default RecipeCard;

