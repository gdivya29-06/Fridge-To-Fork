import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email!');
      else if (err.code === 'auth/wrong-password') setError('Wrong password!');
      else if (err.code === 'auth/email-already-in-use') setError('Email already registered!');
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters!');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address!');
      else setError('Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2e10 0%, #2d4a1e 50%, #4a7c2f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px',
        padding: '3rem', width: '100%', maxWidth: '440px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍳</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1a2e10', margin: 0 }}>
            Fridge To <span style={{ color: '#4a7c2f' }}>Fork</span>
          </h1>
          <p style={{ color: '#5a6e4a', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            Trust AI, it cooks! 🍴
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', backgroundColor: '#e8f0e0',
          borderRadius: '12px', padding: '0.3rem', marginBottom: '2rem'
        }}>
          <button onClick={() => { setIsLogin(true); setError(''); }} style={{
            flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none',
            background: isLogin ? 'linear-gradient(135deg, #2d4a1e, #4a7c2f)' : 'transparent',
            color: isLogin ? 'white' : '#5a6e4a',
            fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'
          }}>
            Login
          </button>
          <button onClick={() => { setIsLogin(false); setError(''); }} style={{
            flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none',
            background: !isLogin ? 'linear-gradient(135deg, #2d4a1e, #4a7c2f)' : 'transparent',
            color: !isLogin ? 'white' : '#5a6e4a',
            fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'
          }}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        {!isLogin && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '600', color: '#2d4a1e', fontSize: '0.9rem' }}>Full Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '2px solid #c8d8b0', fontSize: '1rem', outline: 'none', marginTop: '0.3rem', boxSizing: 'border-box', backgroundColor: '#f7f9f4' }}
              onFocus={e => e.target.style.borderColor = '#4a7c2f'}
              onBlur={e => e.target.style.borderColor = '#c8d8b0'}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#2d4a1e', fontSize: '0.9rem' }}>Email Address</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '2px solid #c8d8b0', fontSize: '1rem', outline: 'none', marginTop: '0.3rem', boxSizing: 'border-box', backgroundColor: '#f7f9f4' }}
            onFocus={e => e.target.style.borderColor = '#4a7c2f'}
            onBlur={e => e.target.style.borderColor = '#c8d8b0'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: '600', color: '#2d4a1e', fontSize: '0.9rem' }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password (min 6 characters)"
            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '2px solid #c8d8b0', fontSize: '1rem', outline: 'none', marginTop: '0.3rem', boxSizing: 'border-box', backgroundColor: '#f7f9f4' }}
            onFocus={e => e.target.style.borderColor = '#4a7c2f'}
            onBlur={e => e.target.style.borderColor = '#c8d8b0'}
          />
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '1rem',
          background: loading ? '#a8c48a' : 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
          color: 'white', border: 'none', borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '800', fontSize: '1.1rem',
          boxShadow: '0 4px 15px rgba(74,124,47,0.3)'
        }}>
          {loading ? '⏳ Please wait...' : isLogin ? '🚀 Login' : '🎉 Create Account'}
        </button>

        <p style={{ textAlign: 'center', color: '#5a6e4a', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: '#4a7c2f', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;