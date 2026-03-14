import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import RecipeCard from '../components/RecipeCard';

function Cookbook({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const q = query(
        collection(db, 'recipes'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
    setLoading(false);
  };

  const deleteSession = async (id) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setHistory(history.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const cardStyle = {
    backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem',
    marginBottom: '1rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
    border: '1px solid #c8d8b0'
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a2e10', marginBottom: '0.5rem' }}>
          📖 My Cookbook
        </h1>
        <p style={{ color: '#5a6e4a' }}>All your AI generated recipes saved in one place!</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#4a7c2f', fontWeight: '600' }}>Loading your cookbook...</p>
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', ...cardStyle }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
          <h2 style={{ color: '#2d4a1e', marginBottom: '0.5rem' }}>Your cookbook is empty!</h2>
          <p style={{ color: '#5a6e4a', marginBottom: '1.5rem' }}>Generate some recipes and they'll appear here automatically</p>
          <a href="/create" style={{
            background: 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
            color: 'white', padding: '0.8rem 2rem', borderRadius: '12px',
            textDecoration: 'none', fontWeight: '700', fontSize: '1rem'
          }}>
            🚀 Generate Your First Recipe
          </a>
        </div>
      ) : (
        <div>
          <p style={{ color: '#5a6e4a', marginBottom: '1.5rem', fontWeight: '600' }}>
            📚 {history.length} cooking session{history.length > 1 ? 's' : ''} saved
          </p>
          {history.map((session) => (
            <div key={session.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#1a2e10', marginBottom: '0.2rem' }}>
                    🕒 {formatDate(session.createdAt)}
                  </p>
                  <p style={{ color: '#5a6e4a', fontSize: '0.85rem' }}>
                    Ingredients: <strong>{session.ingredients?.join(', ')}</strong>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    style={{
                      background: 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
                      color: 'white', border: 'none', borderRadius: '8px',
                      padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                    }}
                  >
                    {expandedSession === session.id ? '▲ Hide' : '▼ View Recipes'}
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    style={{
                      backgroundColor: '#fef2f2', color: '#dc2626',
                      border: '1px solid #fecaca', borderRadius: '8px',
                      padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {session.recipes?.map((recipe, i) => (
                  <span key={i} style={{
                    backgroundColor: '#e8f0e0', color: '#2d4a1e',
                    padding: '0.3rem 0.8rem', borderRadius: '20px',
                    fontSize: '0.85rem', fontWeight: '600', border: '1px solid #c8d8b0'
                  }}>
                    {recipe.name}
                  </span>
                ))}
              </div>

              {expandedSession === session.id && (
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {session.recipes?.map((recipe, i) => (
                    <RecipeCard key={i} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cookbook;