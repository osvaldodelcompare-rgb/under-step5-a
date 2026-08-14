import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SegmentedSelectorProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedSelector({
  options,
  value,
  onChange,
}: SegmentedSelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)',
        padding: 4,
        marginBottom: 'var(--space-md)',
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: selected ? 'var(--color-primary)' : 'transparent',
              color: selected ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
