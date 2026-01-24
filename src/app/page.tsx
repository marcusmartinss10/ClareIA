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

                .liquid-button {
                    background: linear-gradient(135deg, #2bbdee 0%, #1a8fb8 100%);
                    box-shadow: 0 0 20px rgba(43, 189, 238, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3);
                    border: none;
                    border-radius: 9999px;
                    padding: 0.625rem 1.5rem;
                    color: #050505;
                    font-size: 0.875rem;
                    font-weight: 700;
                    letter-spacing: 0.025em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .liquid-button:hover {
                    box-shadow: 0 0 30px rgba(43, 189, 238, 0.6), inset 0 4px 8px rgba(255, 255, 255, 0.4);
                    transform: translateY(-2px);
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

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 1.25rem 2.5rem;
                    color: white;
                    font-size: 1.125rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05);
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

                .progress-item {
                    
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



                .cta-btn-secondary {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 1.25rem 3rem;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .cta-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05);
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

                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                }

                @media (min-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr 1fr 1fr;
                    }
                }

                .footer-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .footer-brand-icon {
                    font-size: 1.5rem;
                }

                .footer-brand-text {
                    font-size: 1.25rem;
                    font-weight: 900;
                    color: white;
                }

                .footer-brand-text span {
                    color: #2bbdee;
                }

                .footer-desc {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.875rem;
                    line-height: 1.75;
                    max-width: 320px;
                }

                .footer-title {
                    color: white;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .footer-links a {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .footer-links a:hover {
                    color: #2bbdee;
                }

                .newsletter-input {
                    display: flex;
                    gap: 0.5rem;
                }

                .newsletter-input input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: white;
                    outline: none;
                }

                .newsletter-input input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .newsletter-input input:focus {
                    border-color: #2bbdee;
                }

                .newsletter-btn {
                    background: rgba(43, 189, 238, 0.2);
                    border: none;
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    color: #2bbdee;
                    font-size: 1.25rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .newsletter-btn:hover {
                    background: rgba(43, 189, 238, 0.3);
                }

                .footer-bottom {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 2rem 1.5rem 0;
                    margin-top: 5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }

                @media (min-width: 768px) {
                    .footer-bottom {
                        flex-direction: row;
                    }
                }

                .footer-copyright {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 0.75rem;
                }

                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                }

                .footer-legal a {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 0.75rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .footer-legal a:hover {
                    color: white;
                }
            `}</style>

            {/* Background Effects */}
            <div className="bg-effects">
                <div className="floating-blob blob-1" />
                <div className="floating-blob blob-2" />
                <div className="particle-mesh" />
            </div>

            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <Link href="/" className="logo-wrapper">
                        <Logo size="md" theme="dark" />
                    </Link>

                    <nav className="nav-links">
                        <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
                        <a href="#sobre" className="nav-link">Sobre Nós</a>
                        <a href="#precos" className="nav-link">Preços</a>
                        <a href="#depoimentos" className="nav-link">Depoimentos</a>
                    </nav>

                    <div className="header-actions">
                        <Link href="/login" className="btn-login">Login</Link>
                        <button className="liquid-button">Agendar Demo</button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="pulse-dot" />
                            Inteligência Artificial de Próxima Geração
                        </div>

                        <h2 className="hero-title">
                            A Odontologia do Futuro, <span>Hoje</span>
                        </h2>

                        <p className="hero-subtitle">
                            Aumente sua produtividade e precisão com a plataforma SaaS líder em inteligência dental.
                            Gestão clínica fluida como vidro, inteligente como IA.
                        </p>

                        <div className="hero-buttons">
                            <Link href="/login" className="landing-btn-primary">
                                Começar Teste Grátis
                            </Link>
                            <button className="btn-secondary">Ver Funcionalidades</button>
                        </div>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="mockup-container">
                        <div className="dashboard-mockup">
                            <div className="mockup-header">
                                <div className="window-dots">
                                    <div className="window-dot red" />
                                    <div className="window-dot yellow" />
                                    <div className="window-dot green" />
                                </div>
                                <div className="mockup-url">clareia-dashboard-v2.app</div>
                            </div>
                            <div className="mockup-content">
                                {/* Sidebar Mini */}
                                <div className="mockup-sidebar">
                                    <div className="sidebar-icon" style={{ background: 'rgba(43,189,238,0.2)' }}>🦷</div>
                                    <div className="sidebar-icon" style={{ background: 'rgba(43,189,238,0.1)', opacity: 0.5 }}>📊</div>
                                    <div className="sidebar-icon" style={{ background: 'rgba(255,255,255,0.02)', opacity: 0.3 }}>📅</div>
                                    <div className="sidebar-icon" style={{ background: 'rgba(255,255,255,0.02)', opacity: 0.3 }}>👥</div>
                                </div>
                                {/* Main Content */}
                                <div className="mockup-main">
                                    {/* Stats Row */}
                                    <div className="stats-row">
                                        <div className="stat-card">
                                            <div className="stat-label">PACIENTES HOJE</div>
                                            <div className="stat-value">24</div>
                                            <div className="stat-change">↑ 12%</div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-label">CONSULTAS</div>
                                            <div className="stat-value">18</div>
                                            <div className="stat-change">↑ 8%</div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-label">RECEITA</div>
                                            <div className="stat-value">R$ 8.4k</div>
                                            <div className="stat-change">↑ 23%</div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-label">TAXA DE RETORNO</div>
                                            <div className="stat-value">94%</div>
                                            <div className="stat-change" style={{ color: '#2bbdee' }}>Excelente</div>
                                        </div>
                                    </div>
                                    {/* Chart Area */}
                                    <div className="charts-row">
                                        <div className="chart-card wide">
                                            <div className="chart-title">📈 Atendimentos da Semana</div>
                                            <div className="chart-bars">
                                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                                    <div
                                                        key={i}
                                                        className="chart-bar"
                                                        style={{
                                                            background: `linear-gradient(to top, #2bbdee, rgba(43,189,238,${0.3 + i * 0.1}))`,
                                                            height: `${h}%`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="chart-card narrow">
                                            <div className="chart-title">🦷 Procedimentos</div>
                                            <div className="progress-list">
                                                {[['Limpeza', 35], ['Restauração', 28], ['Canal', 18], ['Extração', 12]].map(([name, val], i) => (
                                                    <div key={i} className="progress-item">
                                                        <div className="progress-label">
                                                            <span>{name}</span><span>{val}%</span>
                                                        </div>
                                                        <div className="progress-bar-bg">
                                                            <div className="progress-bar-fill" style={{ width: `${val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-float">
                            <div className="stat-icon">📈</div>
                            <div>
                                <div className="stat-float-label">Precisão de Diagnóstico</div>
                                <div className="stat-float-value">+98.4%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <div className="social-proof">
                <div className="social-proof-content">
                    <p className="social-proof-title">Parceiros de Confiança</p>
                    <div className="logos-wrapper">
                        <span className="logo-placeholder">🏥 Clínica Sorriso</span>
                        <span className="logo-placeholder">🦷 DentalCare</span>
                        <span className="logo-placeholder">⚕️ OdontoPlus</span>
                        <span className="logo-placeholder">🏨 SmilePro</span>
                        <span className="logo-placeholder">🌟 PremiumDent</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="features" id="funcionalidades">
                <div className="features-content">
                    <div className="features-header">
                        <h3 className="features-title">Recursos Inteligentes</h3>
                        <p className="features-subtitle">Uma experiência fluida projetada para o profissional moderno.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h4 className="feature-title">Agenda Inteligente</h4>
                            <p className="feature-desc">
                                Otimização de horários via IA, reduzindo faltas em até 40% com lembretes automatizados e fluidos.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h4 className="feature-title">Prontuário Digital</h4>
                            <p className="feature-desc">
                                Histórico completo com visualização 3D e integração radiológica imediata em uma interface de vidro.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h4 className="feature-title">Dashboards em Tempo Real</h4>
                            <p className="feature-desc">
                                Visualize a saúde financeira e operacional da sua clínica com gráficos dinâmicos e intuitivos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-glow" />
                    <div className="cta-content">
                        <h3 className="cta-title">Transforme sua clínica agora.</h3>
                        <p className="cta-subtitle">
                            Junte-se a mais de 2.000 dentistas que já modernizaram suas rotinas com ClareIA.
                            Comece hoje mesmo seu período de teste.
                        </p>
                        <div className="cta-buttons">
                            <Link href="/login" className="landing-cta-btn-primary">
                                Iniciar Teste Gratuito
                            </Link>
                            <button className="cta-btn-secondary">Falar com Consultor</button>
                        </div>
                        <p className="cta-note">Não requer cartão de crédito • 14 dias grátis</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-grid">
                        <div>
                            <div className="footer-brand">
                                <img src="/logo-v2.png" alt="ClareIA" height={56} className="h-14 w-auto" />
                            </div>
                            <p className="footer-desc">
                                Elevando o padrão da odontologia global através da inovação digital e inteligência artificial de ponta.
                            </p>
                        </div>

                        <div>
                            <h5 className="footer-title">Plataforma</h5>
                            <ul className="footer-links">
                                <li><a href="#">Funcionalidades</a></li>
                                <li><a href="#">Integrações</a></li>
                                <li><a href="#">Segurança</a></li>
                                <li><a href="#">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="footer-title">Empresa</h5>
                            <ul className="footer-links">
                                <li><a href="#">Sobre Nós</a></li>
                                <li><a href="#">Carreiras</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contato</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="footer-title">Newsletter</h5>
                            <p className="footer-desc" style={{ marginBottom: '1rem' }}>
                                Receba insights sobre o futuro da odontologia.
                            </p>
                            <div className="newsletter-input">
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button className="newsletter-btn">➤</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">© 2026 ClareIA. Todos os direitos reservados.</p>
                    <div className="footer-legal">
                        <a href="#">Privacidade</a>
                        <a href="#">Termos de Uso</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
