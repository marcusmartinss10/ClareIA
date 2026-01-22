'use client';

import { useState, useEffect } from 'react';
import { ProstheticStatusLabels, WorkTypeLabels, UrgencyLabels } from '@/types';

interface Order {
    id: string;
    patientId: string;
    workType: string;
    workTypeCustom?: string;
    material?: string;
    shade?: string;
    toothNumbers?: string;
    observations?: string;
    dentistNotes?: string;
    urgency: string;
    deadline?: string;
    status: string;
    createdAt: string;
    patient?: { id: string; name: string };
    dentist?: { id: string; name: string };
}

interface Comment {
    id: string;
    authorType: string;
    message: string;
    createdAt: string;
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
    received: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)', text: '#60a5fa' },
    analysis: { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.3)', text: '#a78bfa' },
    production: { bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.3)', text: '#22d3ee' },
    assembly: { bg: 'rgba(45, 212, 191, 0.1)', border: 'rgba(45, 212, 191, 0.3)', text: '#2dd4bf' },
    adjustment: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316' },
    ready: { bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)', text: '#34d399' },
    delivered: { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' },
};

const statusOrder = ['pending', 'received', 'analysis', 'production', 'assembly', 'ready', 'delivered'];

export default function PainelProteticoPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderComments, setOrderComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/prosthetic-orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
                // Auto-select first order if none selected
                if (!selectedOrder && data.orders?.length > 0) {
                    handleSelectOrder(data.orders[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const res = await fetch(`/api/prosthetic-orders/${orderId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setOrderComments(data.comments || []);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        fetchOrderDetails(order.id);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/prosthetic-orders/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Refresh data
                const updatedOrders = orders.map(o =>
                    o.id === selectedOrder.id ? { ...o, status: newStatus } : o
                );
                setOrders(updatedOrders);
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !selectedOrder) return;
        setSendingComment(true);
        try {
            const res = await fetch(`/api/prosthetic-orders/${selectedOrder.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newComment }),
            });
            if (res.ok) {
                setNewComment('');
                fetchOrderDetails(selectedOrder.id);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSendingComment(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'pending' || order.status === 'received';
        if (filter === 'production') return ['analysis', 'production', 'assembly'].includes(order.status);
        if (filter === 'ready') return order.status === 'ready';
        if (filter === 'delivered') return order.status === 'delivered';
        return true;
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="painel-protetico">
            <style jsx>{`
                .painel-protetico {
                    color: #f8fafc;
                }

                /* Header */
                .page-header {
                    margin-bottom: 1.5rem;
                }

                .page-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.25rem;
                }

                .page-subtitle {
                    color: #64748b;
                    font-size: 0.875rem;
                }

                /* Filters */
                .filters {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .filter-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.08);
                }

                .filter-btn.active {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.4);
                    color: #a78bfa;
                }

                /* Split Layout */
                .split-layout {
                    display: grid;
                    grid-template-columns: 360px 1fr;
                    gap: 1.5rem;
                }

                /* Orders List */
                .orders-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 1rem;
                    padding: 1rem;
                    max-height: calc(100vh - 220px);
                    overflow-y: auto;
                }

                .order-card {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    margin-bottom: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .order-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .order-card.selected {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: rgba(139, 92, 246, 0.3);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }

                .order-patient {
                    font-weight: 600;
                    color: white;
                    font-size: 0.9375rem;
                }

                .order-type {
                    font-size: 0.8125rem;
                    color: #94a3b8;
                }

                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .status-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.625rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                /* Detail Panel */
                .detail-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    max-height: calc(100vh - 220px);
                    overflow-y: auto;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: #64748b;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                /* Patient Info */
                .patient-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .patient-avatar {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                }

                .patient-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                }

                .dentist-name {
                    font-size: 0.8125rem;
                    color: #64748b;
                }

                /* Section Title */
                .section-title {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                    margin-bottom: 0.75rem;
                }

                /* Specs Grid */
                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .spec-item {
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.5rem;
                }

                .spec-label {
                    font-size: 0.6875rem;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-bottom: 0.25rem;
                }

                .spec-value {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: white;
                }

                /* Status Actions */
                .status-section {
                    margin-bottom: 1.5rem;
                }

                .status-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .status-btn {
                    padding: 0.5rem 0.875rem;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid;
                }

                .status-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .status-btn.current {
                    box-shadow: 0 0 12px rgba(139, 92, 246, 0.3);
                }

                .btn-adjustment {
                    margin-top: 0.5rem;
                    width: 100%;
                    padding: 0.625rem;
                    background: rgba(249, 115, 22, 0.1);
                    border: 1px solid rgba(249, 115, 22, 0.3);
                    border-radius: 0.5rem;
                    color: #f97316;
                    font-weight: 600;
                    cursor: pointer;
                }

                /* Comments */
                .comments-section {
                    margin-top: 1.5rem;
                }

                .comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                    margin-bottom: 0.75rem;
                }

                .comment-item {
                    padding: 0.625rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 0.5rem;
                }

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.25rem;
                }

                .comment-author {
                    font-size: 0.6875rem;
                    font-weight: 600;
                    color: #22d3ee;
                }

                .comment-date {
                    font-size: 0.625rem;
                    color: #475569;
                }

                .comment-text {
                    font-size: 0.8125rem;
                    color: #cbd5e1;
                }

                .comment-input-area {
                    display: flex;
                    gap: 0.5rem;
                }

                .comment-input {
                    flex: 1;
                    padding: 0.625rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    color: white;
                    resize: none;
                }

                .comment-input::placeholder {
                    color: #475569;
                }

                .comment-input:focus {
                    outline: none;
                    border-color: rgba(139, 92, 246, 0.5);
                }

                .btn-send {
                    padding: 0.625rem 1rem;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    color: white;
                    font-weight: 600;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                }

                .btn-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 1024px) {
                    .split-layout {
                        grid-template-columns: 1fr;
                    }
                    .orders-panel, .detail-panel {
                        max-height: none;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">🏭 Painel do Protético</h1>
                <p className="page-subtitle">Gerencie pedidos de laboratório e atualize status</p>
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
                    🆕 Novos
                </button>
                <button
                    className={`filter-btn ${filter === 'production' ? 'active' : ''}`}
                    onClick={() => setFilter('production')}
                >
                    ⚙️ Em Produção
                </button>
                <button
                    className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
                    onClick={() => setFilter('ready')}
                >
                    ✅ Prontos
                </button>
            </div>

            {/* Split Layout */}
            <div className="split-layout">
                {/* Orders List */}
                <div className="orders-panel">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            Carregando...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            Nenhum pedido encontrado
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const colors = statusColors[order.status] || statusColors.pending;
                            return (
                                <div
                                    key={order.id}
                                    className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectOrder(order)}
                                >
                                    <div className="order-header">
                                        <div>
                                            <div className="order-patient">{order.patient?.name || 'Paciente'}</div>
                                            <div className="order-type">
                                                {WorkTypeLabels[order.workType as keyof typeof WorkTypeLabels] || order.workType}
                                            </div>
                                        </div>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background: colors.bg,
                                                border: `1px solid ${colors.border}`,
                                                color: colors.text,
                                            }}
                                        >
                                            {ProstheticStatusLabels[order.status as keyof typeof ProstheticStatusLabels]}
                                        </span>
                                    </div>
                                    <div className="order-footer">
                                        <span>👨‍⚕️ {order.dentist?.name || 'Dentista'}</span>
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Detail Panel */}
                <div className="detail-panel">
                    {!selectedOrder ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>Selecione um pedido</h3>
                            <p>Escolha um pedido da lista para ver os detalhes</p>
                        </div>
                    ) : (
                        <>
                            {/* Patient */}
                            <div className="patient-section">
                                <div className="patient-avatar">
                                    {selectedOrder.patient?.name?.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <div className="patient-name">{selectedOrder.patient?.name}</div>
                                    <div className="dentist-name">Dr(a). {selectedOrder.dentist?.name}</div>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="section-title">Especificações Técnicas</div>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <div className="spec-label">Tipo</div>
                                    <div className="spec-value">
                                        {WorkTypeLabels[selectedOrder.workType as keyof typeof WorkTypeLabels] || selectedOrder.workType}
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Material</div>
                                    <div className="spec-value">{selectedOrder.material || '-'}</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Cor / Escala</div>
                                    <div className="spec-value">{selectedOrder.shade || '-'}</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Dentes</div>
                                    <div className="spec-value">{selectedOrder.toothNumbers || '-'}</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Urgência</div>
                                    <div className="spec-value">{UrgencyLabels[selectedOrder.urgency as keyof typeof UrgencyLabels] || 'Normal'}</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Prazo</div>
                                    <div className="spec-value">{selectedOrder.deadline || '-'}</div>
                                </div>
                            </div>

                            {/* Status Control */}
                            <div className="status-section">
                                <div className="section-title">Atualizar Status</div>
                                <div className="status-actions">
                                    {statusOrder.map((status) => {
                                        const colors = statusColors[status];
                                        const isCurrent = selectedOrder.status === status;
                                        return (
                                            <button
                                                key={status}
                                                className={`status-btn ${isCurrent ? 'current' : ''}`}
                                                style={{
                                                    background: isCurrent ? colors.bg : 'transparent',
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                                onClick={() => handleStatusUpdate(status)}
                                                disabled={updatingStatus || isCurrent}
                                            >
                                                {ProstheticStatusLabels[status as keyof typeof ProstheticStatusLabels]}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    className="btn-adjustment"
                                    onClick={() => handleStatusUpdate('adjustment')}
                                    disabled={updatingStatus}
                                >
                                    ⚠️ Solicitar Ajuste
                                </button>
                            </div>

                            {/* Comments */}
                            <div className="comments-section">
                                <div className="section-title">Comunicação</div>
                                {orderComments.length > 0 && (
                                    <div className="comments-list">
                                        {orderComments.map((comment) => (
                                            <div key={comment.id} className="comment-item">
                                                <div className="comment-header">
                                                    <span className="comment-author">
                                                        {comment.authorType === 'dentist' ? '👨‍⚕️ Dentista' : '🔧 Protético'}
                                                    </span>
                                                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                                </div>
                                                <div className="comment-text">{comment.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="comment-input-area">
                                    <textarea
                                        className="comment-input"
                                        rows={2}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Adicionar comentário técnico..."
                                    />
                                    <button
                                        className="btn-send"
                                        onClick={handleSendComment}
                                        disabled={!newComment.trim() || sendingComment}
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
