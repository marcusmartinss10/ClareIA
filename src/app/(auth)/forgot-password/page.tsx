'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Instruções de recuperação enviadas para seu e-mail.'
            });
            setEmail('');
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao enviar e-mail de recuperação.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <style jsx>{`
                .forgot-password-page {
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

                .logo-subtitle {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    letter-spacing: 0.05em;
                    font-weight: 300;
                }

                /* Form */
                .forgot-form {
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

                /* Message */
                .message-box {
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .message-success {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #34d399;
                }

                .message-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                }

                /* Back Link */
                .back-link {
                    margin-top: 1.5rem;
                    text-align: center;
                }

                .back-link a {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .back-link a:hover {
                    color: white;
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
            `}</style>

            {/* Background Layers */}
            <div className="bg-layer">
                <div className="bg-gradient" />
                <div className="blob-1" />
                <div className="blob-2" />
                {/* Particles... reusing styling from login */}
                <div className="particle" style={{ width: 4, height: 4, left: '10%', bottom: 0, animationDuration: '15s', animationDelay: '0s' }} />
                {/* ... more particles if desired */}
            </div>

            <div className="content-container">
                <div className="glass-card">
                    <div className="logo-header">
                        <Logo size="xl" theme="dark" />
                        <p className="logo-subtitle">Recuperação de Senha</p>
                    </div>

                    <form className="forgot-form" onSubmit={handleSubmit}>
                        {message && (
                            <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Cadastrado</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    id="email"
                                    type="email"
                                    className="glass-input"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Instruções'}
                        </button>
                    </form>

                    <div className="back-link">
                        <Link href="/login">Voltar para Login</Link>
                    </div>
                </div>

                <div className="login-footer">
                    <p>© 2026 ClareIA Systems. Ambiente Seguro.</p>
                </div>
            </div>
        </div>
    );
}
