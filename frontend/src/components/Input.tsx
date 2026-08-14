import React from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  multiline?: false;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline: true;
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '14px 16px',
  color: 'var(--color-text)',
  fontSize: 15,
};

export function Input(props: InputProps | TextareaProps) {
  const { label, error, multiline, ...rest } = props as any;

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label ? (
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
      ) : null}

      {multiline ? (
        <textarea
          style={{ ...fieldStyle, minHeight: 90, resize: 'vertical' }}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          style={{
            ...fieldStyle,
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          }}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error ? (
        <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
