import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { venuesApi } from '../../api/venues.api';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { ImagePickerField } from '../../components/ImagePickerField';
import { Button } from '../../components/Button';
import { RegionPicker } from '../../components/RegionPicker';
import { LoadingScreen } from '../../components/LoadingScreen';
import { colors, spacing, typography } from '../../theme/theme';
import { ProfileStackScreenProps } from '../../navigation/types';

export function VenueFormScreen({
  route,
  navigation,
}: ProfileStackScreenProps<'VenueForm'>) {
  const venueId = route.params?.venueId;
  const isEditing = !!venueId;
  const { refreshProfile } = useAuth();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [regionId, setRegionId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [mpLink, setMpLink] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const venue = await venuesApi.getById(venueId!);
        setRegionId(venue.regionId);
        setName(venue.name);
        setDescription(venue.description ?? '');
        setAddress(venue.address);
        setNeighborhood(venue.neighborhood ?? '');
        setCity(venue.city);
        setLogoUrl(venue.logoUrl ?? '');
        setBannerUrl(venue.bannerUrl ?? '');
        setMpLink(venue.mpLink ?? '');
      } finally {
        setLoading(false);
      }
    })();
  }, [isEditing, venueId]);

  async function handleSubmit() {
    setError(null);

    if (!regionId || !name || !address || !city) {
      setError('Completá al menos región, nombre, dirección y ciudad');
      return;
    }

    const payload = {
      regionId,
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim(),
      neighborhood: neighborhood.trim() || undefined,
      city: city.trim(),
      logoUrl: logoUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      mpLink: mpLink.trim() || undefined,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await venuesApi.update(venueId!, payload);
      } else {
        await venuesApi.create(payload);
        // Creating a venue may have promoted this user to venue_admin —
        // refresh the session so the rest of the app unlocks immediately.
        await refreshProfile();
      }
      navigation.goBack();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'No pudimos guardar el lugar. Probá de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {isEditing ? 'Editar lugar' : 'Crear mi lugar'}
        </Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? 'Actualizá la información de tu venue.'
            : 'Dale de alta a tu bar, boliche o local nocturno.'}
        </Text>

        <RegionPicker value={regionId} onChange={setRegionId} />

        <Input
          label="Nombre del lugar"
          value={name}
          onChangeText={setName}
          placeholder="Ej: Bar El Sótano"
        />
        <Input
          label="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Contá qué onda tiene tu lugar"
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
        <Input
          label="Dirección"
          value={address}
          onChangeText={setAddress}
          placeholder="Calle 47 N° 650"
        />
        <Input
          label="Barrio (opcional)"
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder="Ej: Centro"
        />
        <Input
          label="Ciudad"
          value={city}
          onChangeText={setCity}
          placeholder="Ej: La Plata"
        />
        <ImagePickerField
          label="Logo"
          value={logoUrl}
          onChange={setLogoUrl}
          aspectRatio={[1, 1]}
        />
        <ImagePickerField
          label="Banner / foto de portada"
          value={bannerUrl}
          onChange={setBannerUrl}
          aspectRatio={[16, 9]}
        />
        <Input
          label="Link de Mercado Pago (opcional)"
          value={mpLink}
          onChangeText={setMpLink}
          autoCapitalize="none"
          placeholder="https://mpago.la/..."
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label={isEditing ? 'Guardar cambios' : 'Crear lugar'}
          onPress={handleSubmit}
          loading={submitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.bodyMuted, marginBottom: spacing.lg },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
});
