import React from 'react';

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base: React.CSSProperties = {
    borderRadius: 'var(--radius-pill)',
    padding: '14px 20px',
    fontSize: 15,
    fontWeight: 700,
    border: '1px solid transparent',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    width: '100%',
    transition: 'opacity 0.15s ease',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-primary)', color: 'var(--color-text)' },
    secondary: {
      background: 'var(--color-surface-alt)',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? 'Cargando…' : children}
    </button>
  );
}
