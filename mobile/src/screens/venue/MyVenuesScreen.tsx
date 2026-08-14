import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { venuesApi } from '../../api/venues.api';
import { Button } from '../../components/Button';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Venue } from '../../types';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { ProfileStackScreenProps } from '../../navigation/types';

export function MyVenuesScreen({ navigation }: ProfileStackScreenProps<'MyVenues'>) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVenues = useCallback(async () => {
    try {
      const result = await venuesApi.getMine();
      setVenues(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadVenues();
    }, [loadVenues]),
  );

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis lugares</Text>
        <Text style={styles.subtitle}>
          Los bares o locales que administrás en Underground.
        </Text>
      </View>

      <FlatList
        data={venues}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('VenueForm', { venueId: item.id })
            }
          >
            {item.logoUrl ? (
              <Image source={{ uri: item.logoUrl }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, styles.logoPlaceholder]}>
                <Text style={styles.logoInitial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.venueName}>{item.name}</Text>
              <Text style={styles.venueLocation}>
                {item.neighborhood ? `${item.neighborhood}, ` : ''}
                {item.city}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no tenés un lugar</Text>
            <Text style={styles.emptyText}>
              Creá el perfil de tu bar o local para empezar a publicar
              eventos, promos y novedades.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          label="+ Crear lugar"
          onPress={() => navigation.navigate('VenueForm', {})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodyMuted, marginTop: spacing.xs },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logo: { width: 48, height: 48, borderRadius: radius.sm },
  logoPlaceholder: {
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: { color: colors.text, fontWeight: '800', fontSize: 18 },
  cardBody: { flex: 1, marginLeft: spacing.md },
  venueName: { ...typography.h3 },
  venueLocation: { ...typography.bodyMuted, marginTop: 2 },
  chevron: { color: colors.textFaint, fontSize: 24 },
  empty: { paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  emptyTitle: { ...typography.h3, textAlign: 'center', marginBottom: spacing.sm },
  emptyText: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 20 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
