'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrecosPage() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
            name: 'Starter',
            description: 'Para clínicas pequenas que buscam organização básica.',
            price: { monthly: 149, yearly: 119 },
            highlight: false,
            features: [
                'Até 2 profissionais',
                'Agenda inteligente',
                'CRM de pacientes',
                'Prontuário digital básico',
                'Lembretes por email',
                'Suporte por email',
            ],
            notIncluded: [
                'Dashboards gerenciais',
                'Controle de tempo',
                'Integração com laboratórios',
                'IA assistiva',
            ]
        },
        {
            name: 'Professional',
            description: 'Para clínicas em crescimento que precisam de mais recursos.',
            price: { monthly: 299, yearly: 239 },
            highlight: true,
            badge: 'Mais Popular',
            features: [
                'Até 10 profissionais',
                'Tudo do Starter, mais:',
                'Dashboards completos',
                'Controle de tempo de atendimento',
                'Integração com laboratórios',
                'Lembretes por WhatsApp e SMS',
                'Relatórios exportáveis',
                'Suporte prioritário',
            ],
            notIncluded: [
                'IA assistiva avançada',
                'API personalizada',
            ]
        },
        {
            name: 'Enterprise',
            description: 'Para redes e clínicas grandes com necessidades avançadas.',
            price: { monthly: 599, yearly: 479 },
            highlight: false,
            features: [
                'Profissionais ilimitados',
                'Tudo do Professional, mais:',
                'IA assistiva avançada',
                'API para integrações',
                'Múltiplas unidades',
                'Gestão de permissões avançada',
                'Onboarding dedicado',
                'Gerente de conta exclusivo',
                'SLA garantido',
            ],
            notIncluded: []
        }
    ];

    const faqs = [
        {
            question: 'Posso testar antes de assinar?',
            answer: 'Sim! Todos os planos têm 14 dias de teste grátis, sem necessidade de cartão de crédito.'
        },
        {
            question: 'Posso mudar de plano depois?',
            answer: 'Claro. Você pode fazer upgrade ou downgrade a qualquer momento. O valor será ajustado proporcionalmente.'
        },
        {
            question: 'Como funciona o cancelamento?',
            answer: 'Você pode cancelar quando quiser, sem multas. Seu acesso continua até o fim do período pago.'
        },
        {
            question: 'Os dados são seguros?',
            answer: 'Sim. Utilizamos criptografia de ponta a ponta e estamos em conformidade com a LGPD.'
        },
        {
            question: 'Há custos adicionais?',
            answer: 'Não há taxas ocultas. O preço do plano inclui todas as funcionalidades listadas.'
        }
    ];

    return (
        <div className="pricing-page">
            <style jsx>{`
                .pricing-page {
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
                    margin-bottom: 2rem;
                }

                /* Billing Toggle */
                .billing-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 9999px;
                    padding: 0.375rem;
                }

                .billing-option {
                    padding: 0.625rem 1.25rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: transparent;
                    color: #64748B;
                }

                .billing-option.active {
                    background: #2563EB;
                    color: white;
                }

                .billing-badge {
                    background: #10B981;
                    color: white;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                }

                /* Plans */
                .plans-section {
                    padding: 4rem 0;
                    background: #FAFBFC;
                }

                .plans-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .plans-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .plans-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .plan-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 2rem;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .plan-card.highlight {
                    border-color: #2563EB;
                    box-shadow: 0 8px 30px rgba(37, 99, 235, 0.15);
                }

                .plan-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #2563EB;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.375rem 0.875rem;
                    border-radius: 9999px;
                }

                .plan-name {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 0.5rem;
                }

                .plan-description {
                    font-size: 0.9375rem;
                    color: #64748B;
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    gap: 0.25rem;
                    margin-bottom: 0.25rem;
                }

                .price-currency {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0F172A;
                }

                .price-value {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #0F172A;
                    line-height: 1;
                }

                .price-period {
                    font-size: 0.9375rem;
                    color: #64748B;
                }

                .price-note {
                    font-size: 0.8125rem;
                    color: #94A3B8;
                    margin-bottom: 1.5rem;
                }

                .plan-cta {
                    display: block;
                    text-align: center;
                    padding: 0.875rem;
                    border-radius: 0.5rem;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    margin-bottom: 1.5rem;
                }

                .plan-cta.primary {
                    background: #2563EB;
                    color: white;
                }

                .plan-cta.primary:hover {
                    background: #1D4ED8;
                }

                .plan-cta.secondary {
                    background: #F1F5F9;
                    color: #1E293B;
                }

                .plan-cta.secondary:hover {
                    background: #E2E8F0;
                }

                .features-title {
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1rem;
                }

                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 1.5rem 0;
                    flex: 1;
                }

                .features-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.625rem;
                    padding: 0.375rem 0;
                    font-size: 0.9375rem;
                    color: #1E293B;
                }

                .features-list li.included::before {
                    content: '✓';
                    color: #10B981;
                    font-weight: 700;
                }

                .features-list li.not-included::before {
                    content: '—';
                    color: #CBD5E1;
                }

                .features-list li.not-included {
                    color: #94A3B8;
                }

                /* FAQ */
                .faq-section {
                    padding: 5rem 0;
                    background: white;
                }

                .faq-container {
                    max-width: 800px;
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

                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .faq-item {
                    background: #F8FAFC;
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
                    background: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%);
                    color: white;
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
                    margin-bottom: 1rem;
                }

                .cta-subtitle {
                    font-size: 1.0625rem;
                    opacity: 0.9;
                    margin-bottom: 2rem;
                }

                .cta-btn {
                    display: inline-block;
                    background: white;
                    color: #2563EB;
                    font-size: 1rem;
                    font-weight: 700;
                    padding: 1rem 2.5rem;
                    border-radius: 0.625rem;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
            `}</style>

            {/* Hero */}
            <section className="page-hero">
                <div className="hero-container">
                    <div className="hero-badge">Planos Transparentes</div>
                    <h1 className="hero-title">Preços Simples e Claros</h1>
                    <p className="hero-subtitle">
                        Escolha o plano ideal para sua clínica. Sem surpresas, sem taxas ocultas.
                    </p>

                    <div className="billing-toggle">
                        <button
                            className={`billing-option ${billing === 'monthly' ? 'active' : ''}`}
                            onClick={() => setBilling('monthly')}
                        >
                            Mensal
                        </button>
                        <button
                            className={`billing-option ${billing === 'yearly' ? 'active' : ''}`}
                            onClick={() => setBilling('yearly')}
                        >
                            Anual
                        </button>
                        <span className="billing-badge">-20%</span>
                    </div>
                </div>
            </section>

            {/* Plans */}
            <section className="plans-section">
                <div className="plans-container">
                    <div className="plans-grid">
                        {plans.map((plan, i) => (
                            <div key={i} className={`plan-card ${plan.highlight ? 'highlight' : ''}`}>
                                {plan.badge && <div className="plan-badge">{plan.badge}</div>}

                                <h2 className="plan-name">{plan.name}</h2>
                                <p className="plan-description">{plan.description}</p>

                                <div className="plan-price">
                                    <span className="price-currency">R$</span>
                                    <span className="price-value">
                                        {billing === 'monthly' ? plan.price.monthly : plan.price.yearly}
                                    </span>
                                    <span className="price-period">/mês</span>
                                </div>
                                <p className="price-note">
                                    {billing === 'yearly' ? 'Cobrado anualmente' : 'Cobrado mensalmente'}
                                </p>

                                <Link
                                    href="/login"
                                    className={`plan-cta ${plan.highlight ? 'primary' : 'secondary'}`}
                                >
                                    Começar Teste Grátis
                                </Link>

                                <div className="features-title">O que está incluído</div>
                                <ul className="features-list">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="included">{feature}</li>
                                    ))}
                                    {plan.notIncluded.map((feature, j) => (
                                        <li key={`not-${j}`} className="not-included">{feature}</li>
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
                    <h2 className="cta-title">Experimente Grátis por 14 Dias</h2>
                    <p className="cta-subtitle">
                        Sem compromisso. Sem cartão de crédito. Comece agora.
                    </p>
                    <Link href="/login" className="cta-btn">Iniciar Teste Grátis</Link>
                </div>
            </section>
        </div>
    );
}
