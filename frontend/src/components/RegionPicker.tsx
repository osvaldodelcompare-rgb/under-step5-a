import React, { useEffect, useState } from 'react';
import { regionsApi } from '../api/regions.api';
import { Region } from '../types';

interface RegionPickerProps {
  value: number | null;
  onChange: (regionId: number) => void;
}

export function RegionPicker({ value, onChange }: RegionPickerProps) {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    (async () => {
      const result = await regionsApi.list();
      setRegions(result);
      if (!value && result.length > 0) onChange(result[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        Región
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {regions.map((region) => {
          const selected = region.id === value;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onChange(region.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${
                  selected ? 'var(--color-primary)' : 'var(--color-border)'
                }`,
                background: selected
                  ? 'var(--color-primary)'
                  : 'var(--color-surface)',
                color: selected
                  ? 'var(--color-text)'
                  : 'var(--color-text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {region.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
