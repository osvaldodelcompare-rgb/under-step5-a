import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BandSignupLink } from './BandSignupLink';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-background)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 1.5,
            color: 'var(--color-primary)',
          }}
        >
          UNDERGROUND
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            Feed
          </Link>
          <BandSignupLink />

          {isAuthenticated ? (
            <>
              <Link
                to="/venues/mine"
                style={{ color: 'var(--color-text-muted)', fontSize: 14 }}
              >
                Mis lugares
              </Link>
              <Link
                to="/posts/new"
                style={{ color: 'var(--color-text-muted)', fontSize: 14 }}
              >
                Publicar
              </Link>
              <Link
                to="/profile"
                style={{
                  color: 'var(--color-text)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {user?.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-faint)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-text)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
