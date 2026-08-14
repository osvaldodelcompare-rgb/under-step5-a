import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Post } from '../types';
import { Badge } from './Badge';
import { colors, radius, spacing, typography, postTypeColors } from '../theme/theme';
import { formatEventDate, formatPrice, postTypeLabels } from '../utils/format';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const coverImage = post.mediaUrls?.[0];
  const eventDate = formatEventDate(post.eventDate);
  const price = formatPrice(post.price);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverPlaceholderText}>UNDERGROUND</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Badge
            label={postTypeLabels[post.postType] ?? post.postType}
            color={postTypeColors[post.postType] ?? colors.primary}
          />
          {post.venue ? (
            <Text style={styles.venueName} numberOfLines={1}>
              {post.venue.name}
            </Text>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>

        <Text style={styles.content} numberOfLines={2}>
          {post.content}
        </Text>

        <View style={styles.footerRow}>
          {eventDate ? <Text style={styles.footerText}>{eventDate}</Text> : null}
          {price ? <Text style={styles.footerPrice}>{price}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
  cover: {
    width: '100%',
    height: 160,
  },
  coverPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    color: colors.textFaint,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 13,
  },
  body: {
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  venueName: {
    ...typography.caption,
    flexShrink: 1,
    marginLeft: spacing.sm,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  content: {
    ...typography.bodyMuted,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.accent,
  },
  footerPrice: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
});
