
import React from 'react';
import { Plan } from '@/lib/plans';

interface PlanCardProps {
    plan: Plan;
    isCurrent?: boolean;
    cycle: 'monthly' | 'yearly';
    onUpgrade?: (planId: string) => void;
}

export default function PlanCard({ plan, isCurrent = false, cycle, onUpgrade }: PlanCardProps) {
    const price = cycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
    const period = cycle === 'monthly' ? '/mês' : '/ano';

    // Feature formatting logic
    const featuresList = [
        { label: 'Dentistas', value: plan.max_dentists ? `Até ${plan.max_dentists}` : 'Ilimitado' },
        { label: 'Agenda', value: plan.features.agenda === 'advanced' ? 'Avançada' : 'Básica' },
        { label: 'CRM', value: plan.features.crm === 'advanced' ? 'Avançado' : 'Básico' },
        { label: 'Protéticos', value: plan.features.prosthetics ? 'Incluso' : 'Não incluso', available: plan.features.prosthetics },
        { label: 'Dashboard IA', value: plan.features.ai_dashboard ? 'Incluso' : 'Não incluso', available: plan.features.ai_dashboard },
        { label: 'Multiclínica', value: plan.features.multiclinic ? 'Incluso' : 'Não incluso', available: plan.features.multiclinic },
    ];

    return (
        <div className={`
            relative flex flex-col p-6 rounded-2xl border transition-all duration-300
            ${isCurrent
                ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'}
        `}>
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Plano Atual
                </div>
            )}

            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1 text-white">
                    <span className="text-3xl font-bold">R$ {price.toFixed(2).replace('.', ',')}</span>
                    <span className="text-slate-400 text-sm mb-1">{period}</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
                {featuresList.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{feature.label}</span>
                        <span className={`font-medium ${feature.available === false ? 'text-slate-600' : 'text-slate-200'
                            }`}>
                            {feature.value}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onUpgrade?.(plan.id)}
                disabled={isCurrent}
                className={`
                    w-full py-3 rounded-lg font-semibold transition-all
                    ${isCurrent
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 active:scale-95'}
                `}
            >
                {isCurrent ? 'Seu Plano' : 'Selecionar Plano'}
            </button>
        </div>
    );
}
