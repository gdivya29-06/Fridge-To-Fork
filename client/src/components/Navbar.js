import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar({ user }) {
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Recipe' },
    { path: '/cookbook', label: '📖 Cookbook' },
    { path: '/about', label: 'About' }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a2e10 0%, #2d4a1e 60%, #4a7c2f 100%)',
      padding: '0 2rem', height: '65px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 20px rgba(26,46,16,0.4)', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🍴</span>
        <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem' }}>
          Fridge to <span style={{ color: '#c8e668' }}>Fork</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {navLinks.map(({ path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} style={{
              color: isActive ? '#1a2e10' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem',
              padding: '0.4rem 1rem', borderRadius: '8px',
              backgroundColor: isActive ? '#c8e668' : 'transparent',
              transition: 'all 0.2s'
            }}>
              {label}
            </Link>
          );
        })}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginLeft: '0.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            👤 {user?.email?.split('@')[0]}
          </span>
          <button onClick={handleLogout} style={{
            backgroundColor: 'rgba(255,255,255,0.15)', color: 'white',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
            padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: '600',
            fontSize: '0.85rem', transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,0,0,0.3)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;