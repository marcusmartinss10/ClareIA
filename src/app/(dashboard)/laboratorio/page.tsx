'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProstheticStatusLabels, WorkTypeLabels, UrgencyLabels } from '@/types';

interface Order {
    id: string;
    patientId: string;
    workType: string;
    workTypeCustom?: string;
    material?: string;
    shade?: string;
    toothNumbers?: string;
    urgency: string;
    deadline?: string;
    status: string;
    createdAt: string;
    patient?: { id: string; name: string };
    dentist?: { id: string; name: string };
    protetico?: { id: string; name: string; laboratoryName?: string };
}

const statusColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' },
    received: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)', text: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)' },
    analysis: { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.3)', text: '#a78bfa', glow: 'rgba(167, 139, 250, 0.3)' },
    production: { bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.3)', text: '#22d3ee', glow: 'rgba(34, 211, 238, 0.4)' },
    assembly: { bg: 'rgba(45, 212, 191, 0.1)', border: 'rgba(45, 212, 191, 0.3)', text: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.4)' },
    adjustment: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    ready: { bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)', text: '#34d399', glow: 'rgba(52, 211, 153, 0.5)' },
    delivered: { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', glow: 'none' },
};

export default function LaboratorioPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/prosthetic-orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'production') return ['received', 'analysis', 'production', 'assembly'].includes(order.status);
        if (filter === 'ready') return ['ready', 'delivered'].includes(order.status);
        return true;
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="laboratorio-page">
            <style jsx>{`
                .laboratorio-page {
                    min-height: 100%;
                    color: #f8fafc;
                    position: relative;
                }

                /* Ambient */
                .ambient-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                    z-index: 0;
                    mix-blend-mode: screen;
                }

                .blob-1 {
                    top: -15%;
                    right: -10%;
                    width: 500px;
                    height: 500px;
                    background: rgba(6, 182, 212, 0.15);
                    animation: float 12s infinite ease-in-out;
                }

                .blob-2 {
                    bottom: 10%;
                    left: -5%;
                    width: 400px;
                    height: 400px;
                    background: rgba(139, 92, 246, 0.1);
                    animation: float 12s infinite ease-in-out 3s;
                }

                @keyframes float {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -30px) scale(1.05); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                /* Header */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    position: relative;
                    z-index: 10;
                }

                .header-left h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    background: linear-gradient(to right, white, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }

                .header-left p {
                    color: #64748b;
                    font-size: 1rem;
                }

                .btn-new {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #22d3ee, #06b6d4);
                    color: #0f172a;
                    font-weight: 700;
                    font-size: 0.875rem;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                    text-decoration: none;
                }

                .btn-new:hover {
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
                    transform: translateY(-2px);
                }

                /* Filters */
                .filters {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 0.5rem;
                    width: fit-content;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    background: transparent;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .filter-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .filter-btn.active {
                    background: rgba(6, 182, 212, 0.2);
                    color: white;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                }

                /* Orders Grid */
                .orders-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 1.25rem;
                }

                .order-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: all 0.3s;
                    cursor: pointer;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                }

                .order-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(6, 182, 212, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .patient-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .patient-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.875rem;
                    color: white;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }

                .patient-name {
                    font-weight: 600;
                    color: white;
                    font-size: 0.9375rem;
                }

                .patient-id {
                    font-size: 0.75rem;
                    color: #475569;
                }

                .status-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .order-body {
                    margin-bottom: 1rem;
                }

                .work-type {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #e2e8f0;
                    margin-bottom: 0.75rem;
                }

                .work-icon {
                    font-size: 1rem;
                }

                .tech-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .tech-tag {
                    padding: 0.25rem 0.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 0.25rem;
                }

                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 0.75rem;
                    color: #475569;
                }

                .protetico-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .protetico-avatar {
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.625rem;
                    color: #a78bfa;
                }

                .urgency-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.6875rem;
                    font-weight: 600;
                }

                .urgency-normal { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }
                .urgency-urgent { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
                .urgency-express { background: rgba(239, 68, 68, 0.2); color: #f87171; }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                }

                .empty-text {
                    color: #64748b;
                    font-size: 0.875rem;
                }

                /* Loading */
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                    margin-right: 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .orders-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Ambient */}
            <div className="ambient-blob blob-1" />
            <div className="ambient-blob blob-2" />

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>🦷 Laboratório</h1>
                    <p>Gerencie pedidos de próteses e acompanhe a produção</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link href="/laboratorio/proteticos" style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        color: '#94a3b8',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}>
                        🏭 Protéticos
                    </Link>
                    <Link href="/laboratorio/painel" style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#a78bfa',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}>
                        📋 Painel Protético
                    </Link>
                    <Link href="/laboratorio/novo" className="btn-new">
                        ➕ Novo Pedido
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todos ({orders.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pendentes
                </button>
                <button
                    className={`filter-btn ${filter === 'production' ? 'active' : ''}`}
                    onClick={() => setFilter('production')}
                >
                    Em Produção
                </button>
                <button
                    className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
                    onClick={() => setFilter('ready')}
                >
                    Prontos
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                    Carregando pedidos...
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3 className="empty-title">Nenhum pedido encontrado</h3>
                    <p className="empty-text">
                        {filter === 'all'
                            ? 'Crie seu primeiro pedido clicando no botão acima.'
                            : 'Nenhum pedido com este status.'}
                    </p>
                </div>
            ) : (
                <div className="orders-grid">
                    {filteredOrders.map((order) => {
                        const colors = statusColors[order.status] || statusColors.pending;
                        return (
                            <Link key={order.id} href={`/laboratorio/${order.id}`} className="order-card">
                                <div className="order-header">
                                    <div className="patient-info">
                                        <div className="patient-avatar">
                                            {order.patient?.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <div className="patient-name">{order.patient?.name || 'Paciente'}</div>
                                            <div className="patient-id">#{order.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{
                                            background: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                            color: colors.text,
                                            boxShadow: colors.glow !== 'none' ? `0 0 10px ${colors.glow}` : 'none',
                                        }}
                                    >
                                        {ProstheticStatusLabels[order.status as keyof typeof ProstheticStatusLabels] || order.status}
                                    </span>
                                </div>

                                <div className="order-body">
                                    <div className="work-type">
                                        <span className="work-icon">🦷</span>
                                        {WorkTypeLabels[order.workType as keyof typeof WorkTypeLabels] || order.workTypeCustom || order.workType}
                                    </div>
                                    <div className="tech-details">
                                        {order.material && <span className="tech-tag">{order.material}</span>}
                                        {order.shade && <span className="tech-tag">Cor: {order.shade}</span>}
                                        {order.toothNumbers && <span className="tech-tag">Dentes: {order.toothNumbers}</span>}
                                    </div>
                                </div>

                                <div className="order-footer">
                                    <div className="protetico-info">
                                        {order.protetico ? (
                                            <>
                                                <div className="protetico-avatar">
                                                    {order.protetico.name.charAt(0)}
                                                </div>
                                                <span>{order.protetico.laboratoryName || order.protetico.name}</span>
                                            </>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>Sem protético</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {order.urgency !== 'normal' && (
                                            <span className={`urgency-badge urgency-${order.urgency}`}>
                                                {UrgencyLabels[order.urgency as keyof typeof UrgencyLabels]}
                                            </span>
                                        )}
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
