/**
 * Authentication form for login.
 */
// PUBLIC_INTERFACE
import React, { useState } from 'react';

function AuthForm({ onSubmit, error }) {
  /** Minimal login form using email/password */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="auth-card">
      <div className="auth-title">Welcome back</div>
      <div className="helper">Sign in to manage your notes.</div>
      {error ? <div className="error-text mt-8" role="alert">{error}</div> : null}
      <form onSubmit={submit} className="mt-16">
        <div className="field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="input"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="input"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        <div className="row mt-16">
          <button className="btn flex-1" type="submit">Sign in</button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
