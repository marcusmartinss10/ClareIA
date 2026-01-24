
'use client';

import React, { useEffect, useState } from 'react';
import { Plan, Subscription } from '@/lib/plans';
import PlanCard from '@/components/PlanCard';

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

    const handleUpgrade = async (planId: string) => {
        // Mock upgrade action for now
        alert(`Solicitação de upgrade para o plano ${planId} enviada! Em breve integrado com pagamento.`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Gerencie sua Assinatura</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Escolha o plano ideal para o tamanho da sua clínica. Faça upgrade a qualquer momento para desbloquear novas funcionalidades.
                </p>

                {/* Cycle Toggle */}
                <div className="flex items-center justify-center mt-8 gap-4">
                    <span className={`text-sm font-medium ${cycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensal</span>
                    <button
                        onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-14 h-7 bg-slate-700 rounded-full transition-colors focus:outline-none"
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-cyan-500 rounded-full transition-transform ${cycle === 'yearly' ? 'translate-x-7' : ''}`} />
                    </button>
                    <span className={`text-sm font-medium ${cycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                        Anual <span className="text-cyan-500 text-xs ml-1">(-15%)</span>
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        cycle={cycle}
                        isCurrent={subscription?.plan_id === plan.id}
                        onUpgrade={handleUpgrade}
                    />
                ))}
            </div>

            <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Precisa de um plano customizado?</h3>
                <p className="text-slate-400 mb-6">
                    Para redes de clínicas com mais de 10 unidades, entre em contato com nosso time de vendas.
                </p>
                <button className="px-6 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
                    Falar com Consultor
                </button>
            </div>
        </div>
    );
}
