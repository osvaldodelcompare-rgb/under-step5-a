import React, { useEffect, useState } from 'react';
import { postsApi } from '../api/posts.api';
import { PostCard } from '../components/PostCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { Button } from '../components/Button';
import { Post } from '../types';

const PAGE_LIMIT = 12;

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await postsApi.list({ page: 1, limit: PAGE_LIMIT });
        setPosts(result.data);
        setTotalPages(result.meta.totalPages);
        setPage(result.meta.page);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const result = await postsApi.list({
        page: page + 1,
        limit: PAGE_LIMIT,
      });
      setPosts((prev) => [...prev, ...result.data]);
      setTotalPages(result.meta.totalPages);
      setPage(result.meta.page);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      {posts.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            marginTop: 48,
          }}
        >
          Todavía no hay publicaciones. ¡Volvé pronto!
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {page < totalPages ? (
        <div style={{ maxWidth: 240, margin: '32px auto 0' }}>
          <Button variant="secondary" onClick={handleLoadMore} loading={loadingMore}>
            Cargar más
          </Button>
        </div>
      ) : null}
    </div>
  );
}
