import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bandsApi } from '../../api/bands.api';
import { postsApi } from '../../api/posts.api';
import { PostCard } from '../../components/PostCard';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Badge } from '../../components/Badge';
import { Band, Post } from '../../types';
import { colors, spacing, typography } from '../../theme/theme';
import { FeedStackScreenProps } from '../../navigation/types';

export function BandProfileScreen({
  route,
  navigation,
}: FeedStackScreenProps<'BandProfile'>) {
  const { bandId } = route.params;
  const [band, setBand] = useState<Band | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [bandResult, postsResult] = await Promise.all([
          bandsApi.getById(bandId),
          postsApi.list({ bandId, limit: 20 }),
        ]);
        setBand(bandResult);
        setPosts(postsResult.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [bandId]);

  if (loading) return <LoadingScreen />;
  if (!band) {
    return (
      <View style={styles.center}>
        <Text style={typography.bodyMuted}>No encontramos esta banda.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        />
      )}
      ListHeaderComponent={
        <View>
          {band.bannerUrl ? (
            <Image source={{ uri: band.bannerUrl }} style={styles.banner} />
          ) : (
            <View style={[styles.banner, styles.bannerPlaceholder]} />
          )}

          <View style={styles.headerBody}>
            <Text style={styles.name}>{band.name}</Text>
            <Badge label={band.genre} />

            {band.bio ? <Text style={styles.bio}>{band.bio}</Text> : null}

            <View style={styles.socials}>
              {band.instagramUrl ? (
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(band.instagramUrl!)}
                >
                  📷 Instagram
                </Text>
              ) : null}
              {band.facebookUrl ? (
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(band.facebookUrl!)}
                >
                  👍 Facebook
                </Text>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Publicaciones</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>Esta banda todavía no publicó nada.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { paddingBottom: spacing.xl },
  banner: { width: '100%', height: 180 },
  bannerPlaceholder: { backgroundColor: colors.surfaceAlt },
  headerBody: { padding: spacing.lg },
  name: { ...typography.h1, marginBottom: spacing.xs },
  bio: { ...typography.body, marginTop: spacing.md, lineHeight: 21 },
  socials: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  link: {
    ...typography.bodyMuted,
    color: colors.accent,
  },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  empty: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
