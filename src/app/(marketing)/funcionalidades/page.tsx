'use client';

export default function FuncionalidadesPage() {
    const features = [
        {
            icon: '📅',
            title: 'Agenda Inteligente',
            description: 'Organize a rotina da sua clínica com eficiência. Nossa agenda otimiza horários automaticamente, envia lembretes aos pacientes e reduz faltas em até 40%. Visualize disponibilidades, gerencie múltiplos profissionais e mantenha o controle total do seu dia.',
            benefits: ['Lembretes automáticos via WhatsApp e SMS', 'Otimização de horários ociosos', 'Visualização por dia, semana ou mês', 'Bloqueio de horários e intervalos']
        },
        {
            icon: '👥',
            title: 'CRM de Pacientes e Prontuário Digital',
            description: 'Centralize todas as informações dos seus pacientes em um só lugar. Acesse histórico clínico, tratamentos realizados, fotografias, radiografias e evolução de cada caso. Tudo organizado e seguro.',
            benefits: ['Histórico clínico completo', 'Upload de documentos e imagens', 'Linha do tempo de tratamentos', 'Busca rápida e filtros inteligentes']
        },
        {
            icon: '⏱️',
            title: 'Controle de Tempo de Atendimento',
            description: 'Acompanhe a produtividade da sua clínica com precisão. Inicie, pause e finalize atendimentos para entender quanto tempo cada procedimento consome. Tome decisões baseadas em dados reais.',
            benefits: ['Timer de atendimento integrado', 'Relatórios de tempo por procedimento', 'Métricas de produtividade individual', 'Identificação de gargalos']
        },
        {
            icon: '📊',
            title: 'Dashboards de Gestão',
            description: 'Visualize a saúde da sua clínica em tempo real. Acompanhe métricas diárias, semanais e mensais com gráficos claros e intuitivos. Entenda o que está funcionando e onde melhorar.',
            benefits: ['Métricas de receita e atendimentos', 'Comparativos de performance', 'Indicadores por dentista', 'Exportação de relatórios']
        },
        {
            icon: '🔗',
            title: 'Integração Dentista ↔️ Laboratório',
            description: 'Comunique-se diretamente com protéticos e laboratórios parceiros. Envie pedidos, faça upload de arquivos, acompanhe cada etapa da produção e mantenha o histórico técnico organizado.',
            benefits: ['Envio de pedidos digitais', 'Upload de arquivos 3D e fotos', 'Acompanhamento de status em tempo real', 'Histórico de trabalhos por paciente']
        },
        {
            icon: '🤖',
            title: 'Inteligência Artificial como Apoio',
            description: 'Utilize IA como assistente para insights e otimização. O ClareIA sugere melhorias na agenda, identifica padrões de comportamento de pacientes e oferece recomendações para aumentar a eficiência.',
            benefits: ['Sugestões de otimização de agenda', 'Análise de padrões de pacientes', 'Alertas inteligentes', 'Recomendações personalizadas'],
            note: 'A IA atua como suporte à decisão, nunca como ferramenta de diagnóstico clínico.'
        },
        {
            icon: '🔔',
            title: 'Notificações e Atualizações',
            description: 'Receba notificações relevantes sem sobrecarga. O sistema informa sobre consultas próximas, pedidos de laboratório, mensagens de pacientes e atualizações importantes de forma organizada.',
            benefits: ['Central de notificações unificada', 'Configuração de preferências', 'Alertas prioritários', 'Resumos diários automatizados']
        },
        {
            icon: '🔒',
            title: 'Segurança e Perfis de Acesso',
            description: 'Controle quem acessa o quê na sua clínica. Defina permissões específicas para dentistas, recepcionistas, protéticos e administradores. Seus dados sempre protegidos.',
            benefits: ['Perfis de acesso personalizáveis', 'Criptografia de dados', 'Logs de atividades', 'Conformidade com LGPD']
        }
    ];

    return (
        <div className="features-page">
            <style jsx>{`
                .features-page {
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
                    max-width: 600px;
                    margin: 0 auto;
                }

                /* Features */
                .features-section {
                    padding: 4rem 0;
                }

                .features-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .feature-block {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                    align-items: center;
                    padding: 3rem 0;
                    border-bottom: 1px solid #E2E8F0;
                }

                @media (min-width: 768px) {
                    .feature-block {
                        grid-template-columns: 1fr 1fr;
                        gap: 4rem;
                    }

                    .feature-block:nth-child(even) {
                        direction: rtl;
                    }

                    .feature-block:nth-child(even) > * {
                        direction: ltr;
                    }
                }

                .feature-block:last-child {
                    border-bottom: none;
                }

                .feature-content {
                    
                }

                .feature-icon {
                    width: 4rem;
                    height: 4rem;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.1));
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                    margin-bottom: 1.5rem;
                }

                .feature-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0F172A;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }

                .feature-description {
                    font-size: 1rem;
                    color: #64748B;
                    line-height: 1.7;
                    margin-bottom: 1.5rem;
                }

                .feature-benefits {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.625rem;
                }

                .feature-benefits li {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    font-size: 0.9375rem;
                    color: #1E293B;
                }

                .feature-benefits li::before {
                    content: '✓';
                    color: #2563EB;
                    font-weight: 700;
                }

                .feature-note {
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    background: #FEF3C7;
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    color: #92400E;
                }

                .feature-visual {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 1rem;
                    padding: 2rem;
                    min-height: 280px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .visual-placeholder {
                    text-align: center;
                    color: #94A3B8;
                }

                .visual-placeholder-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                /* CTA */
                .cta-section {
                    padding: 5rem 0;
                    background: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%);
                    color: white;
                    text-align: center;
                }

                .cta-container {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .cta-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }

                @media (min-width: 768px) {
                    .cta-title {
                        font-size: 2.5rem;
                    }
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
                    <div className="hero-badge">Plataforma Completa</div>
                    <h1 className="hero-title">Funcionalidades</h1>
                    <p className="hero-subtitle">
                        Todas as ferramentas que você precisa para gerir sua clínica odontológica
                        com clareza, eficiência e organização.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="features-container">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-block">
                            <div className="feature-content">
                                <div className="feature-icon">{feature.icon}</div>
                                <h2 className="feature-title">{feature.title}</h2>
                                <p className="feature-description">{feature.description}</p>
                                <ul className="feature-benefits">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                                {feature.note && (
                                    <div className="feature-note">⚠️ {feature.note}</div>
                                )}
                            </div>
                            <div className="feature-visual">
                                <div className="visual-placeholder">
                                    <div className="visual-placeholder-icon">{feature.icon}</div>
                                    <div>Visualização Interativa</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Pronto para começar?</h2>
                    <p className="cta-subtitle">
                        Experimente todas as funcionalidades gratuitamente por 14 dias.
                    </p>
                    <a href="/login" className="cta-btn">Iniciar Teste Grátis</a>
                </div>
            </section>
        </div>
    );
}
