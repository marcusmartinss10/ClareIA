'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';

export default function LandingPage() {
    const [email, setEmail] = useState('');

    return (
        <div className="landing-page">
            <style jsx>{`
                .landing-page {
                    min-height: 100vh;
                    background: #050505;
                    color: #ffffff;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow-x: hidden;
                }

                /* Background Effects */
                .bg-effects {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                }

                .floating-blob {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(43, 189, 238, 0.1) 0%, transparent 70%);
                    filter: blur(60px);
                }

                .blob-1 {
                    top: -10%;
                    left: -10%;
                }

                .blob-2 {
                    bottom: -10%;
                    right: -10%;
                    transform: scale(1.5);
                    opacity: 0.5;
                }

                .particle-mesh {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(43, 189, 238, 0.2) 1px, transparent 1px);
                    background-size: 30px 30px;
                    opacity: 0.2;
                }

                /* Header */
                .header {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    width: 100%;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(5, 5, 5, 0.8);
                    backdrop-filter: blur(12px);
                }

                .header-content {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    height: 5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                }

                .nav-links {
                    display: none;
                    align-items: center;
                    gap: 2.5rem;
                }

                @media (min-width: 768px) {
                    .nav-links {
                        display: flex;
                    }
                }

                .nav-link {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .nav-link:hover {
                    color: #2bbdee;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .btn-login {
                    display: none;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.9);
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                    text-decoration: none;
                }

                @media (min-width: 640px) {
                    .btn-login {
                        display: block;
                    }
                }

                .btn-login:hover {
                    color: #2bbdee;
                }

                /* Hero Section */
                .hero {
                    position: relative;
                    padding: 5rem 0 8rem;
                    overflow: hidden;
                    background: radial-gradient(circle at 50% -20%, rgba(43, 189, 238, 0.15) 0%, rgba(5, 5, 5, 1) 60%);
                }

                .hero-content {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .hero-text {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin-bottom: 5rem;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    background: rgba(43, 189, 238, 0.1);
                    border: 1px solid rgba(43, 189, 238, 0.2);
                    color: #2bbdee;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                }

                .pulse-dot {
                    position: relative;
                    display: flex;
                    width: 0.5rem;
                    height: 0.5rem;
                }

                .pulse-dot::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2bbdee;
                    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                    opacity: 0.75;
                }

                .pulse-dot::after {
                    content: '';
                    position: relative;
                    display: inline-flex;
                    width: 0.5rem;
                    height: 0.5rem;
                    border-radius: 50%;
                    background: #2bbdee;
                }

                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.1;
                    letter-spacing: -0.04em;
                    margin-bottom: 2rem;
                    max-width: 56rem;
                }

                @media (min-width: 768px) {
                    .hero-title {
                        font-size: 4.5rem;
                    }
                }

                .hero-title span {
                    color: #2bbdee;
                }

                .hero-subtitle {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 42rem;
                    line-height: 1.75;
                    margin-bottom: 2.5rem;
                }

                @media (min-width: 768px) {
                    .hero-subtitle {
                        font-size: 1.25rem;
                    }
                }

                .hero-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                @media (min-width: 640px) {
                    .hero-buttons {
                        flex-direction: row;
                    }
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }

                /* Dashboard Mockup */
                .mockup-container {
                    position: relative;
                    max-width: 64rem;
                    margin: 3rem auto 0;
                }

                .dashboard-mockup {
                    transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
                    box-shadow: -20px 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(43, 189, 238, 0.1);
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    overflow: hidden;
                }

                .mockup-header {
                    background: rgba(5, 5, 5, 0.9);
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .window-dots {
                    display: flex;
                    gap: 0.375rem;
                }

                .window-dot {
                    width: 0.75rem;
                    height: 0.75rem;
                    border-radius: 50%;
                }

                .window-dot.red { background: rgba(239, 68, 68, 0.5); }
                .window-dot.yellow { background: rgba(234, 179, 8, 0.5); }
                .window-dot.green { background: rgba(34, 197, 94, 0.5); }

                .mockup-url {
                    flex: 1;
                    text-align: center;
                    font-size: 0.625rem;
                    color: rgba(255, 255, 255, 0.3);
                    font-family: monospace;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                }

                .mockup-content {
                    display: flex;
                    background: #0a0e14;
                }

                .mockup-sidebar {
                    width: 60px;
                    background: rgba(255,255,255,0.02);
                    border-right: 1px solid rgba(255,255,255,0.05);
                    padding: 1rem 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .sidebar-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mockup-main {
                    flex: 1;
                    padding: 1.5rem;
                    overflow: hidden;
                }

                .stats-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .stat-card {
                    flex: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 1rem;
                }

                .stat-label {
                    font-size: 10px;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                }

                .stat-change {
                    font-size: 10px;
                    color: #34d399;
                }

                .charts-row {
                    display: flex;
                    gap: 1rem;
                }

                .chart-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    height: 180px;
                }

                .chart-card.wide {
                    flex: 2;
                }

                .chart-card.narrow {
                    flex: 1;
                }

                .chart-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 12px;
                }

                .chart-bars {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    height: 120px;
                }

                .chart-bar {
                    flex: 1;
                    border-radius: 4px;
                    opacity: 0.8;
                }

                .progress-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .progress-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 4px;
                }

                .progress-bar-bg {
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: #2bbdee;
                    border-radius: 3px;
                }

                .mockup-gradient {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 100px;
                    background: linear-gradient(to top, #050505, transparent);
                }

                .stat-card-float {
                    position: absolute;
                    top: -2.5rem;
                    right: -2.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                    border-radius: 0.75rem;
                    display: none;
                }

                @media (min-width: 768px) {
                    .stat-card-float {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                    }
                }

                .stat-icon {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 0.5rem;
                    background: rgba(43, 189, 238, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .stat-float-label {
                    font-size: 0.625rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                }

                .stat-float-value {
                    font-size: 1.25rem;
                    font-weight: 900;
                    color: white;
                }

                /* Social Proof */
                .social-proof {
                    padding: 3rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(255, 255, 255, 0.02);
                }

                .social-proof-content {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .social-proof-title {
                    text-align: center;
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 2rem;
                }

                .logos-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 3rem;
                    opacity: 0.4;
                    filter: grayscale(1);
                    transition: all 0.3s;
                }

                .logos-wrapper:hover {
                    filter: grayscale(0);
                }

                @media (min-width: 768px) {
                    .logos-wrapper {
                        gap: 5rem;
                    }
                }

                .logo-placeholder {
                    font-size: 1.5rem;
                    opacity: 0.5;
                }

                /* Features Section */
                .features {
                    padding: 8rem 0;
                    position: relative;
                }

                .features-content {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .features-header {
                    margin-bottom: 5rem;
                }

                .features-title {
                    font-size: 1.875rem;
                    font-weight: 900;
                    color: white;
                    letter-spacing: -0.025em;
                    margin-bottom: 1rem;
                }

                @media (min-width: 768px) {
                    .features-title {
                        font-size: 3rem;
                    }
                }

                .features-subtitle {
                    color: rgba(255, 255, 255, 0.5);
                    max-width: 36rem;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .features-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2.5rem;
                    border-radius: 1rem;
                    transition: all 0.5s;
                }

                .feature-card:hover {
                    border-color: rgba(43, 189, 238, 0.5);
                }

                .feature-card:hover .feature-icon {
                    transform: scale(1.1);
                }

                .feature-icon {
                    width: 4rem;
                    height: 4rem;
                    border-radius: 1rem;
                    background: rgba(43, 189, 238, 0.1);
                    border: 1px solid rgba(43, 189, 238, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                    transition: transform 0.3s;
                }

                .feature-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 1rem;
                }

                .feature-desc {
                    color: rgba(255, 255, 255, 0.5);
                    line-height: 1.75;
                }

                /* CTA Section */
                .cta-section {
                    padding: 0 1.5rem 8rem;
                }

                .cta-card {
                    max-width: 80rem;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                    border-radius: 2.5rem;
                    background: linear-gradient(to bottom right, #081a20, #050505);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 3rem;
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .cta-card {
                        padding: 6rem;
                    }
                }

                .cta-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(43, 189, 238, 0.05);
                    filter: blur(120px);
                    border-radius: 50%;
                    transform: scale(1.5);
                }

                .cta-content {
                    position: relative;
                    z-index: 10;
                }

                .cta-title {
                    font-size: 2.25rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 2rem;
                    letter-spacing: -0.025em;
                }

                @media (min-width: 768px) {
                    .cta-title {
                        font-size: 3.75rem;
                    }
                }

                .cta-subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 1.125rem;
                    max-width: 42rem;
                    margin: 0 auto 3rem;
                }

                @media (min-width: 768px) {
                    .cta-subtitle {
                        font-size: 1.25rem;
                    }
                }

                .cta-buttons {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 1.5rem;
                }

                @media (min-width: 640px) {
                    .cta-buttons {
                        flex-direction: row;
                    }
                }



                .cta-note {
                    margin-top: 2rem;
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 0.875rem;
                }

                /* Footer */
                .footer {
                    padding: 5rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-content {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                /* About Section */
                .about-section {
                    padding: 8rem 0;
                    position: relative;
                    background: linear-gradient(to bottom, #050505, #080b10);
                }

                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                @media (min-width: 768px) {
                    .about-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .about-image {
                    position: relative;
                }

                .about-image-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 50%, rgba(43, 189, 238, 0.2), transparent 70%);
                    filter: blur(40px);
                    z-index: 0;
                }
                
                .about-card {
                     position: relative;
                     z-index: 1;
                     background: rgba(255,255,255,0.03);
                     border: 1px solid rgba(255,255,255,0.1);
                     border-radius: 1.5rem;
                     padding: 2rem;
                     backdrop-filter: blur(12px);
                }

                /* Pricing Section */
                .pricing-section {
                    padding: 8rem 0;
                    position: relative;
                    background: #050505;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    max-width: 80rem;
                    margin: 0 auto;
                }

                @media (min-width: 1024px) {
                    .pricing-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .pricing-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    transition: all 0.3s;
                }

                .pricing-card:hover {
                    border-color: rgba(43, 189, 238, 0.3);
                    background: rgba(255, 255, 255, 0.04);
                    transform: translateY(-5px);
                }
                
                .pricing-card.featured {
                    border-color: #2bbdee;
                    background: rgba(43, 189, 238, 0.05);
                    box-shadow: 0 0 30px rgba(43, 189, 238, 0.1);
                }

                .pricing-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .pricing-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .pricing-price {
                    font-size: 3rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1;
                }
                
                .pricing-period {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.5);
                    font-weight: 500;
                }

                .pricing-features {
                    margin-bottom: 2.5rem;
                    flex: 1;
                    list-style: none;
                    padding: 0;
                }

                .pricing-feature {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9375rem;
                }

                .check-icon {
                    color: #2bbdee;
                    flex-shrink: 0;
                }

                /* Testimonials */
                .testimonials-section {
                    padding: 8rem 0;
                    background: linear-gradient(to top, #050505, #080b10);
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .testimonial-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 2rem;
                }

                .testimonial-text {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-style: italic;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .author-avatar {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                }

                .author-info h4 {
                    color: white;
                    font-weight: 600;
                    font-size: 0.9375rem;
                }

                .author-info p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.8125rem;
                }

            `}</style>

            <div className="bg-effects">
                <div className="floating-blob blob-1"></div>
                <div className="floating-blob blob-2"></div>
                <div className="particle-mesh"></div>
            </div>

            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <Link href="/" className="logo-wrapper">
                        <Logo className="w-8 h-8 text-[#2bbdee]" />
                        <span className="text-xl font-bold tracking-tight text-white">ClareIA</span>
                    </Link>

                    <nav className="nav-links">
                        <Link href="#sobre" className="nav-link">Sobre</Link>
                        <Link href="#features" className="nav-link">Recursos</Link>
                        <Link href="#precos" className="nav-link">Preços</Link>
                        <Link href="#depoimentos" className="nav-link">Depoimentos</Link>
                    </nav>

                    <div className="header-actions">
                        <Link href="/login" className="btn-login">Entrar</Link>
                        <Link href="/register" className="btn btn-primary">Começar Agora</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="pulse-dot"></span>
                            <span>Novo: Módulo IA 2.0</span>
                        </div>
                        <h1 className="hero-title">
                            O Futuro da <br />
                            <span>Odontologia Digital</span>
                        </h1>
                        <p className="hero-subtitle">
                            ClareIA é a plataforma completa que une gestão clínica, inteligência artificial e design premium para transformar seu consultório.
                        </p>
                        <div className="hero-buttons">
                            <Link href="/register" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>
                                Começar Gratuitamente
                            </Link>
                        </div>
                    </div>

                    <div className="mockup-container">
                        <div className="stat-card-float">
                            <div className="stat-icon">💰</div>
                            <div>
                                <div className="stat-float-label">Faturamento</div>
                                <div className="stat-float-value">+ 142%</div>
                            </div>
                        </div>

                        <div className="dashboard-mockup">
                            <div className="mockup-header">
                                <div className="window-dots">
                                    <div className="window-dot red"></div>
                                    <div className="window-dot yellow"></div>
                                    <div className="window-dot green"></div>
                                </div>
                                <div className="mockup-url">clareia.app/dashboard</div>
                            </div>
                            <div className="mockup-content">
                                <div className="mockup-sidebar">
                                    <div className="sidebar-icon" style={{ background: 'rgba(43, 189, 238, 0.2)' }}></div>
                                    <div className="sidebar-icon" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                                    <div className="sidebar-icon" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                                </div>
                                <div className="mockup-main">
                                    <div className="stats-row">
                                        <div className="stat-card">
                                            <div className="stat-label">Pacientes Ativos</div>
                                            <div className="stat-value">1,284</div>
                                            <div className="stat-change">+12% este mês</div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-label">Agendamentos</div>
                                            <div className="stat-value">42</div>
                                            <div className="stat-change text-[#67e8f9]">Hoje</div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-label">Receita Estimada</div>
                                            <div className="stat-value">R$ 48k</div>
                                            <div className="stat-change">+8% vs anterior</div>
                                        </div>
                                    </div>
                                    <div className="charts-row">
                                        <div className="chart-card wide">
                                            <div className="chart-title">Fluxo de Pacientes</div>
                                            <div className="chart-bars">
                                                <div className="chart-bar" style={{ height: '40%', background: '#1e293b' }}></div>
                                                <div className="chart-bar" style={{ height: '60%', background: '#1e293b' }}></div>
                                                <div className="chart-bar" style={{ height: '45%', background: '#1e293b' }}></div>
                                                <div className="chart-bar" style={{ height: '75%', background: '#0ea5e9' }}></div>
                                                <div className="chart-bar" style={{ height: '55%', background: '#1e293b' }}></div>
                                                <div className="chart-bar" style={{ height: '85%', background: '#1e293b' }}></div>
                                            </div>
                                        </div>
                                        <div className="chart-card narrow">
                                            <div className="chart-title">Eficiência</div>
                                            <div className="progress-list">
                                                <div className="progress-item">
                                                    <div className="progress-label"><span>Ocupação</span><span>85%</span></div>
                                                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '85%' }}></div></div>
                                                </div>
                                                <div className="progress-item" style={{ marginTop: '1rem' }}>
                                                    <div className="progress-label"><span>Retorno</span><span>92%</span></div>
                                                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '92%', background: '#10b981' }}></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mockup-gradient"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="social-proof">
                <div className="social-proof-content">
                    <p className="social-proof-title">Confiada por mais de 500+ Clínicas Modernas</p>
                    <div className="logos-wrapper">
                        <div className="logo-placeholder">DENTAL<span style={{ fontWeight: 900 }}>CORP</span></div>
                        <div className="logo-placeholder">SMILE<span style={{ fontWeight: 900 }}>STUDIO</span></div>
                        <div className="logo-placeholder">ORTHO<span style={{ fontWeight: 900 }}>TECH</span></div>
                        <div className="logo-placeholder">NOVA<span style={{ fontWeight: 900 }}>ODONTO</span></div>
                        <div className="logo-placeholder">LUMI<span style={{ fontWeight: 900 }}>SMILE</span></div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="sobre">
                <div className="features-content">
                    <div className="about-grid">
                        <div>
                            <div className="hero-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                <span className="pulse-dot" style={{ background: '#34d399' }}></span>
                                <span>Nossa Missão</span>
                            </div>
                            <h2 className="features-title">Design Líquido &<br />Inteligência Real.</h2>
                            <div className="features-subtitle" style={{ marginBottom: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    A ClareIA nasceu da frustração com softwares odontológicos "feios" e complexos. Acreditamos que a ferramenta que você usa todo dia deve ser inspiradora.
                                </p>
                                <p>
                                    Combinamos a estética "Liquid Glass" com poderosos algoritmos de IA para criar uma experiência que não apenas organiza sua clínica, mas a eleva para o próximo nível de eficiência e beleza.
                                </p>
                            </div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ color: '#2bbdee' }}>✓</span> Foco total na experiência do usuário (UX)
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ color: '#2bbdee' }}>✓</span> Arquitetura segura e escalável
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ color: '#2bbdee' }}>✓</span> Atualizações constantes baseadas em feedback
                                </li>
                            </ul>
                        </div>
                        <div className="about-image">
                            <div className="about-image-glow"></div>
                            <div className="about-card">
                                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '1rem', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
                                        <div style={{ height: '10px', width: '20%', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
                                    </div>
                                    <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Interface Limpa</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ height: '40px', flex: 1, background: '#2bbdee', borderRadius: '0.5rem', opacity: 0.8 }}></div>
                                        <div style={{ height: '40px', flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="features-content">
                    <div className="features-header">
                        <h2 className="features-title">Poderoso. Simples.<br />Essencial.</h2>
                        <p className="features-subtitle">Tudo o que você precisa para gerenciar sua clínica em um único lugar, com uma interface que você vai amar usar.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h3 className="feature-title">Agenda Inteligente</h3>
                            <p className="feature-desc">Organize seus atendimentos com drag-and-drop, confirmações automáticas e gestão de filas de espera.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🦷</div>
                            <h3 className="feature-title">Odontograma 3D</h3>
                            <p className="feature-desc">Visualize tratamentos com nosso odontograma interativo e gere orçamentos precisos em segundos.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">IA Assistente</h3>
                            <p className="feature-desc">Nossa IA analisa padrões, sugere tratamentos e ajuda a preencher prontuários automaticamente.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3 className="feature-title">Gestão Financeira</h3>
                            <p className="feature-desc">Controle de caixa, fluxo financeiro, repasse de comissões e emissão de boletos integrados.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">App do Paciente</h3>
                            <p className="feature-desc">Seus pacientes podem agendar, ver tratamentos e pagar diretamente pelo aplicativo exclusivo.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Segurança Total</h3>
                            <p className="feature-desc">Dados criptografados, backups diários e conformidade total com a LGPD para sua tranquilidade.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section" id="precos">
                <div className="features-content">
                    <div className="features-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="features-title">Preço Simples.<br />Tudo Incluso.</h2>
                        <p className="features-subtitle" style={{ margin: '0 auto' }}>Um único plano com todos os recursos. Sem surpresas, sem limitações.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="pricing-card featured" style={{ maxWidth: '480px', width: '100%' }}>
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: '#2bbdee', color: 'black', padding: '0.25rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Acesso Total</div>
                            <div className="pricing-header">
                                <h3 className="pricing-name">ClareIA Pro</h3>
                                <div className="pricing-price">R$ 149<span style={{ fontSize: '1.5rem' }}>,90</span></div>
                                <span className="pricing-period">/mês</span>
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Tudo o que você precisa para transformar sua clínica.</p>
                            </div>
                            <ul className="pricing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Agenda Inteligente com IA</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Gestão de Pacientes Ilimitada</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Prontuário Digital Completo</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Relatórios Financeiros</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Integração com Laboratórios</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> <strong>Membros Ilimitados</strong></li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Dashboard com IA</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Suporte Prioritário</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Backup Automático</li>
                                <li className="pricing-feature"><span className="check-icon">✓</span> Atualizações Gratuitas</li>
                            </ul>
                            <div style={{ marginTop: 'auto' }}>
                                <Link href="/register" className="liquid-button" style={{ width: '100%', textAlign: 'center', fontSize: '1.125rem', display: 'block', padding: '1.25rem' }}>Começar 7 Dias Grátis</Link>
                                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem' }}>Sem cartão de crédito • Cancele quando quiser</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Testimonials */}
            <section className="testimonials-section" id="depoimentos">
                <div className="features-content">
                    <div className="features-header" style={{ textAlign: 'center' }}>
                        <h2 className="features-title">O que dizem sobre nós</h2>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <p className="testimonial-text">"A ClareIA mudou completamente a forma como gerencio minha clínica. O design é lindo e os pacientes sempre elogiam a facilidade do agendamento online."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)' }}></div>
                                <div className="author-info">
                                    <h4>Dra. Ana Clara</h4>
                                    <p>Ortodontista</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <p className="testimonial-text">"Sair do papel para a ClareIA foi a melhor decisão de 2025. O módulo financeiro me fez economizar horas de contabilidade todo mês."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar" style={{ background: 'linear-gradient(135deg, #86efac, #22c55e)' }}></div>
                                <div className="author-info">
                                    <h4>Dr. Marcos Silva</h4>
                                    <p>Implantodontista</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <p className="testimonial-text">"A funcionalidade de IA para prever faltas reduziu nosso no-show em 40%. É impressionante como o sistema 'pensa' com a gente."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar" style={{ background: 'linear-gradient(135deg, #93c5fd, #3b82f6)' }}></div>
                                <div className="author-info">
                                    <h4>Clínica OdontoMaster</h4>
                                    <p>Rede de Clínicas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-glow"></div>
                    <div className="cta-content">
                        <h2 className="cta-title">Pronto para transformar<br />seu consultório?</h2>
                        <p className="cta-subtitle">Junte-se a centenas de dentistas que já modernizaram suas clínicas com a ClareIA.</p>
                        <div className="cta-buttons">
                            <Link href="/register" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }}>
                                Começar Grátis
                            </Link>
                        </div>
                        <p className="cta-note">Sem cartão de crédito • Cancele quando quiser</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
                        <div className="logo-wrapper">
                            <Logo className="w-6 h-6 text-slate-600" />
                            <span className="text-lg font-bold text-slate-600">ClareIA</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                            © 2024 ClareIA Tecnologia Ltda. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
