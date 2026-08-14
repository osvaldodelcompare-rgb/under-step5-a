import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApi } from '../api/posts.api';
import { LoadingScreen } from '../components/LoadingScreen';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Post } from '../types';
import { postTypeColors, postTypeLabels } from '../theme/tokens';
import { formatEventDate, formatPrice } from '../utils/format';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await postsApi.getById(Number(id));
        setPost(result);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!post) {
    return (
      <p style={{ textAlign: 'center', marginTop: 48 }}>
        No encontramos esta publicación.
      </p>
    );
  }

  const eventDate = formatEventDate(post.eventDate);
  const price = formatPrice(post.price);
  const cover = post.mediaUrls?.[0];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 48px' }}>
      {cover ? (
        <img
          src={cover}
          alt={post.title}
          style={{
            width: '100%',
            height: 320,
            objectFit: 'cover',
            borderRadius: 'var(--radius-lg)',
            marginTop: 24,
          }}
        />
      ) : null}

      <div style={{ marginTop: 24 }}>
        <Badge
          label={postTypeLabels[post.postType] ?? post.postType}
          color={postTypeColors[post.postType]}
        />
        <h1 style={{ marginTop: 12, marginBottom: 8 }}>{post.title}</h1>

        {post.venue ? (
          <Link
            to={`/venues/${post.venue.id}`}
            style={{ color: 'var(--color-accent)', display: 'block', marginBottom: 20 }}
          >
            📍 {post.venue.name}
          </Link>
        ) : null}

        {(eventDate || price) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 20,
            }}
          >
            <span>{eventDate}</span>
            {price ? <strong style={{ color: 'var(--color-accent)' }}>{price}</strong> : null}
          </div>
        )}

        <p style={{ lineHeight: 1.6, color: 'var(--color-text)' }}>{post.content}</p>

        {post.ticketLink ? (
          <div style={{ maxWidth: 280, marginTop: 24 }}>
            <Button onClick={() => window.open(post.ticketLink!, '_blank')}>
              Conseguir entradas
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
