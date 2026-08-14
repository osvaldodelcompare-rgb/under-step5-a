// Bandas: por ahora esto es solo un enlace externo modular. Cuando se
// construya el flujo real de perfiles de banda dentro de la app, alcanza
// con reemplazar este componente — nada más en el resto del código
// depende de esto.
import React from 'react';

const BAND_SIGNUP_URL = import.meta.env.VITE_BAND_SIGNUP_URL || '';

export function BandSignupLink() {
  if (!BAND_SIGNUP_URL) {
    return (
      <span
        style={{
          fontSize: 13,
          color: 'var(--color-text-faint)',
          cursor: 'default',
        }}
        title="Muy pronto vamos a sumar esto"
      >
        Bandas (muy pronto)
      </span>
    );
  }

  return (
    <a
      href={BAND_SIGNUP_URL}
      target="_blank"
      rel="noreferrer"
      style={{ fontSize: 14, color: 'var(--color-text-muted)' }}
    >
      Bandas ↗
    </a>
  );
}
