import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Completá todos los campos');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'No pudimos crear tu cuenta. Probá con otro email.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '10vh auto', padding: '0 24px' }}>
      <h1 style={{ textAlign: 'center', fontSize: 26 }}>Creá tu cuenta</h1>
      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: 32,
        }}
      >
        Seguí venues y bandas, enterate antes que nadie.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />

        {error ? (
          <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>
            {error}
          </p>
        ) : null}

        <Button type="submit" loading={loading}>
          Crear cuenta
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/login" style={{ color: 'var(--color-primary)' }}>
          Ya tengo cuenta
        </Link>
      </p>
    </div>
  );
}
