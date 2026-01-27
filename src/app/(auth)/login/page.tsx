'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setSuccess('Email verificado com sucesso! Faça login para continuar.');
    }
    const errorParam = searchParams.get('error');
    if (errorParam === 'auth_code_error') {
      setError('Link de verificação inválido ou expirado.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: #0a1216;
                    color: white;
                }

                /* Background Layers */
                .bg-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    background: #0a1216;
                }

                .bg-gradient {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(43, 189, 238, 0.15) 0%, rgba(15, 46, 61, 0.4) 40%, rgba(10, 18, 22, 1) 80%);
                }

                .blob-1 {
                    position: absolute;
                    top: -10%;
                    left: 20%;
                    width: 500px;
                    height: 500px;
                    background: rgba(43, 189, 238, 0.2);
                    border-radius: 50%;
                    filter: blur(100px);
                    animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .blob-2 {
                    position: absolute;
                    bottom: -10%;
                    right: 10%;
                    width: 600px;
                    height: 600px;
                    background: rgba(30, 58, 138, 0.3);
                    border-radius: 50%;
                    filter: blur(120px);
                    animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    animation-delay: 2s;
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* Particles */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    background: white;
                    opacity: 0.1;
                    filter: blur(1px);
                    animation: float-particle 20s infinite linear;
                }

                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }

                /* Content Container */
                .content-container {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 1rem;
                }

                /* Glass Card */
                .glass-card {
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border-radius: 1rem;
                    padding: 3rem;
                    animation: float 8s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .logo-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }


                .logo-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .logo-subtitle {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    letter-spacing: 0.05em;
                    font-weight: 300;
                }

                /* Form */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-size: 0.6875rem;
                    font-weight: 500;
                    color: #d1d5db;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding-left: 0.25rem;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    font-size: 1.25rem;
                    pointer-events: none;
                }

                .glass-input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 2.75rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.5rem;
                    color: white;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .glass-input::placeholder {
                    color: #6b7280;
                }

                .glass-input:focus {
                    outline: none;
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(43, 189, 238, 0.5);
                    box-shadow: 0 0 0 2px rgba(43, 189, 238, 0.1);
                }

                .password-toggle {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.25rem;
                    transition: color 0.2s;
                }

                .password-toggle:hover {
                    color: #2bbdee;
                }

                /* Error Message */
                .error-message {
                    padding: 0.75rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 0.5rem;
                    color: #f87171;
                    font-size: 0.875rem;
                    text-align: center;
                }

                /* Success Message */
                .success-message {
                    padding: 0.75rem;
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    border-radius: 0.5rem;
                    color: #4ade80;
                    font-size: 0.875rem;
                    text-align: center;
                }

                /* Forgot Password */
                .forgot-link {
                    text-align: right;
                    margin-top: 0.25rem;
                }

                .forgot-link a {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .forgot-link a:hover {
                    color: white;
                }

                .password-toggle:hover {
                    color: #2bbdee;
                }

                /* Divider */
                .divider {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: center;
                }

                .divider p {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }

                .divider a {
                    color: #2bbdee;
                    font-weight: 500;
                    text-decoration: none;
                    margin-left: 0.25rem;
                    transition: color 0.2s;
                }

                .divider a:hover {
                    color: rgba(43, 189, 238, 0.8);
                }

                /* Footer */
                .login-footer {
                    margin-top: 2rem;
                    text-align: center;
                }

                .login-footer p {
                    color: rgba(255, 255, 255, 0.2);
                    font-size: 0.6875rem;
                    font-weight: 300;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                }

                @media (max-width: 480px) {
                    .glass-card {
                        padding: 2rem;
                    }
                }
            `}</style>

      {/* Background Layers */}
      <div className="bg-layer">
        <div className="bg-gradient" />
        <div className="blob-1" />
        <div className="blob-2" />

        {/* Particles */}
        <div className="particle" style={{ width: 4, height: 4, left: '10%', bottom: 0, animationDuration: '15s', animationDelay: '0s' }} />
        <div className="particle" style={{ width: 8, height: 8, left: '20%', bottom: 0, animationDuration: '25s', animationDelay: '2s' }} />
        <div className="particle" style={{ width: 4, height: 4, left: '30%', bottom: 0, animationDuration: '18s', animationDelay: '5s' }} />
        <div className="particle" style={{ width: 6, height: 6, left: '45%', bottom: 0, animationDuration: '22s', animationDelay: '1s' }} />
        <div className="particle" style={{ width: 4, height: 4, left: '60%', bottom: 0, animationDuration: '20s', animationDelay: '7s' }} />
        <div className="particle" style={{ width: 8, height: 8, left: '75%', bottom: 0, animationDuration: '28s', animationDelay: '3s' }} />
        <div className="particle" style={{ width: 4, height: 4, left: '85%', bottom: 0, animationDuration: '16s', animationDelay: '6s' }} />
        <div className="particle" style={{ width: 6, height: 6, left: '95%', bottom: 0, animationDuration: '24s', animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="content-container">
        <div className="glass-card">
          {/* Logo Header */}
          <div className="logo-header">
            <Logo size="xl" theme="dark" />
            <p className="logo-subtitle">Inteligência Dental de Precisão</p>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="success-message">{success}</div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">{error}</div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  className="glass-input"
                  placeholder="dr.silva@clareia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input"
                  style={{ paddingRight: '3rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="forgot-link">
              <Link href="/forgot-password">Esqueci minha senha</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <p>
              Novo no ClareIA?
              <Link href="/register">Solicitar Acesso</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 ClareIA Systems. Ambiente Seguro.</p>
        </div>
      </div>
    </div>
  );
}
