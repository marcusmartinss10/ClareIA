'use client';

import { useState, useEffect, useMemo } from 'react';

interface KPIs {
  faturamentoMensal: number;
  crescimento: number;
  lucroLiquido: number;
  taxaInadimplencia: number;
  ticketMedio: number;
}

interface ChartDataPoint {
  month: string;
  fullMonth: string;
  revenue: number;
  count: number;
}

interface Transaction {
  id: string;
  date: string;
  patient: string;
  procedure: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

interface FinancialData {
  kpis: KPIs;
  chartData: ChartDataPoint[];
  transactions: Transaction[];
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinancialData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'flow'>('overview');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports/financial');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch financial data', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate chart path for SVG
  const chartPath = useMemo(() => {
    if (!data?.chartData || data.chartData.length === 0) return { line: '', fill: '' };

    const maxRevenue = Math.max(...data.chartData.map(d => d.revenue), 1);
    const width = 1000;
    const height = 250;
    const padding = 20;

    const points = data.chartData.map((d, i) => {
      const x = padding + (i / (data.chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.revenue / maxRevenue) * (height - 2 * padding));
      return { x, y };
    });

    // Create smooth curve path
    let linePath = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      linePath += ` Q${cpx},${prev.y} ${cpx},${(prev.y + curr.y) / 2}`;
      linePath += ` Q${cpx},${curr.y} ${curr.x},${curr.y}`;
    }

    // Fill path
    const fillPath = linePath + ` L${width - padding},${height} L${padding},${height} Z`;

    return { line: linePath, fill: fillPath };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      COMPLETED: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Pago' },
      PENDING: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Pendente' },
      CANCELED: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', label: 'Atrasado' },
    };
    const style = styles[status] || styles.PENDING;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${style.bg} ${style.text} text-[10px] font-bold border shadow-sm`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`}></span>
        {style.label}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500/20 text-blue-400', 'bg-purple-500/20 text-purple-400', 'bg-pink-500/20 text-pink-400', 'bg-orange-500/20 text-orange-400', 'bg-green-500/20 text-green-400'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen">
      <main className="px-4 py-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
            <div className="flex bg-white/5 p-1 rounded-full">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${activeTab === 'reports' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
              >
                Relatórios
              </button>
              <button
                onClick={() => setActiveTab('flow')}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${activeTab === 'flow' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
              >
                Fluxo
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10" />
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Faturamento Mensal */}
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-all border-b-2 border-b-primary shadow-[0_10px_15px_-10px_rgba(13,185,242,0.5)]">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Faturamento Mensal</p>
                <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(data?.kpis.faturamentoMensal || 0)}</h3>
                <p className={`text-xs mt-2 flex items-center gap-1 font-bold ${(data?.kpis.crescimento ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={(data?.kpis.crescimento ?? 0) >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                  </svg>
                  {(data?.kpis.crescimento ?? 0) >= 0 ? '+' : ''}{data?.kpis.crescimento ?? 0}%
                </p>
              </div>

              {/* Lucro Líquido */}
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-all border-b-2 border-b-primary shadow-[0_10px_15px_-10px_rgba(13,185,242,0.5)]">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Lucro Líquido</p>
                <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(data?.kpis.lucroLiquido || 0)}</h3>
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1 font-bold">
                  <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +8.2%
                </p>
              </div>

              {/* Inadimplência */}
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-all border-b-2 border-b-rose-400 shadow-[0_10px_15px_-10px_rgba(244,63,94,0.5)]">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Inadimplência</p>
                <h3 className="text-2xl font-bold tracking-tight">{data?.kpis.taxaInadimplencia || 0}%</h3>
                <p className="text-rose-400 text-xs mt-2 flex items-center gap-1 font-bold">
                  <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  -1.5%
                </p>
              </div>

              {/* Ticket Médio */}
              <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-all border-b-2 border-b-primary shadow-[0_10px_15px_-10px_rgba(13,185,242,0.5)]">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Ticket Médio</p>
                <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(data?.kpis.ticketMedio || 0)}</h3>
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1 font-bold">
                  <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +3.1%
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold">Crescimento de Receita</h2>
                  <p className="text-xs text-white/40">Análise de desempenho dos últimos 12 meses</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold text-white/60">Faturamento</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-[10px] font-bold text-white/60">Projeção</span>
                  </div>
                </div>
              </div>

              {/* SVG Chart */}
              <div className="h-64 relative">
                {data?.chartData && data.chartData.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#0db9f2', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0db9f2', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: '#0db9f2', stopOpacity: 0 }} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <line
                        key={i}
                        x1="20"
                        y1={50 + i * 50}
                        x2="980"
                        y2={50 + i * 50}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Fill area */}
                    <path d={chartPath.fill} fill="url(#fillGradient)" />

                    {/* Line */}
                    <path
                      d={chartPath.line}
                      fill="none"
                      stroke="url(#glowGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />

                    {/* Data points */}
                    {data.chartData.map((d, i) => {
                      const maxRevenue = Math.max(...data.chartData.map(p => p.revenue), 1);
                      const x = 20 + (i / (data.chartData.length - 1)) * 960;
                      const y = 250 - ((d.revenue / maxRevenue) * 200);
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="6" fill="#0db9f2" opacity="0.3" />
                          <circle cx={x} cy={y} r="3" fill="#0db9f2" />
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40">
                    Sem dados de faturamento
                  </div>
                )}

                {/* X-axis labels */}
                <div className="flex justify-between mt-4 px-2">
                  {data?.chartData?.map((d, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-bold ${i === data.chartData.length - 1 ? 'text-primary' : 'text-white/20'}`}
                    >
                      {d.month}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Fluxo de Caixa Detalhado</h2>
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Exportar CSV
                  <svg className="w-4 h-4" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs font-bold text-white/40 uppercase tracking-widest bg-white/2">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Paciente</th>
                      <th className="px-6 py-4">Procedimento</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {data?.transactions && data.transactions.length > 0 ? (
                      data.transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-white/2 transition-colors group">
                          <td className="px-6 py-4 text-white/60">{formatDate(t.date)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(t.patient)}`}>
                                {getInitials(t.patient)}
                              </div>
                              <span className="font-medium">{t.patient}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/60">{t.procedure}</td>
                          <td className="px-6 py-4 font-bold">{formatCurrency(t.amount)}</td>
                          <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                          Nenhuma transação encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
