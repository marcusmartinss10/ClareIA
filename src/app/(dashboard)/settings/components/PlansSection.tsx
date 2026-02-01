import { useState } from 'react';

interface PlansSectionProps {
    currentPlan?: string;
}

export function PlansSection({ currentPlan = 'pro' }: PlansSectionProps) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plan = {
        id: 'pro',
        name: 'ClareIA Pro',
        priceMonthly: 149.90,
        priceYearly: 1349.10, // ~R$112.42/mês (25% desconto)
        features: [
            'Agenda Inteligente com IA',
            'Gestão de Pacientes Ilimitada',
            'Relatórios Financeiros Completos',
            'Integração com Laboratórios',
            'Membros da Equipe Ilimitados',
            'Dashboard com IA',
            'Suporte Prioritário',
            'Backup Automático Diário',
            'Atualizações Gratuitas',
            'Conformidade LGPD'
        ]
    };

    const getPrice = () => {
        if (billingCycle === 'monthly') {
            return {
                value: plan.priceMonthly.toFixed(2).replace('.', ','),
                label: '/mês'
            };
        } else {
            const monthlyEquivalent = (plan.priceYearly / 12).toFixed(2).replace('.', ',');
            return {
                value: monthlyEquivalent,
                label: '/mês'
            };
        }
    };

    const price = getPrice();
    const isCurrent = currentPlan === plan.id;

    return (
        <div className="relative w-full min-h-screen text-white font-sans overflow-hidden">
            {/* Global Styles for this component */}
            <style jsx global>{`
                .liquid-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.6;
                    animation: float 10s infinite ease-in-out;
                    pointer-events: none;
                }
                @keyframes float {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.1); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(24px) saturate(150%);
                    -webkit-backdrop-filter: blur(24px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .glass-card {
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                }
                .glass-button {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                .glass-button:hover {
                    background: rgba(43, 189, 238, 0.15);
                    border-color: rgba(43, 189, 238, 0.4);
                    box-shadow: 0 0 15px rgba(43, 189, 238, 0.2);
                }
                .glass-table-row:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
            `}</style>

            {/* Background Liquidity */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="liquid-blob bg-[#2bbdee]/40 w-[600px] h-[600px] -top-[200px] -left-[100px]"></div>
                <div className="liquid-blob bg-teal-600/30 w-[500px] h-[500px] bottom-[10%] right-[-100px]" style={{ animationDelay: '-2s' }}></div>
                <div className="liquid-blob bg-blue-600/20 w-[800px] h-[800px] top-[40%] left-[30%]" style={{ animationDelay: '-5s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-[900px] mx-auto p-4 md:p-8 lg:p-10 gap-10">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                            Sua Assinatura
                        </h1>
                        <p className="text-lg text-white/50 max-w-xl font-light">
                            Um plano simples com todos os recursos incluídos.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${billingCycle === 'monthly' ? 'bg-[#2bbdee] text-[#050505]' : 'text-white/60 hover:text-white'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#2bbdee] text-[#050505]' : 'text-white/60 hover:text-white'}`}
                            >
                                Anual <span className="text-[10px] bg-white/20 px-1.5 rounded-full">-25%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Plan Card */}
                <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2bbdee]/10 via-teal-500/5 to-transparent border border-[#2bbdee]/20 p-1 shadow-[0_0_30px_rgba(43,189,238,0.05)] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2bbdee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-xl bg-[#0a0a0a]/40 backdrop-blur-md p-6 md:p-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-[#2bbdee]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2bbdee] border border-[#2bbdee]/20 shadow-[0_0_10px_rgba(43,189,238,0.2)]">
                                    {isCurrent ? 'Plano Ativo' : 'Acesso Total'}
                                </span>
                                {isCurrent && <span className="text-xs text-white/40">Renova em 12 Mar, 2026</span>}
                            </div>
                            <h2 className="text-3xl font-bold text-white">{plan.name}</h2>
                            <p className="text-white/60 text-sm">
                                R$ {price.value}{price.label} • Tudo incluído, sem limitações
                            </p>
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="flex w-full md:w-auto flex-1 max-w-lg gap-4">
                            <div className="glass-card flex-1 rounded-xl p-4 flex flex-col gap-1">
                                <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                                    <span>Membros</span>
                                    <span className="material-symbols-outlined text-[16px]">groups</span>
                                </div>
                                <div className="text-xl font-bold text-white">∞</div>
                                <div className="text-xs text-white/40">Ilimitados</div>
                            </div>
                            <div className="glass-card flex-1 rounded-xl p-4 flex flex-col gap-1">
                                <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                                    <span>Pacientes</span>
                                    <span className="material-symbols-outlined text-[16px]">person</span>
                                </div>
                                <div className="text-xl font-bold text-white">∞</div>
                                <div className="text-xs text-white/40">Ilimitados</div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <button className="glass-button bg-white text-black hover:bg-white/90 hover:text-black border-none px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-white/5 transition-transform hover:-translate-y-0.5">
                                Gerenciar Pagamento
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="w-full">
                    <h3 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#2bbdee]">check_circle</span>
                        Tudo o que Está Incluído
                    </h3>
                    <div className="glass-card rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-white/80">
                                <span className="material-symbols-outlined text-[18px] text-[#2bbdee]">check_circle</span>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Billing History Table */}
                <div className="w-full flex flex-col gap-4 mb-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white/90 flex items-center gap-2">
                            <span className="material-symbols-outlined text-white/60">receipt_long</span> Histórico de Faturas
                        </h3>
                        <button className="text-sm text-[#2bbdee] hover:text-[#2bbdee]/80 font-medium transition-colors">Ver Todas</button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                        <div className="w-full text-left text-sm">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 gap-4 border-b border-white/5 p-4 text-xs font-medium uppercase tracking-wider text-white/40">
                                <div>Data</div>
                                <div>Fatura</div>
                                <div>Valor</div>
                                <div className="text-right">Status</div>
                            </div>
                            {/* Table Rows */}
                            <div className="glass-table-row grid grid-cols-4 gap-4 p-4 items-center transition-colors cursor-pointer border-b border-white/5">
                                <div className="text-white/80">12 Mar, 2026</div>
                                <div className="text-white/60 font-mono text-xs">INV-2026-003</div>
                                <div className="text-white/80">R$ 149,90</div>
                                <div className="flex justify-end items-center gap-4">
                                    <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400 ring-1 ring-inset ring-teal-500/20">Pago</span>
                                    <span className="material-symbols-outlined text-white/30 hover:text-white transition-colors text-[20px]">download</span>
                                </div>
                            </div>
                            <div className="glass-table-row grid grid-cols-4 gap-4 p-4 items-center transition-colors cursor-pointer border-b border-white/5">
                                <div className="text-white/80">12 Fev, 2026</div>
                                <div className="text-white/60 font-mono text-xs">INV-2026-002</div>
                                <div className="text-white/80">R$ 149,90</div>
                                <div className="flex justify-end items-center gap-4">
                                    <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400 ring-1 ring-inset ring-teal-500/20">Pago</span>
                                    <span className="material-symbols-outlined text-white/30 hover:text-white transition-colors text-[20px]">download</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
