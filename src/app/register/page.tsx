'use client';

import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="register-page">
            <style jsx>{`
                .register-page {
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
                    padding: 2rem 1rem;
                }

                /* Glass Card */
                .glass-card {
                    width: 100%;
                    max-width: 500px;
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
                    margin-bottom: 2rem;
                }

                .logo-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: white;
                    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                /* Footer */
                .footer {
                    margin-top: 2rem;
                    text-align: center;
                }

                .footer p {
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
                {/* Particles */}
                <div className="particle" style={{ width: 4, height: 4, left: '10%', bottom: 0, animationDuration: '15s' }} />
                <div className="particle" style={{ width: 6, height: 6, left: '45%', bottom: 0, animationDuration: '22s' }} />
                <div className="particle" style={{ width: 8, height: 8, left: '75%', bottom: 0, animationDuration: '28s' }} />
            </div>

            <div className="content-container">
                <div className="glass-card">
                    <div className="logo-header">
                        <Link href="/" className="inline-block hover:scale-105 transition-transform duration-200">
                            <h1 className="logo-title">ClareIA</h1>
                        </Link>
                    </div>

                    <RegisterForm />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-[#2bbdee] hover:text-[#2bbdee]/80 font-medium transition-colors">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="footer">
                    <p>&copy; {new Date().getFullYear()} ClareIA Systems. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    )
}
