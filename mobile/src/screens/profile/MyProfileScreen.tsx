import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { BandSignupButton } from '../../components/BandSignupButton';
import { Badge } from '../../components/Badge';
import { colors, spacing, typography } from '../../theme/theme';
import { UserRole } from '../../types';
import { ProfileStackScreenProps } from '../../navigation/types';

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: 'Usuario',
  [UserRole.VENUE_ADMIN]: 'Admin de venue',
  [UserRole.BAND_ADMIN]: 'Admin de banda',
  [UserRole.SUPERADMIN]: 'Superadmin',
};

export function MyProfileScreen({
  navigation,
}: ProfileStackScreenProps<'MyProfile'>) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.roleWrapper}>
        <Badge label={ROLE_LABELS[user.role]} />
      </View>

      {user.favoriteGenres.length > 0 ? (
        <View style={styles.genresSection}>
          <Text style={styles.sectionTitle}>Géneros favoritos</Text>
          <View style={styles.genresRow}>
            {user.favoriteGenres.map((genre) => (
              <Badge key={genre} label={genre} color={colors.accent} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.menu}>
        <Button
          label="📍 Mis lugares"
          variant="secondary"
          onPress={() => navigation.navigate('MyVenues')}
        />
        <View style={styles.menuSpacer} />
        <BandSignupButton />
      </View>

      <View style={styles.footer}>
        <Button label="Cerrar sesión" variant="secondary" onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  name: { ...typography.h2 },
  email: { ...typography.bodyMuted, marginBottom: spacing.md },
  roleWrapper: { marginBottom: spacing.lg },
  genresSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  menu: {
    width: '100%',
    marginTop: spacing.md,
  },
  menuSpacer: {
    height: spacing.sm,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
});
