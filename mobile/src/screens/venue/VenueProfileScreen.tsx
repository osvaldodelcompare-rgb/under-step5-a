import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { venuesApi } from '../../api/venues.api';
import { postsApi } from '../../api/posts.api';
import { PostCard } from '../../components/PostCard';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Post, Venue } from '../../types';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { FeedStackScreenProps } from '../../navigation/types';

export function VenueProfileScreen({
  route,
  navigation,
}: FeedStackScreenProps<'VenueProfile'>) {
  const { venueId } = route.params;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [venueResult, postsResult] = await Promise.all([
          venuesApi.getById(venueId),
          postsApi.list({ venueId, limit: 20 }),
        ]);
        setVenue(venueResult);
        setPosts(postsResult.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [venueId]);

  if (loading) return <LoadingScreen />;
  if (!venue) {
    return (
      <View style={styles.center}>
        <Text style={typography.bodyMuted}>No encontramos este lugar.</Text>
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
          {venue.bannerUrl ? (
            <Image source={{ uri: venue.bannerUrl }} style={styles.banner} />
          ) : (
            <View style={[styles.banner, styles.bannerPlaceholder]} />
          )}

          <View style={styles.headerBody}>
            <Text style={styles.name}>{venue.name}</Text>
            <Text style={styles.location}>
              {venue.neighborhood ? `${venue.neighborhood}, ` : ''}
              {venue.city}
            </Text>

            {venue.description ? (
              <Text style={styles.description}>{venue.description}</Text>
            ) : null}

            {venue.mpLink ? (
              <Text
                style={styles.link}
                onPress={() => Linking.openURL(venue.mpLink!)}
              >
                💳 Pagar / apoyar con Mercado Pago
              </Text>
            ) : null}

            <Text style={styles.sectionTitle}>Publicaciones</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>Este lugar todavía no publicó nada.</Text>
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
  name: { ...typography.h1 },
  location: { ...typography.bodyMuted, marginBottom: spacing.sm },
  description: { ...typography.body, marginBottom: spacing.md, lineHeight: 21 },
  link: {
    ...typography.body,
    color: colors.accent,
    marginBottom: spacing.lg,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  empty: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
