import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { postsApi } from '../../api/posts.api';
import { PostCard } from '../../components/PostCard';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Post } from '../../types';
import { colors, spacing, typography } from '../../theme/theme';
import { FeedStackScreenProps } from '../../navigation/types';

const PAGE_LIMIT = 10;

export function FeedScreen({ navigation }: FeedStackScreenProps<'Feed'>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (targetPage: number, replace: boolean) => {
    const result = await postsApi.list({ page: targetPage, limit: PAGE_LIMIT });
    setPosts((prev) => (replace ? result.data : [...prev, ...result.data]));
    setTotalPages(result.meta.totalPages);
    setPage(result.meta.page);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadPage(1, true);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadPage]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await loadPage(1, true);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLoadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      await loadPage(page + 1, false);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>UNDERGROUND</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Todavía no hay publicaciones. ¡Volvé pronto!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  brand: {
    ...typography.h2,
    letterSpacing: 1.5,
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  empty: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
