import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'No pudimos iniciar sesión. Revisá tus datos.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 380,
        margin: '10vh auto',
        padding: '0 24px',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: 'var(--color-primary)',
          letterSpacing: 2,
          fontSize: 28,
        }}
      >
        UNDERGROUND
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: 32,
        }}
      >
        Bares, bandas y noches que no salen en Google.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error ? (
          <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>
            {error}
          </p>
        ) : null}

        <Button type="submit" loading={loading}>
          Ingresar
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/register" style={{ color: 'var(--color-primary)' }}>
          Crear una cuenta
        </Link>
      </p>
    </div>
  );
}
