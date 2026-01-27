'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ReportStats {
  summary: {
    totalAppointments: number;
    completed: number;
    canceled: number;
    completionRate: number;
    newPatients: number;
  };
  chartData: { day: number; count: number }[];
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    fetchReports();
  }, [selectedMonth]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports/stats?month=${selectedMonth}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <style jsx global>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border-radius: 1.5rem;
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            line-height: 1;
        }
        .stat-label {
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-slate-400">Análise de desempenho da clínica</p>
        </div>

        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <span className="text-slate-400 text-sm font-bold">Mês:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-white border-none outline-none font-bold cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Carregando dados...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">📅</div>
              <p className="stat-label mb-2">Total Agendamentos</p>
              <div className="stat-value">{stats?.summary.totalAppointments}</div>
            </div>

            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">✅</div>
              <p className="stat-label mb-2">Taxa de Conclusão</p>
              <div className="stat-value text-green-400">{stats?.summary.completionRate}%</div>
              <p className="text-xs text-slate-500 mt-2">{stats?.summary.completed} concluídos</p>
            </div>

            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🚫</div>
              <p className="stat-label mb-2">Cancelamentos</p>
              <div className="stat-value text-red-400">{stats?.summary.canceled}</div>
            </div>

            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">👥</div>
              <p className="stat-label mb-2">Novos Pacientes</p>
              <div className="stat-value text-cyan-400">{stats?.summary.newPatients}</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Appointments Chart */}
            <div className="glass-card p-6 lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-6">Agendamentos por Dia</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {stats?.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side Panel (Top Treatments or other info) */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Insights</h3>
              <p className="text-slate-400 text-sm mb-4">
                Resumo rápido do mês selecionado.
              </p>
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Dia Mais Movimentado</span>
                  <span className="text-lg font-semibold text-white">
                    {stats?.chartData && stats.chartData.length > 0
                      ? `Dia ${stats.chartData.reduce((prev, current) => (prev.count > current.count) ? prev : current).day}`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Média Diária</span>
                  <span className="text-lg font-semibold text-white">
                    {stats?.chartData && stats.chartData.length > 0
                      ? (stats.summary.totalAppointments / stats.chartData.length).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
