'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  atendimentosHoje: number;
  agendamentosHoje: number;
  pacientesAtivos: number;
  tempoMedioAtendimento: number;
}

interface AgendamentoHoje {
  id: string;
  horario: string;
  paciente: string;
  motivo: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    atendimentosHoje: 0,
    agendamentosHoje: 0,
    pacientesAtivos: 0,
    tempoMedioAtendimento: 0,
  });
  const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoHoje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setTimeout(() => {
      setStats({
        atendimentosHoje: 5,
        agendamentosHoje: 8,
        pacientesAtivos: 127,
        tempoMedioAtendimento: 32,
      });

      setAgendamentosHoje([
        { id: '1', horario: '08:00', paciente: 'Carlos Oliveira', motivo: 'Limpeza', status: 'COMPLETED' },
        { id: '2', horario: '09:00', paciente: 'Ana Paula Souza', motivo: 'Clareamento', status: 'COMPLETED' },
        { id: '3', horario: '10:00', paciente: 'Roberto Ferreira', motivo: 'Manutenção de aparelho', status: 'IN_PROGRESS' },
        { id: '4', horario: '11:00', paciente: 'Maria Santos', motivo: 'Avaliação', status: 'SCHEDULED' },
        { id: '5', horario: '14:00', paciente: 'João Silva', motivo: 'Extração', status: 'SCHEDULED' },
      ]);

      setLoading(false);
    }, 500);
  };

  const formatMinutes = (minutes: number) => {
    return `${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      COMPLETED: { label: 'Concluído', class: 'badge-success' },
      IN_PROGRESS: { label: 'Em andamento', class: 'badge-warning' },
      SCHEDULED: { label: 'Agendado', class: 'badge-gray' },
    };
    return badges[status] || { label: status, class: 'badge-gray' };
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="dashboard-dark">
      <style jsx>{`
                /* Dark Liquid Glass Dashboard */
                .dashboard-dark {
                    min-height: 100vh;
                    background: #020617;
                    color: #f8fafc;
                    position: relative;
                    overflow: hidden;
                }

                /* Liquid Background */
                .liquid-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                    background: radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%);
                }

                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.5;
                    animation: float 20s infinite ease-in-out;
                    mix-blend-mode: screen;
                }

                @keyframes float {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -40px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                .orb-1 {
                    top: -15%;
                    left: -10%;
                    width: 60vw;
                    height: 60vw;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
                    animation-duration: 25s;
                }

                .orb-2 {
                    bottom: -20%;
                    right: -5%;
                    width: 50vw;
                    height: 50vw;
                    background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
                    animation-duration: 22s;
                    animation-delay: -5s;
                }

                .orb-3 {
                    top: 40%;
                    left: 30%;
                    width: 45vw;
                    height: 45vw;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
                    animation-duration: 28s;
                    animation-delay: -10s;
                }

                .content-wrapper {
                    position: relative;
                    z-index: 10;
                    padding: 0;
                }

                /* Page Header */
                .page-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                @media (min-width: 640px) {
                    .page-header {
                        flex-direction: row;
                        align-items: flex-end;
                        justify-content: space-between;
                    }
                }

                .welcome-text {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                    margin-bottom: 0.25rem;
                    letter-spacing: -0.02em;
                }

                .welcome-sub {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 500;
                    padding-left: 0.25rem;
                }

                .date-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.625rem 1.25rem;
                    background: rgba(10, 15, 30, 0.4);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .date-icon {
                    color: #22d3ee;
                    text-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                @media (min-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                /* Glass Panel */
                .glass-panel {
                    background: rgba(10, 15, 30, 0.4);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
                }

                /* Stat Card */
                .stat-card {
                    padding: 1.75rem;
                    border-radius: 1.75rem;
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                                box-shadow 0.4s ease, 
                                border-color 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card:hover {
                    transform: translateY(-6px) scale(1.01);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                    background: rgba(20, 30, 50, 0.5);
                }

                .stat-bg-icon {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 2rem;
                    font-size: 6rem;
                    opacity: 0.05;
                    transition: opacity 0.5s, transform 0.5s;
                }

                .stat-card:hover .stat-bg-icon {
                    opacity: 0.1;
                    transform: scale(1.1);
                }

                .stat-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    position: relative;
                    z-index: 10;
                }

                .stat-icon-wrapper {
                    padding: 0.75rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .stat-icon-wrapper.cyan {
                    background: rgba(6, 78, 91, 0.5);
                    border: 1px solid rgba(6, 78, 91, 0.5);
                    color: #22d3ee;
                }

                .stat-icon-wrapper.green {
                    background: rgba(5, 60, 35, 0.5);
                    border: 1px solid rgba(5, 60, 35, 0.5);
                    color: #4ade80;
                }

                .stat-icon-wrapper.purple {
                    background: rgba(59, 20, 89, 0.5);
                    border: 1px solid rgba(59, 20, 89, 0.5);
                    color: #c084fc;
                }

                .stat-icon-wrapper.amber {
                    background: rgba(78, 53, 5, 0.5);
                    border: 1px solid rgba(78, 53, 5, 0.5);
                    color: #fbbf24;
                }

                .stat-badge {
                    display: flex;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    backdrop-filter: blur(8px);
                }

                .stat-badge.green {
                    background: rgba(5, 60, 35, 0.4);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #34d399;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
                }

                .stat-badge.cyan {
                    background: rgba(6, 78, 91, 0.4);
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    color: #22d3ee;
                }

                .stat-content {
                    margin-top: 1.5rem;
                    position: relative;
                    z-index: 10;
                }

                .stat-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    opacity: 0.8;
                }

                .stat-value {
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.02em;
                    margin-top: 0.25rem;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .stat-sub {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .progress-bar-bg {
                    width: 100%;
                    height: 0.375rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 9999px;
                    margin-top: 1.5rem;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .progress-bar {
                    height: 100%;
                    border-radius: 9999px;
                }

                .progress-bar.cyan {
                    background: linear-gradient(to right, #0891b2, #22d3ee);
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
                }

                .progress-bar.green {
                    background: linear-gradient(to right, #059669, #34d399);
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
                }

                .progress-bar.purple {
                    background: linear-gradient(to right, #9333ea, #e879f9);
                    box-shadow: 0 0 15px rgba(192, 132, 252, 0.8);
                }

                .progress-bar.amber {
                    background: linear-gradient(to right, #d97706, #fbbf24);
                    box-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
                }

                /* Content Grid */
                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 2fr 1fr;
                    }
                }

                /* Card */
                .card {
                    border-radius: 2rem;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                }

                .card-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                }

                .card-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .card-action {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #67e8f9;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    background: rgba(6, 78, 91, 0.3);
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .card-action:hover {
                    color: #cffafe;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
                }

                .card-body {
                    padding: 0;
                    flex: 1;
                    overflow-y: auto;
                }

                /* Appointment List */
                .appointment-list {
                    list-style: none;
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .appointment-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: 1.25rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .appointment-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }

                .appointment-item.active {
                    background: rgba(6, 78, 91, 0.3);
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
                    position: relative;
                }

                .appointment-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: #22d3ee;
                    border-radius: 4px 0 0 4px;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
                }

                .appointment-time {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 1rem;
                    background: rgba(30, 41, 59, 0.8);
                    font-weight: 700;
                    flex-shrink: 0;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .appointment-time.active {
                    background: linear-gradient(135deg, #0891b2, #0ea5e9);
                    color: white;
                    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
                }

                .time-hour {
                    font-size: 1.125rem;
                    color: white;
                    line-height: 1;
                }

                .time-min {
                    font-size: 0.625rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .appointment-time.active .time-min {
                    color: rgba(255, 255, 255, 0.8);
                }

                .appointment-info {
                    flex: 1;
                    min-width: 0;
                }

                .appointment-patient {
                    font-weight: 700;
                    color: white;
                    font-size: 0.9375rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .appointment-reason {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin-top: 0.125rem;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .appointment-item.active .appointment-reason {
                    color: #67e8f9;
                    font-weight: 700;
                }

                /* Badges */
                .badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }

                .badge-success {
                    background: rgba(5, 60, 35, 0.4);
                    color: #4ade80;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                }

                .badge-warning {
                    background: rgba(78, 53, 5, 0.4);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.3);
                }

                .badge-gray {
                    background: rgba(51, 65, 85, 0.4);
                    color: #94a3b8;
                    border: 1px solid rgba(100, 116, 139, 0.3);
                }

                .pulse-indicator {
                    display: flex;
                    align-items: center;
                    margin-right: 0.5rem;
                }

                .pulse-dot {
                    position: relative;
                    width: 0.75rem;
                    height: 0.75rem;
                }

                .pulse-dot::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #22d3ee;
                    border-radius: 50%;
                    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                    opacity: 0.75;
                }

                .pulse-dot::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #06b6d4;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
                }

                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                /* Quick Actions */
                .quick-actions {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .quick-action-btn {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.3s;
                    text-decoration: none;
                    color: #cbd5e1;
                    font-weight: 700;
                    font-size: 0.875rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .quick-action-btn:hover {
                    background: rgba(6, 78, 91, 0.4);
                    border-color: rgba(6, 182, 212, 0.5);
                    color: #67e8f9;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
                }

                .action-icon {
                    font-size: 1.25rem;
                }

                .card-footer {
                    padding: 1.25rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                }

                .add-btn {
                    width: 100%;
                    padding: 0.875rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    color: #cbd5e1;
                    font-size: 0.875rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    text-decoration: none;
                    display: block;
                    text-align: center;
                }

                .add-btn:hover {
                    background: rgba(6, 78, 91, 0.4);
                    border-color: rgba(6, 182, 212, 0.5);
                    color: #67e8f9;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #64748b;
                }

                .loading-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    color: #64748b;
                }

                .spinner {
                    width: 24px;
                    height: 24px;
                    border: 2px solid rgba(6, 182, 212, 0.2);
                    border-top-color: #22d3ee;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-right: 0.75rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="welcome-text">Desempenho</h1>
            <p className="welcome-sub">Visão geral diária e métricas da clínica</p>
          </div>
          <div className="date-badge">
            <span className="date-icon">📅</span>
            <span>{today}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Atendimentos */}
          <div className="stat-card glass-panel">
            <div className="stat-bg-icon">🦷</div>
            <div className="stat-header">
              <div className="stat-icon-wrapper cyan">🦷</div>
              <span className="stat-badge green">
                ↑ +12%
              </span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Atendimentos</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <h3 className="stat-value">{loading ? '-' : stats.atendimentosHoje}</h3>
                <span className="stat-sub">/ {stats.agendamentosHoje} agendados</span>
              </div>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar cyan"
                style={{ width: loading ? '0%' : `${(stats.atendimentosHoje / stats.agendamentosHoje) * 100}%` }}
              />
            </div>
          </div>

          {/* Agendamentos */}
          <div className="stat-card glass-panel">
            <div className="stat-bg-icon">📅</div>
            <div className="stat-header">
              <div className="stat-icon-wrapper green">📅</div>
              <span className="stat-badge cyan">
                Hoje
              </span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Agendamentos</p>
              <h3 className="stat-value">{loading ? '-' : stats.agendamentosHoje}</h3>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar green" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Pacientes */}
          <div className="stat-card glass-panel">
            <div className="stat-bg-icon">👥</div>
            <div className="stat-header">
              <div className="stat-icon-wrapper purple">👥</div>
              <span className="stat-badge green">
                ↑ +3
              </span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Pacientes Ativos</p>
              <h3 className="stat-value">{loading ? '-' : stats.pacientesAtivos}</h3>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar purple" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Tempo Médio */}
          <div className="stat-card glass-panel">
            <div className="stat-bg-icon">⏱️</div>
            <div className="stat-header">
              <div className="stat-icon-wrapper amber">⏱️</div>
              <span className="stat-badge cyan">
                Média
              </span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Duração do Atendimento</p>
              <h3 className="stat-value">{loading ? '-' : formatMinutes(stats.tempoMedioAtendimento)}</h3>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar amber" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Agenda de Hoje */}
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h3 className="card-title">Próximos Atendimentos</h3>
              <Link href="/agenda" className="card-action">
                Ver Todos
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner" />
                  Carregando...
                </div>
              ) : agendamentosHoje.length > 0 ? (
                <ul className="appointment-list">
                  {agendamentosHoje.map((item) => {
                    const badge = getStatusBadge(item.status);
                    const isActive = item.status === 'IN_PROGRESS';
                    const [hora, minuto] = item.horario.split(':');

                    return (
                      <li
                        key={item.id}
                        className={`appointment-item ${isActive ? 'active' : ''}`}
                      >
                        <div className={`appointment-time ${isActive ? 'active' : ''}`}>
                          <span className="time-hour">{hora}</span>
                          <span className="time-min">{minuto}</span>
                        </div>
                        <div className="appointment-info">
                          <div className="appointment-patient">{item.paciente}</div>
                          <div className="appointment-reason">{item.motivo}</div>
                        </div>
                        {isActive && (
                          <div className="pulse-indicator">
                            <span className="pulse-dot" />
                          </div>
                        )}
                        <span className={`badge ${badge.class}`}>{badge.label}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="empty-state">
                  Nenhum agendamento para hoje
                </div>
              )}
            </div>
            <div className="card-footer">
              <Link href="/agenda?action=new" className="add-btn">
                + Novo Agendamento
              </Link>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="card glass-panel">
            <div className="card-header">
              <h3 className="card-title">Ações Rápidas</h3>
            </div>
            <div className="quick-actions">
              <Link href="/agenda?action=new" className="quick-action-btn">
                <span className="action-icon">➕</span>
                Novo Agendamento
              </Link>
              <Link href="/patients?action=new" className="quick-action-btn">
                <span className="action-icon">👤</span>
                Cadastrar Paciente
              </Link>
              <Link href="/consultation" className="quick-action-btn">
                <span className="action-icon">🦷</span>
                Iniciar Atendimento
              </Link>
              <Link href="/reports" className="quick-action-btn">
                <span className="action-icon">📊</span>
                Ver Relatórios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
