import React, { useRef, useState } from 'react';
import { uploadsApi } from '../api/uploads.api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = '16 / 9',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const result = await uploadsApi.uploadImage(file);
      onChange(result.url);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'No pudimos subir la imagen. Probá de nuevo.',
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-text-faint)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 'var(--space-xs)',
        }}
      >
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          background: 'var(--color-surface)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {value ? (
          <img
            src={value}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: 'var(--color-text-faint)', fontSize: 13 }}>
            {uploading ? 'Subiendo…' : '+ Elegir imagen'}
          </span>
        )}

        {uploading && value ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(11,11,15,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              fontSize: 13,
            }}
          >
            Subiendo…
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            marginTop: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-faint)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Quitar imagen
        </button>
      ) : null}

      {error ? (
        <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
