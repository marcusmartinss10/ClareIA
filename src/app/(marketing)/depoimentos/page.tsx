'use client';

export default function DepoimentosPage() {
    const testimonials = [
        {
            quote: "O ClareIA transformou completamente a organização da minha clínica. Antes, eu perdia tempo procurando prontuários e ajustando a agenda manualmente. Agora tudo está em um lugar só, claro e acessível.",
            name: "Dr. Marcelo Andrade",
            role: "Dentista, Especialista em Implantes",
            location: "São Paulo, SP",
            avatar: "👨‍⚕️"
        },
        {
            quote: "A integração com o laboratório foi um divisor de águas. Consigo enviar pedidos, acompanhar a produção e manter todo o histórico técnico organizado. Meus protéticos adoraram.",
            name: "Dra. Fernanda Costa",
            role: "Proprietária de Clínica",
            location: "Curitiba, PR",
            avatar: "👩‍⚕️"
        },
        {
            quote: "Como gerente de uma rede com 5 unidades, eu precisava de visibilidade sobre todas as clínicas. Os dashboards do ClareIA me dão exatamente isso, em tempo real.",
            name: "Ricardo Mendes",
            role: "Gerente de Operações",
            location: "Rio de Janeiro, RJ",
            avatar: "👔"
        },
        {
            quote: "A equipe de recepção se adaptou muito rápido ao sistema. A interface é intuitiva e os lembretes automáticos reduziram nossas faltas em mais de 30%.",
            name: "Dra. Patrícia Lopes",
            role: "Dentista Clínica Geral",
            location: "Belo Horizonte, MG",
            avatar: "👩‍⚕️"
        },
        {
            quote: "Finalmente uma ferramenta de gestão que não parece ter sido feita nos anos 2000. O ClareIA é moderno, rápido e realmente útil no dia a dia.",
            name: "Dr. Bruno Tavares",
            role: "Ortodontista",
            location: "Brasília, DF",
            avatar: "👨‍⚕️"
        },
        {
            quote: "O suporte do ClareIA é excepcional. Sempre que tive dúvidas, fui atendida rapidamente. Isso faz toda a diferença quando você está migrando de sistema.",
            name: "Carla Santana",
            role: "Administradora de Clínica",
            location: "Salvador, BA",
            avatar: "👩‍💼"
        }
    ];

    const stats = [
        { value: '4.9', label: 'Nota média de satisfação', suffix: '/5' },
        { value: '98%', label: 'Recomendam a colegas' },
        { value: '40%', label: 'Redução média de faltas' },
        { value: '3h', label: 'Economizadas por dia' },
    ];

    return (
        <div className="testimonials-page">
            <style jsx>{`
                .testimonials-page {
                    color: #1E293B;
                }

                /* Hero */
                .page-hero {
                    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
                    padding: 4rem 0 5rem;
                    text-align: center;
                }

                .hero-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .hero-badge {
                    display: inline-block;
                    background: rgba(37, 99, 235, 0.08);
                    border: 1px solid rgba(37, 99, 235, 0.15);
                    border-radius: 9999px;
                    padding: 0.375rem 1rem;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #2563EB;
                    margin-bottom: 1.5rem;
                }

                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #0F172A;
                    line-height: 1.2;
                    letter-spacing: -0.03em;
                    margin-bottom: 1rem;
                }

                @media (min-width: 768px) {
                    .hero-title {
                        font-size: 3rem;
                    }
                }

                .hero-subtitle {
                    font-size: 1.125rem;
                    color: #64748B;
                    line-height: 1.7;
                }

                /* Stats */
                .stats-section {
                    padding: 3rem 0;
                    background: white;
                    border-bottom: 1px solid #E2E8F0;
                }

                .stats-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .stat-block {
                    text-align: center;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #2563EB;
                    line-height: 1;
                }

                .stat-suffix {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #64748B;
                }

                .stat-label {
                    font-size: 0.9375rem;
                    color: #64748B;
                    margin-top: 0.5rem;
                }

                /* Testimonials */
                .testimonials-section {
                    padding: 5rem 0;
                    background: #FAFBFC;
                }

                .testimonials-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .testimonials-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .testimonial-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                }

                .testimonial-quote {
                    font-size: 1rem;
                    color: #1E293B;
                    line-height: 1.7;
                    margin-bottom: 1.5rem;
                    flex: 1;
                }

                .testimonial-quote::before {
                    content: '"';
                    font-size: 3rem;
                    color: #2563EB;
                    line-height: 0;
                    margin-right: 0.25rem;
                    vertical-align: -0.5rem;
                    font-family: Georgia, serif;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #E2E8F0;
                }

                .author-avatar {
                    width: 3rem;
                    height: 3rem;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.1));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .author-info {
                    flex: 1;
                }

                .author-name {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: #0F172A;
                }

                .author-role {
                    font-size: 0.8125rem;
                    color: #64748B;
                }

                .author-location {
                    font-size: 0.75rem;
                    color: #94A3B8;
                }

                /* Featured Quote */
                .featured-section {
                    padding: 5rem 0;
                    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
                    color: white;
                }

                .featured-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    text-align: center;
                }

                .featured-quote {
                    font-size: 1.5rem;
                    font-weight: 500;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    font-style: italic;
                }

                @media (min-width: 768px) {
                    .featured-quote {
                        font-size: 1.75rem;
                    }
                }

                .featured-author {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .featured-avatar {
                    width: 4rem;
                    height: 4rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .featured-name {
                    font-size: 1.125rem;
                    font-weight: 700;
                }

                .featured-role {
                    font-size: 0.9375rem;
                    color: #94A3B8;
                }

                /* CTA */
                .cta-section {
                    padding: 5rem 0;
                    background: white;
                    text-align: center;
                }

                .cta-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .cta-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 1rem;
                }

                .cta-subtitle {
                    font-size: 1.0625rem;
                    color: #64748B;
                    margin-bottom: 2rem;
                }

                .cta-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #2563EB, #0EA5E9);
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                    padding: 1rem 2.5rem;
                    border-radius: 0.625rem;
                    text-decoration: none;
                    transition: all 0.2s;
                    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
                }

                .cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
                }
            `}</style>

            {/* Hero */}
            <section className="page-hero">
                <div className="hero-container">
                    <div className="hero-badge">Histórias Reais</div>
                    <h1 className="hero-title">O que nossos clientes dizem</h1>
                    <p className="hero-subtitle">
                        Dentistas e gestores compartilham como o ClareIA transformou
                        a rotina de suas clínicas.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-block">
                                <div className="stat-value">
                                    {stat.value}
                                    {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="testimonial-card">
                                <p className="testimonial-quote">{testimonial.quote}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonial.avatar}</div>
                                    <div className="author-info">
                                        <div className="author-name">{testimonial.name}</div>
                                        <div className="author-role">{testimonial.role}</div>
                                        <div className="author-location">{testimonial.location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Quote */}
            <section className="featured-section">
                <div className="featured-container">
                    <p className="featured-quote">
                        "O ClareIA não é apenas um sistema de gestão – é uma plataforma que
                        realmente entende como clínicas odontológicas funcionam. Desde que
                        adotamos, nossa eficiência aumentou em 40% e nossa equipe trabalha
                        com muito mais clareza."
                    </p>
                    <div className="featured-author">
                        <div className="featured-avatar">🏆</div>
                        <div className="featured-name">Dr. André Machado</div>
                        <div className="featured-role">CEO da Rede Sorriso Perfeito (12 unidades)</div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Faça parte dessa transformação</h2>
                    <p className="cta-subtitle">
                        Junte-se a milhares de profissionais que já modernizaram suas clínicas com ClareIA.
                    </p>
                    <a href="/login" className="cta-btn">Começar Teste Grátis</a>
                </div>
            </section>
        </div>
    );
}
