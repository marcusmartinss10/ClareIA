'use client';

export default function SobrePage() {
    const values = [
        {
            icon: '💡',
            title: 'Clareza',
            description: 'Acreditamos que informação clara e organizada é a base de boas decisões. Cada tela, cada dado, cada funcionalidade foi pensada para trazer clareza ao seu dia.'
        },
        {
            icon: '⚡',
            title: 'Eficiência',
            description: 'Tempo é o recurso mais valioso na odontologia. Automatizamos processos repetitivos para que você possa focar no que realmente importa: seus pacientes.'
        },
        {
            icon: '🤝',
            title: 'Conexão',
            description: 'Conectamos dentistas, recepcionistas, laboratórios e pacientes em um ecossistema fluido. Comunicação eficiente gera resultados melhores.'
        },
        {
            icon: '🛡️',
            title: 'Confiança',
            description: 'Seus dados estão seguros conosco. Investimos em segurança, privacidade e conformidade para que você trabalhe com tranquilidade.'
        }
    ];

    const timeline = [
        {
            year: '2022',
            title: 'A Ideia',
            description: 'Observamos que clínicas odontológicas ainda dependiam de processos manuais e ferramentas desconectadas.'
        },
        {
            year: '2023',
            title: 'Desenvolvimento',
            description: 'Construímos a primeira versão do ClareIA com foco em usabilidade e integração.'
        },
        {
            year: '2024',
            title: 'Lançamento',
            description: 'Lançamos oficialmente para clínicas parceiras, coletando feedback valioso.'
        },
        {
            year: '2025',
            title: 'Expansão',
            description: 'Crescemos para mais de 2.000 dentistas ativos e adicionamos integração com laboratórios.'
        },
        {
            year: '2026',
            title: 'Evolução',
            description: 'Continuamos evoluindo com IA assistiva e novas funcionalidades baseadas em dados reais.'
        }
    ];

    return (
        <div className="about-page">
            <style jsx>{`
                .about-page {
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

                /* Story Section */
                .story-section {
                    padding: 5rem 0;
                    background: white;
                }

                .section-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .story-content {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                }

                @media (min-width: 768px) {
                    .story-content {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .story-text h2 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                }

                .story-text p {
                    font-size: 1rem;
                    color: #64748B;
                    line-height: 1.8;
                    margin-bottom: 1rem;
                }

                .story-text p:last-child {
                    margin-bottom: 0;
                }

                .story-visual {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                }

                .story-visual-content {
                    text-align: center;
                }

                .story-visual-icon {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                }

                .story-visual-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #2563EB;
                }

                /* Values */
                .values-section {
                    padding: 5rem 0;
                    background: #FAFBFC;
                }

                .values-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 0.75rem;
                }

                .section-subtitle {
                    font-size: 1.0625rem;
                    color: #64748B;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .values-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .values-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .value-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 2rem;
                    text-align: center;
                }

                .value-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .value-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0F172A;
                    margin-bottom: 0.75rem;
                }

                .value-description {
                    font-size: 0.9375rem;
                    color: #64748B;
                    line-height: 1.6;
                }

                /* Timeline */
                .timeline-section {
                    padding: 5rem 0;
                    background: white;
                }

                .timeline-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .timeline {
                    position: relative;
                    padding-left: 2rem;
                }

                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: #E2E8F0;
                }

                .timeline-item {
                    position: relative;
                    padding-bottom: 2rem;
                }

                .timeline-item:last-child {
                    padding-bottom: 0;
                }

                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: -2rem;
                    top: 0;
                    width: 12px;
                    height: 12px;
                    background: #2563EB;
                    border-radius: 50%;
                    transform: translateX(-5px);
                }

                .timeline-year {
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: #2563EB;
                    margin-bottom: 0.375rem;
                }

                .timeline-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0F172A;
                    margin-bottom: 0.5rem;
                }

                .timeline-description {
                    font-size: 0.9375rem;
                    color: #64748B;
                    line-height: 1.6;
                }

                /* Vision */
                .vision-section {
                    padding: 5rem 0;
                    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
                    color: white;
                    text-align: center;
                }

                .vision-container {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .vision-icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }

                .vision-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }

                .vision-text {
                    font-size: 1.0625rem;
                    color: #94A3B8;
                    line-height: 1.8;
                }
            `}</style>

            {/* Hero */}
            <section className="page-hero">
                <div className="hero-container">
                    <div className="hero-badge">Nossa História</div>
                    <h1 className="hero-title">Sobre o ClareIA</h1>
                    <p className="hero-subtitle">
                        Nascemos da necessidade de trazer clareza e organização
                        para a gestão de clínicas odontológicas.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="story-section">
                <div className="section-container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Por que criamos o ClareIA?</h2>
                            <p>
                                Observamos que mesmo clínicas odontológicas bem-sucedidas
                                ainda enfrentavam desafios básicos: agendas desorganizadas,
                                prontuários dispersos, comunicação falha com laboratórios
                                e falta de visibilidade sobre a performance do negócio.
                            </p>
                            <p>
                                O mercado oferecia ferramentas complexas demais ou simples
                                demais. Faltava uma solução que combinasse funcionalidade
                                completa com usabilidade real.
                            </p>
                            <p>
                                ClareIA nasceu para preencher essa lacuna. Construímos uma
                                plataforma que centraliza tudo o que uma clínica precisa,
                                com uma interface limpa e intuitiva que qualquer membro
                                da equipe consegue usar.
                            </p>
                        </div>
                        <div className="story-visual">
                            <div className="story-visual-content">
                                <div className="story-visual-icon">🦷</div>
                                <div className="story-visual-text">Clareza é o nosso DNA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="values-section">
                <div className="values-container">
                    <div className="section-header">
                        <h2 className="section-title">Nossos Valores</h2>
                        <p className="section-subtitle">Os princípios que guiam cada decisão que tomamos.</p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, i) => (
                            <div key={i} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3 className="value-title">{value.title}</h3>
                                <p className="value-description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="timeline-section">
                <div className="timeline-container">
                    <div className="section-header">
                        <h2 className="section-title">Nossa Jornada</h2>
                        <p className="section-subtitle">De uma ideia a milhares de clínicas.</p>
                    </div>
                    <div className="timeline">
                        {timeline.map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-year">{item.year}</div>
                                <div className="timeline-title">{item.title}</div>
                                <div className="timeline-description">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="vision-section">
                <div className="vision-container">
                    <div className="vision-icon">🔮</div>
                    <h2 className="vision-title">Nossa Visão</h2>
                    <p className="vision-text">
                        Construir um ecossistema odontológico conectado, onde dentistas,
                        clínicas, laboratórios e pacientes trabalham juntos com eficiência
                        e transparência. Acreditamos em tecnologia simples, moderna e
                        confiável como base para este futuro.
                    </p>
                </div>
            </section>
        </div>
    );
}
