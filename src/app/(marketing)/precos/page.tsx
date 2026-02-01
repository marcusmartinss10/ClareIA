'use client';

import Link from 'next/link';

export default function PrecosPage() {
    const features = [
        { category: 'Agenda & Organização', items: ['Agenda Inteligente com IA', 'Drag-and-drop de consultas', 'Confirmações automáticas', 'Gestão de filas de espera'] },
        { category: 'Gestão de Pacientes', items: ['Pacientes ilimitados', 'Prontuário digital completo', 'Histórico de atendimentos', 'CRM e relacionamento'] },
        { category: 'Financeiro', items: ['Controle de caixa', 'Relatórios e dashboards', 'Fluxo de receitas', 'Exportação de dados'] },
        { category: 'Equipe & Laboratório', items: ['Membros ilimitados', 'Gestão de permissões', 'Integração com laboratórios', 'Controle de pedidos'] },
        { category: 'IA & Tecnologia', items: ['Assistente com IA', 'Insights automáticos', 'Dashboard inteligente', 'Atualizações gratuitas'] },
        { category: 'Suporte & Segurança', items: ['Suporte prioritário', 'Backup automático diário', 'Criptografia de dados', 'Conformidade LGPD'] },
    ];

    const faqs = [
        {
            question: 'Posso testar antes de assinar?',
            answer: 'Sim! Você tem 7 dias de teste grátis, sem necessidade de cartão de crédito.'
        },
        {
            question: 'Como funciona o cancelamento?',
            answer: 'Você pode cancelar quando quiser, sem multas ou taxas. Seu acesso continua até o fim do período pago.'
        },
        {
            question: 'Os dados são seguros?',
            answer: 'Sim. Utilizamos criptografia de ponta a ponta e estamos em total conformidade com a LGPD.'
        },
        {
            question: 'Há custos adicionais?',
            answer: 'Não há taxas ocultas. R$149,90/mês inclui TODOS os recursos, sem limitações.'
        },
        {
            question: 'Quantos usuários posso ter?',
            answer: 'Ilimitados! Dentistas, recepcionistas, todos que você precisar sem custos extras.'
        }
    ];

    return (
        <div className="pricing-page">
            <style jsx>{`
                .pricing-page {
                    color: #1E293B;
                    min-height: 100vh;
                }

                /* Hero */
                .page-hero {
                    background: linear-gradient(180deg, #0A0F1A 0%, #0F172A 100%);
                    padding: 5rem 0 6rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .page-hero::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(43, 189, 238, 0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .hero-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(43, 189, 238, 0.1);
                    border: 1px solid rgba(43, 189, 238, 0.3);
                    border-radius: 9999px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #2bbdee;
                    margin-bottom: 1.5rem;
                }

                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.2;
                    letter-spacing: -0.03em;
                    margin-bottom: 1rem;
                }

                @media (min-width: 768px) {
                    .hero-title {
                        font-size: 3.5rem;
                    }
                }

                .hero-subtitle {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.7;
                    margin-bottom: 3rem;
                }

                /* Main Plan Card */
                .plan-showcase {
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid #2bbdee;
                    border-radius: 1.5rem;
                    padding: 3rem;
                    max-width: 500px;
                    margin: 0 auto;
                    position: relative;
                    box-shadow: 0 0 60px rgba(43, 189, 238, 0.2);
                }

                .plan-showcase::before {
                    content: 'ACESSO TOTAL';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #2bbdee, #0ea5e9);
                    color: #0A0F1A;
                    font-size: 0.75rem;
                    font-weight: 800;
                    padding: 0.5rem 1.25rem;
                    border-radius: 9999px;
                }

                .plan-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 0.25rem;
                    margin-bottom: 0.5rem;
                }

                .price-currency {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .price-value {
                    font-size: 4rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1;
                }

                .price-cents {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .price-period {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1.5rem;
                }

                .plan-cta {
                    display: block;
                    text-align: center;
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s;
                    background: linear-gradient(135deg, #2bbdee, #0ea5e9);
                    color: #0A0F1A;
                    margin-bottom: 1rem;
                }

                .plan-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(43, 189, 238, 0.4);
                }

                .plan-note {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                /* Features Section */
                .features-section {
                    padding: 5rem 0;
                    background: white;
                }

                .features-container {
                    max-width: 1100px;
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

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 2rem;
                }

                @media (min-width: 640px) {
                    .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .features-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .feature-category {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 1.5rem;
                }

                .category-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0F172A;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 2px solid #2bbdee;
                }

                .category-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .category-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    padding: 0.5rem 0;
                    font-size: 0.9375rem;
                    color: #475569;
                }

                .category-list li::before {
                    content: '✓';
                    color: #10B981;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                /* FAQ */
                .faq-section {
                    padding: 5rem 0;
                    background: #F8FAFC;
                }

                .faq-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .faq-item {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 0.75rem;
                    padding: 1.25rem 1.5rem;
                }

                .faq-question {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0F172A;
                    margin-bottom: 0.5rem;
                }

                .faq-answer {
                    font-size: 0.9375rem;
                    color: #64748B;
                    line-height: 1.6;
                }

                /* CTA */
                .cta-section {
                    padding: 5rem 0;
                    background: linear-gradient(135deg, #0A0F1A 0%, #0F172A 100%);
                    color: white;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .cta-section::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 800px;
                    height: 400px;
                    background: radial-gradient(ellipse, rgba(43, 189, 238, 0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .cta-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .cta-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }

                .cta-subtitle {
                    font-size: 1.0625rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2rem;
                }

                .cta-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #2bbdee, #0ea5e9);
                    color: #0A0F1A;
                    font-size: 1.125rem;
                    font-weight: 700;
                    padding: 1.25rem 3rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(43, 189, 238, 0.4);
                }
            `}</style>

            {/* Hero */}
            <section className="page-hero">
                <div className="hero-container">
                    <div className="hero-badge">✨ Preço Único, Tudo Incluso</div>
                    <h1 className="hero-title">Um Plano.<br />Todos os Recursos.</h1>
                    <p className="hero-subtitle">
                        Sem planos confusos. Sem limitações frustrantes.<br />
                        R$149,90/mês para transformar completamente sua clínica.
                    </p>

                    <div className="plan-showcase">
                        <h2 className="plan-name">ClareIA Pro</h2>
                        <div className="plan-price">
                            <span className="price-currency">R$</span>
                            <span className="price-value">149</span>
                            <span className="price-cents">,90</span>
                        </div>
                        <p className="price-period">/mês</p>
                        <Link href="/register" className="plan-cta">
                            Começar 7 Dias Grátis
                        </Link>
                        <p className="plan-note">Sem cartão de crédito • Cancele quando quiser</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="features-container">
                    <div className="section-header">
                        <h2 className="section-title">Tudo o que Você Precisa</h2>
                        <p className="section-subtitle">Cada funcionalidade abaixo está incluída no seu plano. Sem extras.</p>
                    </div>

                    <div className="features-grid">
                        {features.map((category, i) => (
                            <div key={i} className="feature-category">
                                <h3 className="category-title">{category.category}</h3>
                                <ul className="category-list">
                                    {category.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section">
                <div className="faq-container">
                    <div className="section-header">
                        <h2 className="section-title">Perguntas Frequentes</h2>
                        <p className="section-subtitle">Respostas para suas dúvidas mais comuns.</p>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <div className="faq-question">{faq.question}</div>
                                <div className="faq-answer">{faq.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Pronto para Começar?</h2>
                    <p className="cta-subtitle">
                        7 dias grátis. Sem compromisso. Sem cartão de crédito.
                    </p>
                    <Link href="/register" className="cta-btn">Criar Minha Conta Grátis</Link>
                </div>
            </section>
        </div>
    );
}
