'use client';

import { useState, useEffect } from 'react';

interface Metricas {
  atendimentos: number;
  atendimentosConcluidos: number;
  tempoMedio: number;
  tempoTotal: number;
  receita: number;
  taxaOcupacao: number;
}

interface ProdutividadeDentista {
  id: string;
  nome: string;
  atendimentos: number;
  tempoMedio: number;
  tempoTotal: number;
}

interface PaymentSummary {
  CASH: { count: number; total: number };
  CARD: { count: number; total: number };
  PIX: { count: number; total: number };
  DENTAL_PLAN: { count: number; total: number };
}

interface Procedimento {
  id: string;
  paciente: string;
  procedimento: string;
  data: string;
  valor: number;
  status: 'pago' | 'pendente';
}

export default function ReportsPage() {
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes'>('mes');
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [pagamentos, setPagamentos] = useState<PaymentSummary | null>(null);
  const [produtividade, setProdutividade] = useState<ProdutividadeDentista[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?periodo=${periodo}`);
      if (res.ok) {
        const data = await res.json();
        setMetricas(data.metricas);
        setPagamentos(data.pagamentos);
        setProdutividade(data.produtividade || []);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }

    // Procedimentos ainda com dados de exemplo
    setProcedimentos([
      { id: '1', paciente: 'Ana Souza', procedimento: 'Limpeza Dental', data: '22 Jan, 2026', valor: 250, status: 'pago' },
      { id: '2', paciente: 'Carlos Mendes', procedimento: 'Tratamento de Canal', data: '21 Jan, 2026', valor: 1200, status: 'pendente' },
      { id: '3', paciente: 'Julia Pereira', procedimento: 'Implante Unitário', data: '20 Jan, 2026', valor: 3500, status: 'pago' },
    ]);
    setLoading(false);
  };

  const formatarTempo = (minutos: number) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getPaymentLabel = (method: string) => {
    const labels: Record<string, string> = {
      CASH: '💵 Dinheiro',
      CARD: '💳 Cartão',
      PIX: '📱 PIX',
      DENTAL_PLAN: '🏥 Plano',
    };
    return labels[method] || method;
  };

  return (
    <div className="reports-dark">
      <style jsx>{`
                /* Dark Liquid Glass Reports */
                .reports-dark {
                    min-height: 100%;
                    color: #f8fafc;
                    position: relative;
                }

                /* Ambient Blobs */
                .ambient-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                    z-index: 0;
                    mix-blend-mode: screen;
                }

                .blob-1 {
                    top: -20%;
                    left: -10%;
                    width: 600px;
                    height: 600px;
                    background: rgba(6, 182, 212, 0.2);
                    animation: float 10s infinite ease-in-out;
                }

                .blob-2 {
                    bottom: -10%;
                    right: -5%;
                    width: 500px;
                    height: 500px;
                    background: rgba(16, 185, 129, 0.1);
                    animation: float 10s infinite ease-in-out 2s;
                }

                .blob-3 {
                    top: 40%;
                    left: 40%;
                    width: 400px;
                    height: 400px;
                    background: rgba(139, 92, 246, 0.1);
                    animation: float 10s infinite ease-in-out 4s;
                }

                @keyframes float {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                /* Header */
                .page-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    position: relative;
                    z-index: 10;
                }

                @media (min-width: 1024px) {
                    .page-header {
                        flex-direction: row;
                        align-items: flex-end;
                        justify-content: space-between;
                    }
                }

                .page-title-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .analytics-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                }

                .analytics-badge span:first-child {
                    padding: 0.25rem 0.5rem;
                    background: rgba(6, 182, 212, 0.1);
                    color: #22d3ee;
                    font-size: 0.625rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border-radius: 9999px;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }

                .analytics-badge span:last-child {
                    color: #475569;
                    font-size: 0.75rem;
                }

                .page-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    background: linear-gradient(to right, white, white, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.02em;
                }

                .page-subtitle {
                    color: #64748b;
                    font-size: 1.125rem;
                    font-weight: 300;
                    max-width: 40rem;
                }

                /* Toolbar */
                .toolbar {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .period-toggle {
                    display: flex;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 0.75rem;
                    padding: 0.25rem;
                }

                .period-btn {
                    padding: 0.375rem 1rem;
                    background: transparent;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .period-btn.active {
                    background: rgba(6, 182, 212, 0.2);
                    color: white;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
                }

                .period-btn:hover:not(.active) {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .toolbar-divider {
                    width: 1px;
                    height: 1.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0 0.25rem;
                }

                .toolbar-btn {
                    width: 2.5rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .toolbar-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: white;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                }

                .stat-glow {
                    position: absolute;
                    top: -1.5rem;
                    right: -1.5rem;
                    width: 6rem;
                    height: 6rem;
                    border-radius: 50%;
                    filter: blur(40px);
                    transition: all 0.3s;
                }

                .stat-card:hover .stat-glow {
                    opacity: 0.8;
                    transform: scale(1.2);
                }

                .glow-cyan { background: rgba(6, 182, 212, 0.2); }
                .glow-emerald { background: rgba(16, 185, 129, 0.15); }
                .glow-purple { background: rgba(139, 92, 246, 0.15); }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .stat-icon {
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    font-size: 1.5rem;
                }

                .stat-icon.cyan { color: #22d3ee; }
                .stat-icon.emerald { color: #34d399; }
                .stat-icon.purple { color: #a78bfa; }

                .stat-trend {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }

                .stat-value {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    transition: color 0.3s;
                }

                .stat-card:hover .stat-value.cyan { color: #22d3ee; }
                .stat-card:hover .stat-value.emerald { color: #34d399; }
                .stat-card:hover .stat-value.purple { color: #a78bfa; }

                .stat-sub {
                    font-size: 0.75rem;
                    color: #475569;
                    margin-top: 0.5rem;
                }

                /* Chart Section */
                .chart-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .chart-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                @media (min-width: 768px) {
                    .chart-header {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                }

                .chart-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .chart-value {
                    font-size: 1.875rem;
                    font-weight: 900;
                    background: linear-gradient(to right, #22d3ee, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .chart-legend {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    font-size: 0.875rem;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .legend-dot {
                    width: 0.75rem;
                    height: 0.75rem;
                    border-radius: 50%;
                }

                .legend-dot.solid {
                    background: #22d3ee;
                    box-shadow: 0 0 8px rgba(34, 211, 238, 0.8);
                }

                .legend-dot.dashed {
                    background: transparent;
                    border: 2px dashed #475569;
                }

                .chart-container {
                    width: 100%;
                    height: 300px;
                    position: relative;
                }

                .chart-grid {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: #334155;
                    pointer-events: none;
                }

                .chart-grid-line {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding-bottom: 0.25rem;
                }

                .chart-svg {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 10;
                    filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.5));
                }

                .chart-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    font-size: 0.75rem;
                    color: #475569;
                    font-weight: 500;
                }

                /* Table Section */
                .table-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    margin-bottom: 2rem;
                }

                .table-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .table-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                }

                .table-link {
                    font-size: 0.75rem;
                    color: #22d3ee;
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .table-link:hover {
                    color: white;
                }

                .glass-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .glass-table thead tr {
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .glass-table th {
                    padding: 1rem 1.5rem;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #475569;
                    text-align: left;
                }

                .glass-table tbody tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    transition: background 0.2s;
                }

                .glass-table tbody tr:last-child {
                    border-bottom: none;
                }

                .glass-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .glass-table td {
                    padding: 1rem 1.5rem;
                    font-size: 0.875rem;
                }

                .dentista-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .dentista-avatar {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 0.75rem;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
                }

                .dentista-name {
                    font-weight: 500;
                    color: #e2e8f0;
                }

                .valor-cell {
                    font-weight: 600;
                    color: white;
                    text-align: right;
                }

                .status-badge {
                    display: inline-flex;
                    padding: 0.25rem 0.625rem;
                    border-radius: 9999px;
                    font-size: 0.6875rem;
                    font-weight: 500;
                }

                .status-pago {
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .status-pendente {
                    background: rgba(245, 158, 11, 0.1);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }

                .bar-container {
                    width: 100px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #06b6d4, #34d399);
                    border-radius: 3px;
                    box-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
                }

                .loading {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #64748b;
                }

                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid rgba(6, 182, 212, 0.2);
                    border-top-color: #22d3ee;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .page-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

      {/* Ambient Blobs */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <div className="analytics-badge">
            <span>Analytics</span>
            <span>Atualizado agora</span>
          </div>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-subtitle">
            Visão geral de desempenho financeiro e eficiência clínica com dados em tempo real.
          </p>
        </div>
        <div className="toolbar">
          <div className="period-toggle">
            <button className={`period-btn ${periodo === 'mes' ? 'active' : ''}`} onClick={() => setPeriodo('mes')}>Mês</button>
            <button className={`period-btn ${periodo === 'semana' ? 'active' : ''}`} onClick={() => setPeriodo('semana')}>Semana</button>
            <button className={`period-btn ${periodo === 'dia' ? 'active' : ''}`} onClick={() => setPeriodo('dia')}>Dia</button>
          </div>
          <div className="toolbar-divider" />
          <button className="toolbar-btn" title="Exportar PDF">📄</button>
          <button className="toolbar-btn" title="Exportar Excel">📊</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Carregando relatórios...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-glow glow-cyan" />
              <div className="stat-header">
                <div className="stat-icon cyan">🦷</div>
                <span className="stat-trend">↑ +12%</span>
              </div>
              <p className="stat-label">Atendimentos</p>
              <h3 className="stat-value cyan">+{metricas?.atendimentos || 0}</h3>
              <p className="stat-sub">vs. período anterior</p>
            </div>
            <div className="stat-card">
              <div className="stat-glow glow-emerald" />
              <div className="stat-header">
                <div className="stat-icon emerald">💰</div>
                <span className="stat-trend">↑ +8%</span>
              </div>
              <p className="stat-label">Receita Total</p>
              <h3 className="stat-value emerald">{formatarMoeda(metricas?.receita || 0)}</h3>
              <p className="stat-sub">Tempo médio: {formatarTempo(metricas?.tempoMedio || 0)}</p>
            </div>
            <div className="stat-card">
              <div className="stat-glow glow-purple" />
              <div className="stat-header">
                <div className="stat-icon purple">📊</div>
                <span className="stat-trend">↑ +2%</span>
              </div>
              <p className="stat-label">Taxa de Ocupação</p>
              <h3 className="stat-value purple">{metricas?.taxaOcupacao || 0}%</h3>
              <p className="stat-sub">Tempo total: {formatarTempo(metricas?.tempoTotal || 0)}</p>
            </div>
          </div>

          {/* Payment Methods Summary */}
          {pagamentos && (
            <div className="chart-panel" style={{ marginBottom: '2rem' }}>
              <div className="chart-header">
                <div>
                  <h2 className="chart-title">💳 Formas de Pagamento</h2>
                  <span className="chart-value" style={{ fontSize: '1.25rem' }}>Resumo por método</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {(['CASH', 'CARD', 'PIX', 'DENTAL_PLAN'] as const).map((method) => (
                  <div key={method} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{getPaymentLabel(method)}</span>
                    <span style={{ color: '#22d3ee', fontSize: '1.5rem', fontWeight: 700 }}>
                      {pagamentos[method].count} pagamentos
                    </span>
                    <span style={{ color: '#34d399', fontSize: '1.25rem' }}>
                      {formatarMoeda(pagamentos[method].total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="chart-panel">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">Fluxo de Caixa 📈</h2>
                <span className="chart-value">{formatarMoeda(metricas?.receita || 0)}</span>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot solid" />
                  <span style={{ color: '#cbd5e1' }}>Receita Real</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dashed" />
                  <span style={{ color: '#475569' }}>Meta Projetada</span>
                </div>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-grid">
                <div className="chart-grid-line">150k</div>
                <div className="chart-grid-line">100k</div>
                <div className="chart-grid-line">50k</div>
                <div className="chart-grid-line">0k</div>
              </div>
              <svg className="chart-svg" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,250 C100,250 150,180 200,160 C250,140 300,200 350,180 C400,160 450,80 500,100 C550,120 600,60 650,50 C700,40 750,90 800,70 C850,50 900,20 1000,40"
                  fill="url(#chartGradient)"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="160" r="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                <circle cx="500" cy="100" r="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                <circle cx="800" cy="70" r="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
              </svg>
            </div>
            <div className="chart-labels">
              <span>Semana 1</span>
              <span>Semana 2</span>
              <span>Semana 3</span>
              <span>Semana 4</span>
            </div>
          </div>

          {/* Productivity Table */}
          <div className="table-panel">
            <div className="table-header">
              <h3 className="table-title">Produtividade por Dentista</h3>
            </div>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Dentista</th>
                  <th>Atendimentos</th>
                  <th>Tempo Médio</th>
                  <th>Tempo Total</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {produtividade.map((dentista) => {
                  const maxAtendimentos = Math.max(...produtividade.map(d => d.atendimentos));
                  const percentual = (dentista.atendimentos / maxAtendimentos) * 100;
                  return (
                    <tr key={dentista.id}>
                      <td>
                        <div className="dentista-cell">
                          <div className="dentista-avatar">
                            {dentista.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="dentista-name">{dentista.nome}</span>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8' }}>{dentista.atendimentos}</td>
                      <td style={{ color: '#94a3b8' }}>{formatarTempo(dentista.tempoMedio)}</td>
                      <td style={{ color: '#94a3b8' }}>{formatarTempo(dentista.tempoTotal)}</td>
                      <td>
                        <div className="bar-container">
                          <div className="bar-fill" style={{ width: `${percentual}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Procedures Table */}
          <div className="table-panel">
            <div className="table-header">
              <h3 className="table-title">Procedimentos Recentes</h3>
              <span className="table-link">Ver todos</span>
            </div>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {procedimentos.map((proc) => (
                  <tr key={proc.id}>
                    <td>
                      <div className="dentista-cell">
                        <div className="dentista-avatar">
                          {proc.paciente.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="dentista-name">{proc.paciente}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{proc.procedimento}</td>
                    <td style={{ color: '#64748b' }}>{proc.data}</td>
                    <td className="valor-cell">{formatarMoeda(proc.valor)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${proc.status === 'pago' ? 'status-pago' : 'status-pendente'}`}>
                        {proc.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
