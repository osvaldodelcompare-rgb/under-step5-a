import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Badge } from './Badge';
import { postTypeColors, postTypeLabels } from '../theme/tokens';
import { formatEventDate, formatPrice } from '../utils/format';

export function PostCard({ post }: { post: Post }) {
  const cover = post.mediaUrls?.[0];
  const eventDate = formatEventDate(post.eventDate);
  const price = formatPrice(post.price);

  return (
    <Link
      to={`/posts/${post.id}`}
      style={{
        display: 'block',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {cover ? (
        <img
          src={cover}
          alt={post.title}
          style={{ width: '100%', height: 170, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: 170,
            background: 'var(--color-surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-faint)',
            fontWeight: 800,
            letterSpacing: 2,
            fontSize: 13,
          }}
        >
          UNDERGROUND
        </div>
      )}

      <div style={{ padding: 'var(--space-md)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}
        >
          <Badge
            label={postTypeLabels[post.postType] ?? post.postType}
            color={postTypeColors[post.postType]}
          />
          {post.venue ? (
            <span
              style={{
                fontSize: 12,
                color: 'var(--color-text-faint)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginLeft: 8,
              }}
            >
              {post.venue.name}
            </span>
          ) : null}
        </div>

        <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{post.title}</h3>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 14,
            color: 'var(--color-text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.content}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {eventDate ? (
            <span style={{ fontSize: 12, color: 'var(--color-accent)' }}>
              {eventDate}
            </span>
          ) : (
            <span />
          )}
          {price ? (
            <span style={{ fontSize: 12, fontWeight: 700 }}>{price}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
