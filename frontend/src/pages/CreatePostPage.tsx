import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { venuesApi } from '../api/venues.api';
import { postsApi } from '../api/posts.api';
import { Input } from '../components/Input';
import { ImageUploadField } from '../components/ImageUploadField';
import { Button } from '../components/Button';
import { SegmentedSelector } from '../components/SegmentedSelector';
import { LoadingScreen } from '../components/LoadingScreen';
import { PostType, Venue } from '../types';
import { postTypeLabels } from '../theme/tokens';

const POST_TYPE_OPTIONS = Object.values(PostType).map((value) => ({
  value,
  label: postTypeLabels[value],
}));

export function CreatePostPage() {
  const navigate = useNavigate();
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
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
      navigate('/');
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
      <div style={{ maxWidth: 480, margin: '15vh auto', padding: '0 24px', textAlign: 'center' }}>
        <h2>Todavía no tenés un venue</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
          Creá el perfil de tu bar o local primero para poder publicar
          eventos, promos o novedades.
        </p>
        <Link to="/venues/new">
          <Button>Crear mi lugar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px 64px' }}>
      <h1 style={{ marginBottom: 24 }}>Nueva publicación</h1>

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: 'block',
            fontSize: 12,
            color: 'var(--color-text-faint)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Lugar
        </label>
        <select
          value={selectedVenueId ?? ''}
          onChange={(e) => setSelectedVenueId(Number(e.target.value))}
          style={{
            width: '100%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            color: 'var(--color-text)',
            fontSize: 15,
            marginBottom: 20,
          }}
        >
          {myVenues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        <label
          style={{
            display: 'block',
            fontSize: 12,
            color: 'var(--color-text-faint)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Tipo
        </label>
        <SegmentedSelector
          options={POST_TYPE_OPTIONS}
          value={postType}
          onChange={(value) => setPostType(value as PostType)}
        />

        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Noche de rock en el patio"
        />
        <Input
          label="Descripción"
          multiline
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contá los detalles del evento, promo o noticia"
        />

        {postType === PostType.EVENT ? (
          <Input
            label="Fecha del evento"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        ) : null}

        <Input
          label="Precio (opcional)"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0 para gratis"
        />
        <Input
          label="Link de entradas (opcional)"
          value={ticketLink}
          onChange={(e) => setTicketLink(e.target.value)}
          placeholder="https://..."
        />
        <ImageUploadField
          label="Imagen de portada (opcional)"
          value={mediaUrl}
          onChange={setMediaUrl}
          aspectRatio="16 / 9"
        />

        {error ? (
          <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>
            {error}
          </p>
        ) : null}

        <Button type="submit" loading={submitting}>
          Publicar
        </Button>
      </form>
    </div>
  );
}
