import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { venuesApi } from '../../api/venues.api';
import { postsApi } from '../../api/posts.api';
import { Input } from '../../components/Input';
import { ImagePickerField } from '../../components/ImagePickerField';
import { Button } from '../../components/Button';
import { SegmentedSelector } from '../../components/SegmentedSelector';
import { LoadingScreen } from '../../components/LoadingScreen';
import { PostType, Venue } from '../../types';
import { colors, spacing, typography } from '../../theme/theme';
import { postTypeLabels } from '../../utils/format';

const POST_TYPE_OPTIONS = Object.values(PostType).map((value) => ({
  value,
  label: postTypeLabels[value],
}));

export function CreatePostScreen() {
  const { user } = useAuth();
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [postType, setPostType] = useState<PostType>(PostType.EVENT);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [price, setPrice] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const [loadingVenues, setLoadingVenues] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const owned = await venuesApi.getMine();
        setMyVenues(owned);
        if (owned.length > 0) setSelectedVenueId(owned[0].id);
      } finally {
        setLoadingVenues(false);
      }
    })();
  }, [user?.id]);

  function resetForm() {
    setTitle('');
    setContent('');
    setEventDate('');
    setPrice('');
    setTicketLink('');
    setMediaUrl('');
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(false);

    if (!selectedVenueId) {
      setError('Necesitás tener un venue para publicar');
      return;
    }
    if (!title || !content) {
      setError('Completá título y contenido');
      return;
    }

    setSubmitting(true);
    try {
      await postsApi.create({
        venueId: selectedVenueId,
        postType,
        title: title.trim(),
        content: content.trim(),
        eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
        price: price || undefined,
        ticketLink: ticketLink || undefined,
        mediaUrls: mediaUrl ? [mediaUrl.trim()] : undefined,
      });
      setSuccess(true);
      resetForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'No pudimos publicar. Probá de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingVenues) return <LoadingScreen />;

  if (myVenues.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>Todavía no tenés un lugar</Text>
        <Text style={styles.centerText}>
          Andá a la pestaña Perfil → Mis lugares para crear el perfil de tu
          bar o local. Al crearlo vas a poder empezar a publicar eventos,
          promos y novedades.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nueva publicación</Text>

        <Text style={styles.label}>Tipo</Text>
        <SegmentedSelector
          options={POST_TYPE_OPTIONS}
          value={postType}
          onChange={(value) => setPostType(value as PostType)}
        />

        <Input
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Noche de rock en el patio"
        />
        <Input
          label="Descripción"
          value={content}
          onChangeText={setContent}
          placeholder="Contá los detalles del evento, promo o noticia"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        {postType === PostType.EVENT ? (
          <Input
            label="Fecha del evento (AAAA-MM-DD HH:MM)"
            value={eventDate}
            onChangeText={setEventDate}
            placeholder="2026-09-20 23:00"
          />
        ) : null}

        <Input
          label="Precio (opcional)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="0 para gratis"
        />
        <Input
          label="Link de entradas (opcional)"
          value={ticketLink}
          onChangeText={setTicketLink}
          autoCapitalize="none"
          placeholder="https://..."
        />
        <ImagePickerField
          label="Imagen de portada (opcional)"
          value={mediaUrl}
          onChange={setMediaUrl}
          aspectRatio={[16, 9]}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
          <Text style={styles.success}>¡Publicado! Ya aparece en el feed.</Text>
        ) : null}

        <Button label="Publicar" onPress={handleSubmit} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  centerTitle: { ...typography.h2, textAlign: 'center', marginBottom: spacing.sm },
  centerText: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 20 },
  title: { ...typography.h1, marginBottom: spacing.lg },
  label: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  success: { color: colors.success, marginBottom: spacing.md, textAlign: 'center' },
});
