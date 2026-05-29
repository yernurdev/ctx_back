import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="entry-label">Restricted</div>
      <div className="hero" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-gif-overlay" aria-hidden="true" />

        <section className="auth-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <a href="/"><img src="/logo.png" alt="Cortex AI" width={100} style={{ display: 'block', margin: '0 auto 1rem', height: 'auto', objectFit: 'contain' }} /></a>
            <p className="eyebrow">Secure Access</p>
            <h2>Doctor Login</h2>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Access Portal'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="/" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Back to Home</a>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
