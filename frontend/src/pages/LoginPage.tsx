import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('agente.pqr@example.com');
  const [password, setPassword] = useState('PqrDemo2026!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({
        email,
        password,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible iniciar sesion.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Acceso interno</p>
          <h1 className="login-title">Iniciar sesion</h1>
          <p className="login-copy">
            Usuarios internos pueden gestionar estados, prioridades y
            seguimientos.
          </p>
        </div>

        <div className="field">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contrasena</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <div className="state-box error-state compact-state" role="alert">
            {error}
          </div>
        )}

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="demo-credentials">
          <p>Demo: agente.pqr@example.com</p>
          <p>Password: PqrDemo2026!</p>
        </div>
      </form>
    </section>
  );
}
