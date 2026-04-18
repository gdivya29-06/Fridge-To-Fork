import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function RecipeCard({ recipe, onFavourite, isFavourite, onSelectForChat, isSelected, onShare, isSelectedForShopping, onToggleShopping, user }) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(recipe.userRating || 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  
  const getEmbedUrl = (url) => { if (!url) return ""; const match = url.match(/[?&]v=([^&]+)/); if (match && match[1]) { return `https://www.youtube.com/embed/${match[1]}`; } return ""; };

  const handleRating = async (star) => {
    setRating(star);
    if (user) {
      try {
        const ratingId = `${user.uid}_${recipe.name.replace(/\s+/g, '_')}`;
        await setDoc(doc(db, 'ratings', ratingId), {
          userId: user.uid,
          recipeName: recipe.name,
          rating: star,
          ratedAt: new Date()
        });
      } catch (err) {
        console.log('Could not save rating:', err);
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: isSelected
        ? '0 0 0 3px #4a7c2f, 0 15px 30px rgba(74,124,47,0.2)'
        : '0 4px 20px rgba(74,124,47,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: isSelected ? '2px solid #4a7c2f' : '1px solid #c8d8b0',
    }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(74,124,47,0.15)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(74,124,47,0.1)';
        }
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'; }}
        />
        <button onClick={() => onFavourite && onFavourite(recipe)} style={{
          position: 'absolute', top: '10px', right: '10px',
          backgroundColor: 'white', border: '2px solid #4a7c2f',
          borderRadius: '50%', width: '40px', height: '40px',
          fontSize: '1.2rem', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isFavourite ? '⭐' : '☆'}
        </button>

        {isSelected && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            backgroundColor: '#4a7c2f', color: 'white',
            padding: '0.3rem 0.8rem', borderRadius: '20px',
            fontSize: '0.8rem', fontWeight: '700'
          }}>
            🤖 Chatting about this
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, rgba(26,46,16,0.6))' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1a2e10' }}>
          {recipe.name}
        </h3>

        {/* Star Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => handleRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              style={{
                fontSize: '1.3rem', cursor: 'pointer',
                color: star <= (hoveredStar || rating) ? '#f59e0b' : '#d1d5db',
                transition: 'color 0.1s, transform 0.1s',
                transform: star <= (hoveredStar || rating) ? 'scale(1.2)' : 'scale(1)',
                display: 'inline-block'
              }}>★</span>
          ))}
          <span style={{ fontSize: '0.8rem', color: '#5a6e4a', fontWeight: '600', marginLeft: '0.3rem' }}>
            {rating > 0 ? `${rating}/5` : 'Rate this recipe'}
          </span>
        </div>

        <p style={{ color: '#5a6e4a', fontSize: '0.9rem', marginBottom: '0.8rem', lineHeight: '1.5' }}>
          {recipe.description}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#2d4a1e', fontWeight: '700', backgroundColor: '#e8f0e0', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
            🔥 {recipe.calories}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: '700', backgroundColor: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
            🍽️ {recipe.servings} servings
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          {recipe.dietaryTags && recipe.dietaryTags.map((tag, index) => (
            <span key={index} style={{
              backgroundColor: index % 2 === 0 ? '#e8f0e0' : '#fef3c7',
              color: index % 2 === 0 ? '#2d4a1e' : '#92400e',
              padding: '0.2rem 0.6rem', borderRadius: '20px',
              fontSize: '0.8rem', fontWeight: '600',
              border: index % 2 === 0 ? '1px solid #c8d8b0' : '1px solid #fde68a'
            }}>{tag}</span>
          ))}
        </div>

        {/* Shopping List Checkbox */}
        {onToggleShopping && (
          <div onClick={() => onToggleShopping(recipe)} style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer',
            backgroundColor: isSelectedForShopping ? '#f0fdf4' : '#f7f9f4',
            border: isSelectedForShopping ? '2px solid #4a7c2f' : '2px solid #e2e8f0',
            marginBottom: '0.5rem', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
              border: isSelectedForShopping ? '2px solid #4a7c2f' : '2px solid #c8d8b0',
              backgroundColor: isSelectedForShopping ? '#4a7c2f' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}>
              {isSelectedForShopping && <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '800' }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isSelectedForShopping ? '#2d4a1e' : '#5a6e4a' }}>
              {isSelectedForShopping ? '✅ Added to shopping list' : '🛒 Add to shopping list'}
            </span>
          </div>
        )}

        {/* Action Buttons Row: Chat + Share */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button onClick={() => onSelectForChat && onSelectForChat(recipe)} style={{
            flex: 1, padding: '0.6rem',
            background: isSelected ? 'linear-gradient(135deg, #1a2e10, #2d4a1e)' : 'linear-gradient(135deg, #e8f0e0, #d4e8b0)',
            color: isSelected ? 'white' : '#2d4a1e',
            border: '2px solid #4a7c2f', borderRadius: '10px',
            cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s'
          }}>
            {isSelected ? '🤖 Chatting' : '💬 Ask AI'}
          </button>

          <button onClick={() => onShare && onShare(recipe)} style={{
            flex: 1, padding: '0.6rem',
            background: 'linear-gradient(135deg, #e0f0ff, #bfdbfe)',
            color: '#1e40af',
            border: '2px solid #93c5fd', borderRadius: '10px',
            cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s'
          }}>
            🔗 Share Recipe
          </button>
        </div>

        {/* YouTube Button */}
        {recipe.youtubeUrl && (
          <button onClick={() => setShowVideo(!showVideo)} style={{
            width: '100%', padding: '0.6rem',
            background: showVideo ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #ff4444, #cc0000)',
            color: 'white', border: 'none', borderRadius: '10px',
            cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
            marginBottom: '0.5rem', transition: 'all 0.2s',
            boxShadow: '0 3px 10px rgba(220,38,38,0.3)'
          }}>
            {showVideo ? '✕ Hide Video' : '▶ Watch on YouTube'}
          </button>
        )}

        {/* YouTube Embed */}
        {showVideo && recipe.youtubeUrl && (
          <div style={{ marginBottom: '0.8rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <iframe
              width="100%"
              height="200"
              src={getEmbedUrl(recipe.youtubeUrl)}
              title={`${recipe.name} recipe video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          </div>
        )}

        {/* Expand Button */}
        <button onClick={() => setExpanded(!expanded)} style={{
          width: '100%', padding: '0.7rem',
          background: expanded ? 'linear-gradient(135deg, #1a2e10, #2d4a1e)' : 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
          color: 'white', border: 'none', borderRadius: '10px',
          cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
          transition: 'all 0.2s', boxShadow: '0 3px 10px rgba(74,124,47,0.3)'
        }}>
          {expanded ? '▲ Hide Recipe' : '▼ View Full Recipe'}
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1a2e10' }}>📝 Ingredients</h4>
            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
              {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.3rem', lineHeight: '1.5' }}>{ing}</li>
              ))}
            </ul>

            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1a2e10' }}>👨‍🍳 Instructions</h4>
            <ol style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
              {recipe.instructions && recipe.instructions.map((step, index) => (
                <li key={index} style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.5rem', lineHeight: '1.6' }}>{step}</li>
              ))}
            </ol>

            {recipe.tips && (
              <div style={{ background: 'linear-gradient(135deg, #e8f0e0, #fef3c7)', padding: '0.8rem 1rem', borderRadius: '10px', borderLeft: '4px solid #4a7c2f' }}>
                <p style={{ fontSize: '0.85rem', color: '#2d4a1e', fontWeight: '700' }}>💡 Tip: {recipe.tips}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
