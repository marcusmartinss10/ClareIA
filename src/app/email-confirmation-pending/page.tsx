'use client';

import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';

export default function EmailConfirmationPendingPage() {
    return (
        <div className="email-pending-page">
            <style jsx>{`
                .email-pending-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0a1216;
                    color: white;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .card {
                    max-width: 480px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    padding: 3rem;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .icon-wrapper {
                    width: 5rem;
                    height: 5rem;
                    margin: 0 auto 1.5rem;
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                }

                .icon-wrapper svg {
                    color: #22d3ee;
                    width: 2.5rem;
                    height: 2.5rem;
                }

                h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                p {
                    color: #94a3b8;
                    line-height: 1.75;
                    margin-bottom: 2rem;
                }

                .email-icon {
                    display: inline-block;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, #0891b2, #0ea5e9);
                    color: white;
                    font-weight: 600;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.5);
                }

                .footer-text {
                    margin-top: 2rem;
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .footer-text a {
                    color: #22d3ee;
                    text-decoration: none;
                }

                .footer-text a:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="card">
                <div className="icon-wrapper">
                    <Mail className="email-icon" />
                </div>

                <h1>Verifique seu E-mail</h1>

                <p>
                    Enviamos um link de confirmação para o seu e-mail.
                    Clique no link para ativar sua conta e começar a usar o ClareIA.
                </p>

                <Link href="/login" className="btn-primary">
                    <CheckCircle2 size={20} />
                    Ir para Login
                </Link>

                <p className="footer-text">
                    Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                    <Link href="/register">tente novamente</Link>.
                </p>
            </div>
        </div>
    );
}
