import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const popularIngredients = [
    '🍗 Chicken', '🥚 Eggs', '🍅 Tomato', '🧄 Garlic',
    '🧅 Onion', '🥛 Milk', '🧀 Cheese', '🥦 Broccoli',
    '🍚 Rice', '🍝 Pasta', '🥕 Carrot', '🫑 Bell Pepper'
  ];

  const features = [
    { icon: '📸', title: 'Photo Detection', description: 'Snap a photo of your ingredients and AI will detect them automatically!' },
    { icon: '🤖', title: 'AI Powered', description: 'Google Gemma AI generates creative and delicious recipes just for you!' },
    { icon: '🌍', title: 'Multi Language', description: 'Get recipes in Hindi, Tamil, Telugu, Spanish, French and more!' },
    { icon: '👨‍🍳', title: 'Cooking Assistant', description: 'Chat with AI while cooking — ask anything in real time!' },
    { icon: '⚠️', title: 'Allergy Filter', description: 'Select allergens and AI will never include them in your recipes!' },
    { icon: '⭐', title: 'Save Favourites', description: 'Save your favourite recipes and access them anytime!' }
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2e10 0%, #2d4a1e 50%, #4a7c2f 100%)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(200,230,104,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            marginBottom: '0.5rem',
            letterSpacing: '-1px',
          }}>
        Fridge To <span style={{ color: '#c8e668' }}>Fork</span>
          </h1>
          <p style={{
            fontSize: '1rem',
            opacity: '0.75',
            marginBottom: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500'
          }}>
            Trust AI, it cooks! 🍴
          </p>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: '0.9',
            lineHeight: '1.7'
          }}>
            Turn your ingredients into delicious recipes instantly!
            Just snap a photo or type ingredients and let AI do the magic 🪄
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/create" style={{
              backgroundColor: '#c8e668',
              color: '#1a2e10',
              padding: '0.9rem 2.2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(200,230,104,0.4)',
              display: 'inline-block'
            }}>
              🚀 Generate Recipes Now
            </Link>
            <Link to="/create" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '0.9rem 2.2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'inline-block'
            }}>
              📸 Upload Photo
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Ingredients */}
      <div style={{
        background: 'linear-gradient(135deg, #2d4a1e 0%, #4a7c2f 100%)',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '800',
            marginBottom: '0.3rem',
            color: 'white'
          }}>
            🌶️ Popular Ingredients
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Most commonly used ingredients in our recipes
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            {popularIngredients.map((ingredient, index) => (
              <span key={index} style={{
                backgroundColor: index % 2 === 0 ? '#c8e668' : 'rgba(255,255,255,0.1)',
                color: index % 2 === 0 ? '#1a2e10' : 'white',
                padding: '0.5rem 1.2rem',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: index % 2 === 0 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: index % 2 === 0 ? '0 3px 10px rgba(200,230,104,0.3)' : 'none'
              }}>
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          color: '#1a2e10'
        }}>
          Everything You Need to Cook Better 🍽️
        </h2>
        <p style={{ textAlign: 'center', color: '#5a6e4a', marginBottom: '3rem', fontSize: '1rem' }}>
          Packed with AI features to make cooking easier and more fun!
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
              border: '1px solid #c8d8b0',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              cursor: 'default'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(74,124,47,0.15)';
                e.currentTarget.style.borderColor = '#c8e668';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(74,124,47,0.08)';
                e.currentTarget.style.borderColor = '#c8d8b0';
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #e8f0e0, #f0f8d0)',
                width: '75px',
                height: '75px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '2px solid #8fad3f'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1a2e10', fontSize: '1.05rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#5a6e4a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e8f0e0 0%, #d4e8b0 100%)'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem', color: '#1a2e10' }}>
          Ready to Cook Something Amazing? 🍽️
        </h2>
        <p style={{ color: '#5a6e4a', marginBottom: '2rem', fontSize: '1rem' }}>
          Just enter your ingredients and let AI do the magic!
        </p>
        <Link to="/create" style={{
          background: 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
          color: 'white',
          padding: '0.9rem 2.5rem',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: '800',
          fontSize: '1.1rem',
          boxShadow: '0 4px 20px rgba(74,124,47,0.3)',
          display: 'inline-block'
        }}>
          Get Started Free →
        </Link>
      </div>
    </div>
  );
}

export default Home;