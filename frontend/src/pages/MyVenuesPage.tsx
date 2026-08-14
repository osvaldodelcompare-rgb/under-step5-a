import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { venuesApi } from '../api/venues.api';
import { LoadingScreen } from '../components/LoadingScreen';
import { Button } from '../components/Button';
import { Venue } from '../types';

export function MyVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await venuesApi.getMine();
        setVenues(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Mis lugares</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
            Los bares o locales que administrás en Underground.
          </p>
        </div>
        <div style={{ width: 160 }}>
          <Link to="/venues/new">
            <Button>+ Crear lugar</Button>
          </Link>
        </div>
      </div>

      {venues.length === 0 ? (
        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Todavía no tenés un lugar</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Creá el perfil de tu bar o local para empezar a publicar eventos,
            promos y novedades.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {venues.map((venue) => (
            <Link
              key={venue.id}
              to={`/venues/${venue.id}/edit`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
              }}
            >
              {venue.logoUrl ? (
                <img
                  src={venue.logoUrl}
                  alt={venue.name}
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: 'var(--color-primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {venue.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{venue.name}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {venue.neighborhood ? `${venue.neighborhood}, ` : ''}
                  {venue.city}
                </div>
              </div>
              <span style={{ color: 'var(--color-text-faint)', fontSize: 20 }}>
                ›
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
