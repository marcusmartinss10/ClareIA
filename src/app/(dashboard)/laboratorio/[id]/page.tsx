'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    urgency: string;
    deadline?: string;
    status: string;
    createdAt: string;
    patient?: { id: string; name: string; phone?: string };
    dentist?: { id: string; name: string };
    protetico?: { id: string; name: string; laboratoryName?: string };
}

interface HistoryItem {
    id: string;
    previousStatus?: string;
    newStatus: string;
    changedByType: string;
    notes?: string;
    createdAt: string;
}

interface Comment {
    id: string;
    authorType: string;
    authorId: string;
    message: string;
    createdAt: string;
}

interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedByType?: string;
    createdAt: string;
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

const statusOrder = ['pending', 'received', 'analysis', 'production', 'assembly', 'ready', 'delivered'];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/prosthetic-orders/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                setHistory(data.history || []);
                setComments(data.comments || []);
            } else {
                router.push('/laboratorio');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/prosthetic-orders/${order.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchOrder();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !order) return;
        setSendingComment(true);
        try {
            const res = await fetch(`/api/prosthetic-orders/${order.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newComment }),
            });
            if (res.ok) {
                setNewComment('');
                fetchOrder();
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        } finally {
            setSendingComment(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCurrentStatusIndex = () => {
        if (!order) return 0;
        return statusOrder.indexOf(order.status);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#64748b' }}>
                Carregando...
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const colors = statusColors[order.status] || statusColors.pending;

    return (
        <div className="order-detail">
            <style jsx>{`
                .order-detail {
                    min-height: 100%;
                    color: #f8fafc;
                }

                /* Header */
                .page-header {
                    margin-bottom: 2rem;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    font-size: 0.875rem;
                    text-decoration: none;
                    margin-bottom: 1rem;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: #22d3ee;
                }

                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .order-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .order-id {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .status-badge-large {
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                }

                /* Grid Layout */
                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 1.5rem;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* Cards */
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .card-title {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                    margin-bottom: 1rem;
                }

                /* Patient Card */
                .patient-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
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
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
                }

                .patient-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                }

                .patient-phone {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                /* Specs Grid */
                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .spec-item {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                }

                .spec-label {
                    font-size: 0.6875rem;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-bottom: 0.25rem;
                }

                .spec-value {
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: white;
                }

                .observations {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: #cbd5e1;
                    line-height: 1.6;
                }

                /* Status Timeline */
                .status-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .timeline-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .timeline-item:hover {
                    background: rgba(255, 255, 255, 0.03);
                }

                .timeline-item.current {
                    background: rgba(6, 182, 212, 0.1);
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }

                .timeline-item.completed {
                    opacity: 0.6;
                }

                .timeline-item.future {
                    opacity: 0.4;
                }

                .timeline-dot {
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    border: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.5rem;
                }

                .timeline-dot.completed {
                    background: #22d3ee;
                    border-color: #22d3ee;
                    color: #0f172a;
                }

                .timeline-dot.current {
                    background: transparent;
                    border-color: #22d3ee;
                    box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
                    animation: pulse 2s infinite;
                }

                .timeline-dot.future {
                    background: transparent;
                    border-color: #475569;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 10px rgba(34, 211, 238, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.8); }
                }

                .timeline-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #cbd5e1;
                }

                /* History */
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .history-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 0.5rem;
                }

                .history-icon {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    background: rgba(6, 182, 212, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #22d3ee;
                    font-size: 0.75rem;
                }

                .history-content {
                    flex: 1;
                }

                .history-text {
                    font-size: 0.875rem;
                    color: #cbd5e1;
                }

                .history-date {
                    font-size: 0.75rem;
                    color: #475569;
                    margin-top: 0.25rem;
                }

                /* Comments */
                .comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                }

                .comment-item {
                    padding: 0.875rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                }

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .comment-author {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #22d3ee;
                }

                .comment-date {
                    font-size: 0.6875rem;
                    color: #475569;
                }

                .comment-text {
                    font-size: 0.875rem;
                    color: #cbd5e1;
                    line-height: 1.5;
                }

                .comment-input-area {
                    display: flex;
                    gap: 0.75rem;
                }

                .comment-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: white;
                    resize: none;
                }

                .comment-input:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.5);
                }

                .btn-send {
                    padding: 0.75rem 1.25rem;
                    background: linear-gradient(135deg, #22d3ee, #06b6d4);
                    color: #0f172a;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-send:hover:not(:disabled) {
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                }

                .btn-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Actions */
                .quick-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .action-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .action-btn.primary {
                    background: rgba(6, 182, 212, 0.2);
                    border-color: rgba(6, 182, 212, 0.3);
                    color: #22d3ee;
                }

                .action-btn.primary:hover {
                    background: rgba(6, 182, 212, 0.3);
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <a href="/laboratorio" className="back-link">← Voltar para Laboratório</a>
                <div className="header-row">
                    <div>
                        <h1 className="order-title">
                            {WorkTypeLabels[order.workType as keyof typeof WorkTypeLabels] || order.workTypeCustom || order.workType}
                        </h1>
                        <span className="order-id">Pedido #{order.id.slice(0, 8)}</span>
                    </div>
                    <span
                        className="status-badge-large"
                        style={{
                            background: colors.bg,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                            boxShadow: colors.glow !== 'none' ? `0 0 15px ${colors.glow}` : 'none',
                        }}
                    >
                        {ProstheticStatusLabels[order.status as keyof typeof ProstheticStatusLabels]}
                    </span>
                </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                {/* Left Column */}
                <div>
                    {/* Patient */}
                    <div className="glass-card">
                        <h3 className="card-title">Paciente</h3>
                        <div className="patient-card">
                            <div className="patient-avatar">
                                {order.patient?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <div className="patient-name">{order.patient?.name || 'Paciente'}</div>
                                {order.patient?.phone && (
                                    <div className="patient-phone">{order.patient.phone}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="glass-card">
                        <h3 className="card-title">Especificações Técnicas</h3>
                        <div className="specs-grid">
                            <div className="spec-item">
                                <div className="spec-label">Material</div>
                                <div className="spec-value">{order.material || '-'}</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Cor / Escala</div>
                                <div className="spec-value">{order.shade || '-'}</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Dentes</div>
                                <div className="spec-value">{order.toothNumbers || '-'}</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Urgência</div>
                                <div className="spec-value">{UrgencyLabels[order.urgency as keyof typeof UrgencyLabels]}</div>
                            </div>
                        </div>
                        {order.observations && (
                            <div className="observations">
                                <strong>Observações:</strong><br />
                                {order.observations}
                            </div>
                        )}
                    </div>

                    {/* History */}
                    <div className="glass-card">
                        <h3 className="card-title">Histórico</h3>
                        {history.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Nenhum histórico ainda.</p>
                        ) : (
                            <div className="history-list">
                                {history.map((item) => (
                                    <div key={item.id} className="history-item">
                                        <div className="history-icon">📌</div>
                                        <div className="history-content">
                                            <div className="history-text">
                                                Status alterado para <strong>{ProstheticStatusLabels[item.newStatus as keyof typeof ProstheticStatusLabels]}</strong>
                                            </div>
                                            <div className="history-date">{formatDate(item.createdAt)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Status Timeline */}
                    <div className="glass-card">
                        <h3 className="card-title">Status do Pedido</h3>
                        <div className="status-timeline">
                            {statusOrder.filter(s => s !== 'adjustment').map((status, index) => {
                                const currentIndex = getCurrentStatusIndex();
                                const isCompleted = index < currentIndex;
                                const isCurrent = status === order.status;
                                const isFuture = index > currentIndex;

                                return (
                                    <div
                                        key={status}
                                        className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
                                        onClick={() => !updatingStatus && handleStatusUpdate(status)}
                                    >
                                        <div className={`timeline-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}>
                                            {isCompleted && '✓'}
                                        </div>
                                        <span className="timeline-label">
                                            {ProstheticStatusLabels[status as keyof typeof ProstheticStatusLabels]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="quick-actions" style={{ marginTop: '1rem' }}>
                            {order.status !== 'delivered' && order.status !== 'adjustment' && (
                                <button
                                    className="action-btn"
                                    onClick={() => handleStatusUpdate('adjustment')}
                                    disabled={updatingStatus}
                                >
                                    ⚠️ Precisa Ajuste
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Protetico */}
                    {order.protetico && (
                        <div className="glass-card">
                            <h3 className="card-title">Laboratório</h3>
                            <div className="patient-card">
                                <div className="patient-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
                                    {order.protetico.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="patient-name">{order.protetico.name}</div>
                                    {order.protetico.laboratoryName && (
                                        <div className="patient-phone">{order.protetico.laboratoryName}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div className="glass-card">
                        <h3 className="card-title">Comunicação</h3>
                        {comments.length > 0 ? (
                            <div className="comments-list">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="comment-author">
                                                {comment.authorType === 'dentist' ? '👨‍⚕️ Dentista' : '🏭 Protético'}
                                            </span>
                                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <div className="comment-text">{comment.message}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                Nenhuma mensagem ainda.
                            </p>
                        )}

                        <div className="comment-input-area">
                            <textarea
                                className="comment-input"
                                placeholder="Escreva uma mensagem..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                            />
                            <button
                                className="btn-send"
                                onClick={handleSendComment}
                                disabled={sendingComment || !newComment.trim()}
                            >
                                {sendingComment ? '...' : '→'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
