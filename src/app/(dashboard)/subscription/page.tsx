
'use client';

import React, { useEffect, useState } from 'react';
import { Plan, Subscription } from '@/lib/plans';

export default function SubscriptionPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        async function fetchData() {
            try {
                const [plansRes, subRes] = await Promise.all([
                    fetch('/api/plans'),
                    fetch('/api/organization/subscription')
                ]);

                if (plansRes.ok) setPlans(await plansRes.json());
                if (subRes.ok) setSubscription(await subRes.json());
            } catch (error) {
                console.error('Error loading subscription data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleUpgrade = (planId: string) => {
        alert(`Solicitação de upgrade para o plano ${planId} enviada! Em breve integrado com pagamento.`);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const currentPlan = plans.find(p => p.id === subscription?.plan_id);

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

                .liquid-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.6;
                    animation: float 10s infinite ease-in-out;
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
                /* Font overrides */
                .font-display { font-family: 'Inter', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            {/* Background Liquidity */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="liquid-blob bg-cyan-500/20 w-[600px] h-[600px] -top-[200px] -left-[100px]"></div>
                <div className="liquid-blob bg-teal-600/20 w-[500px] h-[500px] bottom-[10%] right-[-100px]" style={{ animationDelay: '-2s' }}></div>
                <div className="liquid-blob bg-blue-600/10 w-[800px] h-[800px] top-[40%] left-[30%]" style={{ animationDelay: '-5s' }}></div>
            </div>

            <div className="relative flex flex-col items-center w-full z-10 font-display">

                {/* Central Glass Container */}
                <div className="glass-panel w-full max-w-[1100px] rounded-3xl p-6 md:p-10 lg:p-12 flex flex-col gap-10 mt-8">

                    {/* Header with Cycle Toggle */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                                Gerenciar Assinatura
                            </h1>
                            <p className="text-lg text-white/50 max-w-xl font-light">
                                Visualize o status da sua clínica, opções de upgrade e histórico.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                            <button
                                onClick={() => setCycle('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cycle === 'monthly' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-white/40 hover:text-white/70'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setCycle('yearly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cycle === 'yearly' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-white/40 hover:text-white/70'}`}
                            >
                                Anual <span className="ml-1 text-[10px] uppercase font-bold tracking-wider text-teal-400">-15% OFF</span>
                            </button>
                        </div>
                    </div>

                    {/* Current Plan High-Impact Card */}
                    {currentPlan && (
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-transparent border border-cyan-500/20 p-1 shadow-[0_0_30px_rgba(43,189,238,0.05)] group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-xl bg-[#0a0a0a]/40 backdrop-blur-md p-6 md:p-8">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">Plano Ativo</span>
                                        <span className="text-xs text-white/40 flex items-center gap-1">
                                            Renova em {(new Date()).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">{currentPlan.name}</h2>
                                    <p className="text-white/60 text-sm">
                                        {formatCurrency(cycle === 'monthly' ? Number(currentPlan.price_monthly) : Number(currentPlan.price_yearly))}
                                        /{cycle === 'monthly' ? 'mês' : 'ano'} • {currentPlan.max_dentists || 'Ilimitados'} dentistas
                                    </p>
                                </div>

                                {/* Mini Stats Grid */}
                                <div className="flex w-full md:w-auto flex-1 max-w-lg gap-4">
                                    <div className="glass-card flex-1 rounded-xl p-4 flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                                            <span>Dentistas</span>
                                            <span className="material-symbols-outlined text-[16px]">groups</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            3<span className="text-sm font-normal text-white/40">/{currentPlan.max_dentists || '∞'}</span>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-white/10 mt-2">
                                            <div className="h-1 rounded-full bg-cyan-500 w-[60%] shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div className="glass-card flex-1 rounded-xl p-4 flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                                            <span>IA Credits</span>
                                            <span className="material-symbols-outlined text-[16px]">psychology</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">85<span className="text-sm font-normal text-white/40">%</span></div>
                                        <div className="h-1 w-full rounded-full bg-white/10 mt-2">
                                            <div className="h-1 rounded-full bg-teal-400 w-[85%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Tiers */}
                    <div>
                        <h3 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-cyan-400">diamond</span> Planos Disponíveis
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {plans.map((plan) => {
                                const isCurrent = subscription?.plan_id === plan.id;
                                const price = cycle === 'monthly' ? Number(plan.price_monthly) : Number(plan.price_yearly);

                                return (
                                    <div
                                        key={plan.id}
                                        className={`glass-card rounded-2xl p-6 flex flex-col gap-6 relative group transition-colors 
                                        ${isCurrent ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.05)]' : 'hover:border-white/10'}`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Plano Atual</div>
                                        )}

                                        <div className="space-y-2 pt-2">
                                            <h4 className={`text-lg font-bold ${isCurrent ? 'text-cyan-400' : 'text-white/70'}`}>
                                                {plan.name}
                                            </h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-white">R$ {Math.floor(price)}</span>
                                                <span className="text-sm text-white/40">/{cycle === 'monthly' ? 'mês' : 'ano'}</span>
                                            </div>
                                            <p className="text-sm text-white/50">
                                                {plan.max_dentists ? `Até ${plan.max_dentists} dentistas` : 'Dentistas ilimitados'}
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <span className="material-symbols-outlined text-teal-400 text-[18px]">check_circle</span>
                                                Agenda {plan.features.agenda === 'advanced' ? 'Avançada' : 'Básica'}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <span className={`material-symbols-outlined text-[18px] ${plan.features.crm === 'advanced' ? 'text-teal-400' : 'text-white/30'}`}>
                                                    {plan.features.crm === 'advanced' ? 'check_circle' : 'cancel'}
                                                </span>
                                                CRM Avançado
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <span className={`material-symbols-outlined text-[18px] ${plan.features.prosthetics ? 'text-teal-400' : 'text-white/30'}`}>
                                                    {plan.features.prosthetics ? 'check_circle' : 'cancel'}
                                                </span>
                                                Gestão de Próteses
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <span className={`material-symbols-outlined text-[18px] ${plan.features.ai_dashboard ? 'text-teal-400' : 'text-white/30'}`}>
                                                    {plan.features.ai_dashboard ? 'check_circle' : 'cancel'}
                                                </span>
                                                Dashboard IA
                                            </div>
                                        </div>

                                        <button
                                            disabled={isCurrent}
                                            onClick={() => handleUpgrade(plan.id)}
                                            className={`w-full py-3 rounded-lg text-sm font-semibold transition-all
                                            ${isCurrent
                                                    ? 'bg-white/5 text-white/30 cursor-default border border-transparent'
                                                    : 'glass-button text-white hover:text-cyan-400'}`}
                                        >
                                            {isCurrent ? 'Plano Atual' : 'Fazer Upgrade'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Billing History Table (Static Mock per design) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white/90 flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/60">receipt_long</span> Histórico de Faturas
                            </h3>
                            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Ver Todas</button>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                            <div className="w-full text-left text-sm">
                                <div className="grid grid-cols-4 gap-4 border-b border-white/5 p-4 text-xs font-medium uppercase tracking-wider text-white/40">
                                    <div>Data</div>
                                    <div>Fatura</div>
                                    <div>Valor</div>
                                    <div className="text-right">Status</div>
                                </div>
                                {/* Mock Rows */}
                                <div className="glass-table-row grid grid-cols-4 gap-4 p-4 items-center transition-colors cursor-pointer border-b border-white/5">
                                    <div className="text-white/80">12 Out, 2023</div>
                                    <div className="text-white/60 font-mono text-xs">INV-2023-001</div>
                                    <div className="text-white/80">R$ 299,00</div>
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
        </>
    );
}
