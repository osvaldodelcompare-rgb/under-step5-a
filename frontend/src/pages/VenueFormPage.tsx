import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { venuesApi } from '../api/venues.api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { ImageUploadField } from '../components/ImageUploadField';
import { Button } from '../components/Button';
import { RegionPicker } from '../components/RegionPicker';
import { LoadingScreen } from '../components/LoadingScreen';

export function VenueFormPage() {
  const { id } = useParams<{ id: string }>();
  const venueId = id ? Number(id) : undefined;
  const isEditing = !!venueId;
  const navigate = useNavigate();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        await refreshProfile();
      }
      navigate('/venues/mine');
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
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px 64px' }}>
      <h1 style={{ marginBottom: 4 }}>
        {isEditing ? 'Editar lugar' : 'Crear mi lugar'}
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>
        {isEditing
          ? 'Actualizá la información de tu venue.'
          : 'Dale de alta a tu bar, boliche o local nocturno.'}
      </p>

      <form onSubmit={handleSubmit}>
        <RegionPicker value={regionId} onChange={setRegionId} />

        <Input
          label="Nombre del lugar"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Bar El Sótano"
        />
        <Input
          label="Descripción (opcional)"
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Contá qué onda tiene tu lugar"
        />
        <Input
          label="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle 47 N° 650"
        />
        <Input
          label="Barrio (opcional)"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="Ej: Centro"
        />
        <Input
          label="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ej: La Plata"
        />
        <ImageUploadField
          label="Logo"
          value={logoUrl}
          onChange={setLogoUrl}
          aspectRatio="1 / 1"
        />
        <ImageUploadField
          label="Banner / foto de portada"
          value={bannerUrl}
          onChange={setBannerUrl}
          aspectRatio="16 / 9"
        />
        <Input
          label="Link de Mercado Pago (opcional)"
          value={mpLink}
          onChange={(e) => setMpLink(e.target.value)}
          placeholder="https://mpago.la/..."
        />

        {error ? (
          <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>
            {error}
          </p>
        ) : null}

        <Button type="submit" loading={submitting}>
          {isEditing ? 'Guardar cambios' : 'Crear lugar'}
        </Button>
      </form>
    </div>
  );
}
