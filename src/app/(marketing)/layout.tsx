'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from '@/components/Logo';

const navLinks = [
    { href: '/funcionalidades', label: 'Funcionalidades' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/precos', label: 'Preços' },
    { href: '/depoimentos', label: 'Depoimentos' },
];

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="marketing-layout">
            <style jsx global>{`
                .marketing-layout {
                    min-height: 100vh;
                    background: #FAFBFC;
                    color: #1E293B;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                /* Header */
                .site-header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid #E2E8F0;
                }

                .header-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    height: 4.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo-link {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    text-decoration: none;
                }

                .nav-desktop {
                    display: none;
                    align-items: center;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .nav-desktop {
                        display: flex;
                    }
                }

                .nav-link {
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #64748B;
                    text-decoration: none;
                    transition: color 0.2s;
                    padding: 0.5rem 0;
                    position: relative;
                }

                .nav-link:hover {
                    color: #2563EB;
                }

                .nav-link.active {
                    color: #2563EB;
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #2563EB;
                    border-radius: 1px;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .btn-login {
                    display: none;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: #64748B;
                    background: none;
                    border: none;
                    padding: 0.5rem 1rem;
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
                    color: #2563EB;
                }



                .mobile-menu-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    background: none;
                    border: 1px solid #E2E8F0;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1.25rem;
                }

                @media (min-width: 768px) {
                    .mobile-menu-btn {
                        display: none;
                    }
                }

                /* Mobile Menu */
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 4.5rem;
                    left: 0;
                    right: 0;
                    background: white;
                    border-bottom: 1px solid #E2E8F0;
                    padding: 1rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .mobile-menu.open {
                    display: block;
                }

                @media (min-width: 768px) {
                    .mobile-menu {
                        display: none !important;
                    }
                }

                .mobile-nav-link {
                    display: block;
                    padding: 0.875rem 1rem;
                    font-size: 1rem;
                    font-weight: 500;
                    color: #64748B;
                    text-decoration: none;
                    border-radius: 0.5rem;
                    transition: all 0.2s;
                }

                .mobile-nav-link:hover,
                .mobile-nav-link.active {
                    background: #F1F5F9;
                    color: #2563EB;
                }

                /* Footer */
                .site-footer {
                    background: #1E293B;
                    color: white;
                    padding: 4rem 0 2rem;
                    margin-top: 4rem;
                }

                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2.5rem;
                }

                @media (min-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                    }
                }

                .footer-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .footer-brand-icon {
                    font-size: 1.5rem;
                }

                .footer-brand-text {
                    font-size: 1.25rem;
                    font-weight: 800;
                }

                .footer-brand-text span {
                    color: #0EA5E9;
                }

                .footer-desc {
                    color: #94A3B8;
                    font-size: 0.875rem;
                    line-height: 1.7;
                    max-width: 320px;
                }

                .footer-title {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 1.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .footer-links a {
                    color: #94A3B8;
                    font-size: 0.9375rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .footer-links a:hover {
                    color: #0EA5E9;
                }

                .footer-bottom {
                    margin-top: 3rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #334155;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                }

                @media (min-width: 768px) {
                    .footer-bottom {
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }

                .footer-copyright {
                    color: #64748B;
                    font-size: 0.875rem;
                }

                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                }

                .footer-legal a {
                    color: #64748B;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .footer-legal a:hover {
                    color: white;
                }
            `}</style>

            {/* Header */}
            <header className="site-header">
                <div className="header-container">
                    <Link href="/" className="logo-link">
                        <Logo size="md" theme="light" />
                    </Link>

                    <nav className="nav-desktop">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="header-actions">
                        <Link href="/login" className="btn-login">Entrar</Link>
                        <Link href="/login" className="btn btn-primary">Teste Grátis</Link>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div>
                            <div className="footer-brand">
                                <Logo size="lg" theme="dark" />
                            </div>
                            <p className="footer-desc">
                                A plataforma de gestão odontológica que traz clareza,
                                produtividade e organização para sua clínica.
                            </p>
                        </div>

                        <div>
                            <h4 className="footer-title">Plataforma</h4>
                            <ul className="footer-links">
                                <li><Link href="/funcionalidades">Funcionalidades</Link></li>
                                <li><Link href="/precos">Preços</Link></li>
                                <li><a href="#">Integrações</a></li>
                                <li><a href="#">Segurança</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-title">Empresa</h4>
                            <ul className="footer-links">
                                <li><Link href="/sobre">Sobre Nós</Link></li>
                                <li><Link href="/depoimentos">Depoimentos</Link></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contato</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-title">Suporte</h4>
                            <ul className="footer-links">
                                <li><a href="#">Central de Ajuda</a></li>
                                <li><a href="#">Documentação</a></li>
                                <li><a href="#">Status do Sistema</a></li>
                                <li><a href="#">Fale Conosco</a></li>
                            </ul>
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
                </div>
            </footer>
        </div>
    );
}
