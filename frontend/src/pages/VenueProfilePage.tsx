import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { venuesApi } from '../api/venues.api';
import { postsApi } from '../api/posts.api';
import { PostCard } from '../components/PostCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { Post, Venue } from '../types';

export function VenueProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [venueResult, postsResult] = await Promise.all([
          venuesApi.getById(Number(id)),
          postsApi.list({ venueId: Number(id), limit: 24 }),
        ]);
        setVenue(venueResult);
        setPosts(postsResult.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!venue) {
    return (
      <p style={{ textAlign: 'center', marginTop: 48 }}>
        No encontramos este lugar.
      </p>
    );
  }

  return (
    <div>
      {venue.bannerUrl ? (
        <img
          src={venue.bannerUrl}
          alt={venue.name}
          style={{ width: '100%', height: 260, objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: 200, background: 'var(--color-surface-alt)' }} />
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
        <h1 style={{ marginBottom: 4 }}>{venue.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
          {venue.neighborhood ? `${venue.neighborhood}, ` : ''}
          {venue.city}
        </p>

        {venue.description ? (
          <p style={{ lineHeight: 1.6, marginBottom: 20 }}>{venue.description}</p>
        ) : null}

        {venue.mpLink ? (
          <a
            href={venue.mpLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-accent)',
              marginBottom: 28,
            }}
          >
            💳 Pagar / apoyar con Mercado Pago
          </a>
        ) : null}

        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Publicaciones</h2>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>
            Este lugar todavía no publicó nada.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
