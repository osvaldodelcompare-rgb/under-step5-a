import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = 'var(--color-primary)' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        border: `1px solid ${color}`,
        color,
        borderRadius: 'var(--radius-pill)',
        padding: '3px 10px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}
