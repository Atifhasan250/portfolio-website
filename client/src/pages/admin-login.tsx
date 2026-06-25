import { useState } from 'react';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: boolean; password?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: { username?: boolean; password?: boolean } = {};
    if (!username.trim()) errors.username = true;
    if (!password.trim()) errors.password = true;
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      navigate('/admin/dashboard');
    } catch {
      setError('Network error — please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-bg-grid" aria-hidden="true" />

      <div className="admin-login-container">
        {/* Logo */}
        <div className="admin-login-logo-wrap">
          <div className="admin-login-logo">
            <svg viewBox="0 0 24 24" fill="currentColor" className="admin-login-logo-svg">
              <path d="M12 0L0 12L12 24L24 12L12 0ZM12 4.2L4.2 12L12 19.8L19.8 12L12 4.2Z" />
            </svg>
          </div>
          <span className="admin-login-brand">ATIF</span>
        </div>

        {/* Card */}
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-login-badge-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Access
            </div>
            <h1 className="admin-login-title">Welcome back</h1>
            <p className="admin-login-subtitle">Sign in to manage your portfolio content</p>
          </div>

          {error && (
            <div className="admin-error-alert" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-alert-icon">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
            <div className="admin-form-group">
              <label htmlFor="admin-username" className="admin-form-label">Username</label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={e => { setUsername(e.target.value); setFieldErrors(fe => ({ ...fe, username: false })); }}
                  placeholder="Enter your username"
                  className={`admin-input ${fieldErrors.username ? 'admin-input-error' : ''}`}
                />
              </div>
              {fieldErrors.username && <span className="admin-field-error">Username is required</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password" className="admin-form-label">Password</label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldErrors(fe => ({ ...fe, password: false })); }}
                  placeholder="Enter your password"
                  className={`admin-input admin-input-password ${fieldErrors.password ? 'admin-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="admin-password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <span className="admin-field-error">Password is required</span>}
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="admin-login-btn"
            >
              {isLoading ? (
                <><span className="admin-btn-spinner" aria-hidden="true" />Signing in…</>
              ) : (
                <>Sign In<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-btn-arrow"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></>
              )}
            </button>
          </form>

          <p className="admin-login-note">
            This area is restricted to authorized personnel only.
          </p>
        </div>

        <a href="/" className="admin-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Portfolio
        </a>
      </div>
    </div>
  );
}
