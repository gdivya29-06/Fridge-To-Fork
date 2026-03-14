import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  const teamMembers = [
  {
    name: 'Gummala Divya',
    
    description: ' Built the application from scratch — designed the UI, developed the backend API, integrated OpenRouter AI, and deployed all features end to end.'
  },
  {
    name: 'Cyna Benny',
    
    description: 'Tested the complete user experience across all features, identified usability issues, validated edge cases, and ensured the app works smoothly for all types of users.'
  },
  {
    name: 'Sujai Jaideep',
    
    description: 'Reviewed and analyzed research papers on Large Language Models and AI-based recipe generation, providing technical insights that shaped the AI prompting strategy.'
  }
];

  const techStack = [
    { name: 'React.js', icon: '⚛️', desc: 'Frontend UI' },
    { name: 'Node.js', icon: '🟢', desc: 'Backend Server' },
    { name: 'Express.js', icon: '⚡', desc: 'REST API' },
    { name: 'OpenRouter AI', icon: '🤖', desc: 'AI Engine' },
    { name: 'Firebase', icon: '🔥', desc: 'Auth & Database' },
    { name: 'Unsplash API', icon: '📸', desc: 'Recipe Images' },
  ];

  const features = [
    '📸 Photo ingredient detection using AI',
    '🌍 Multi-language recipe generation',
    '⚠️ Smart allergy filtering',
    '👨‍🍳 Real-time cooking assistant chatbot',
    '⭐ Save and manage favourite recipes',
    '🥗 Dietary preference customization',
    '🔐 Firebase authentication',
    '📖 Personal cookbook history',
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2e10 0%, #2d4a1e 50%, #4a7c2f 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(200,230,104,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍳</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
            About <span style={{ color: '#c8e668' }}>This Project</span>
          </h1>
          <p style={{ opacity: '0.85', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Built by 2nd Year B.Tech CSE (AIML) students at SRM Institute of Science and Technology
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem' }}>

        {/* About */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '2rem',
          marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
          border: '1px solid #c8d8b0'
        }}>
          <h2 style={{ fontWeight: '800', marginBottom: '1rem', color: '#2d4a1e', fontSize: '1.3rem' }}>
            🎯 About The Project
          </h2>
          <p style={{ color: '#3d5a2a', lineHeight: '1.8', marginBottom: '1rem' }}>
            The AI Smart Recipe Generator is a full-stack web application that uses artificial intelligence
            to generate personalized recipes based on ingredients provided by the user. Built as part of
            an AI subject project at SRM Institute of Science and Technology, this application demonstrates
            real-world use of Large Language Models (LLMs) in everyday applications.
          </p>
          <p style={{ color: '#3d5a2a', lineHeight: '1.8' }}>
            What makes our project unique is the combination of multiple AI-powered features — from detecting
            ingredients in photos to a real-time cooking assistant chatbot that helps users while they are cooking!
          </p>
        </div>

        {/* Key Features */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '2rem',
          marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
          border: '1px solid #c8d8b0'
        }}>
          <h2 style={{ fontWeight: '800', marginBottom: '1.2rem', color: '#2d4a1e', fontSize: '1.3rem' }}>
            ✨ Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.8rem' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                backgroundColor: '#f0f4ea',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                color: '#2d4a1e',
                fontWeight: '600',
                fontSize: '0.9rem',
                border: '1px solid #c8d8b0'
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '2rem',
          marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
          border: '1px solid #c8d8b0'
        }}>
          <h2 style={{ fontWeight: '800', marginBottom: '1.2rem', color: '#2d4a1e', fontSize: '1.3rem' }}>
            🛠️ Tech Stack
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {techStack.map((tech, index) => (
              <div key={index} style={{
                backgroundColor: '#f0f4ea',
                border: '2px solid #c8d8b0',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                minWidth: '120px',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#4a7c2f';
                  e.currentTarget.style.backgroundColor = '#e0ecd4';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#c8d8b0';
                  e.currentTarget.style.backgroundColor = '#f0f4ea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{tech.icon}</div>
                <div style={{ fontWeight: '700', color: '#2d4a1e', fontSize: '0.9rem' }}>{tech.name}</div>
                <div style={{ color: '#5a6e4a', fontSize: '0.8rem' }}>{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '2rem',
          marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
          border: '1px solid #c8d8b0'
        }}>
          <h2 style={{ fontWeight: '800', marginBottom: '1.2rem', color: '#2d4a1e', fontSize: '1.3rem' }}>
            👥 Meet The Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {teamMembers.map((member, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #1a2e10, #2d4a1e)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '2px solid #4a7c2f',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(74,124,47,0.3)';
                  e.currentTarget.style.borderColor = '#c8e668';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#4a7c2f';
                }}
              >
                <div style={{
                  fontSize: '2.5rem', marginBottom: '0.8rem',
                  background: 'rgba(200,230,104,0.15)',
                  width: '65px', height: '65px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 0.8rem auto',
                  border: '2px solid #c8e668'
                }}>
                  👩‍💻
                </div>
                <h3 style={{ fontWeight: '800', color: 'white', marginBottom: '0.3rem', fontSize: '1rem' }}>
                  {member.name}
                </h3>
                <p style={{ color: '#c8e668', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {member.role}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #e8f0e0, #d4e8b0)',
          borderRadius: '20px', padding: '2rem', textAlign: 'center',
          border: '1px solid #c8d8b0'
        }}>
          <h2 style={{ fontWeight: '800', color: '#1a2e10', marginBottom: '0.5rem' }}>
            Ready to Try It? 🚀
          </h2>
          <p style={{ color: '#5a6e4a', marginBottom: '1.5rem' }}>
            Generate your first AI recipe in seconds!
          </p>
          <Link to="/create" style={{
            background: 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
            color: 'white', padding: '0.9rem 2.5rem',
            borderRadius: '50px', textDecoration: 'none',
            fontWeight: '800', fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(74,124,47,0.3)',
            display: 'inline-block'
          }}>
            Start Cooking with AI →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;