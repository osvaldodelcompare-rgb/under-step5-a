import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { postsApi } from '../../api/posts.api';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Post } from '../../types';
import { colors, postTypeColors, radius, spacing, typography } from '../../theme/theme';
import { formatEventDate, formatPrice, postTypeLabels } from '../../utils/format';
import { FeedStackScreenProps } from '../../navigation/types';

export function PostDetailScreen({
  route,
  navigation,
}: FeedStackScreenProps<'PostDetail'>) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await postsApi.getById(postId);
        setPost(result);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  if (loading) return <LoadingScreen />;
  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={typography.bodyMuted}>No encontramos esta publicación.</Text>
      </View>
    );
  }

  const eventDate = formatEventDate(post.eventDate);
  const price = formatPrice(post.price);
  const coverImage = post.mediaUrls?.[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.cover} />
      ) : null}

      <View style={styles.body}>
        <Badge
          label={postTypeLabels[post.postType] ?? post.postType}
          color={postTypeColors[post.postType] ?? colors.primary}
        />

        <Text style={styles.title}>{post.title}</Text>

        {post.venue ? (
          <Pressable
            onPress={() =>
              navigation.navigate('VenueProfile', { venueId: post.venue!.id })
            }
          >
            <Text style={styles.venueLink}>📍 {post.venue.name}</Text>
          </Pressable>
        ) : null}

        {post.band ? (
          <Pressable
            onPress={() =>
              navigation.navigate('BandProfile', { bandId: post.band!.id })
            }
          >
            <Text style={styles.venueLink}>🎸 {post.band.name}</Text>
          </Pressable>
        ) : null}

        <View style={styles.metaRow}>
          {eventDate ? <Text style={styles.metaText}>{eventDate}</Text> : null}
          {price ? <Text style={styles.metaPrice}>{price}</Text> : null}
        </View>

        <Text style={styles.contentText}>{post.content}</Text>

        {post.ticketLink ? (
          <Button
            label="Conseguir entradas"
            onPress={() => Linking.openURL(post.ticketLink!)}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: '100%',
    height: 240,
  },
  body: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  venueLink: {
    ...typography.body,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: { ...typography.body },
  metaPrice: { ...typography.body, fontWeight: '700', color: colors.accent },
  contentText: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
});
