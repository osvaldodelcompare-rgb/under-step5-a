import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { roleLabels } from '../theme/tokens';
import { useNavigate } from 'react-router-dom';

export function MyProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '48px auto',
        padding: '0 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          background: 'var(--color-primary-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>

      <h2 style={{ margin: '0 0 4px' }}>{user.name}</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
        {user.email}
      </p>

      <Badge label={roleLabels[user.role] ?? user.role} />

      {user.favoriteGenres.length > 0 ? (
        <div style={{ marginTop: 28 }}>
          <p
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              color: 'var(--color-text-faint)',
              marginBottom: 10,
            }}
          >
            Géneros favoritos
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {user.favoriteGenres.map((genre) => (
              <Badge key={genre} label={genre} color="var(--color-accent)" />
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 40 }}>
        <Button variant="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
