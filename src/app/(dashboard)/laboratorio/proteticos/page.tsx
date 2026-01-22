'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProstheticStatusLabels, WorkTypeLabels, UrgencyLabels } from '@/types';

interface Order {
    id: string;
    patientId: string;
    proteticoId?: string;
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
}

interface Protetico {
    id: string;
    name: string;
    laboratoryName?: string;
    email: string;
    specialties: string[];
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

export default function ProteticosPage() {
    const [proteticos, setProteticos] = useState<Protetico[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProtetico, setSelectedProtetico] = useState<Protetico | null>(null);

    // Form states
    const [formName, setFormName] = useState('');
    const [formLab, setFormLab] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formSpecialties, setFormSpecialties] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [laboratoriesRes, ordersRes] = await Promise.all([
                fetch('/api/laboratories'),
                fetch('/api/prosthetic-orders'),
            ]);

            if (laboratoriesRes.ok) {
                const data = await laboratoriesRes.json();
                setProteticos(data.laboratories || []);
            }

            if (ordersRes.ok) {
                const data = await ordersRes.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formName || !formEmail || !formPassword) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/laboratories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formName,
                    responsibleName: formLab,
                    email: formEmail,
                    phone: formPhone,
                    password: formPassword,
                    specialties: formSpecialties,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao cadastrar');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormName('');
        setFormLab('');
        setFormEmail('');
        setFormPhone('');
        setFormPassword('');
        setFormSpecialties([]);
        setSelectedProtetico(null);
    };

    const getOrdersByProtetico = (proteticoId: string) => {
        return orders.filter(o => o.proteticoId === proteticoId);
    };

    const specialtyOptions = ['Coroas', 'Facetas', 'Próteses', 'Implantes', 'Ortodontia', 'CAD/CAM'];

    return (
        <div className="proteticos-page">
            <style jsx>{`
                .proteticos-page {
                    min-height: 100%;
                    color: #f8fafc;
                }

                /* Header */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .header-left h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    background: linear-gradient(to right, white, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }

                .header-left p {
                    color: #64748b;
                }

                .btn-add {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    color: white;
                    font-weight: 600;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .btn-add:hover {
                    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                /* Stats */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.25rem;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                /* Grid */
                .proteticos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 1.25rem;
                }

                .protetico-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: all 0.3s;
                }

                .protetico-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(139, 92, 246, 0.3);
                }

                .protetico-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .protetico-avatar {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.125rem;
                    color: white;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
                }

                .protetico-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                }

                .protetico-lab {
                    font-size: 0.8125rem;
                    color: #64748b;
                }

                .protetico-email {
                    font-size: 0.75rem;
                    color: #475569;
                    margin-bottom: 1rem;
                }

                .specialties {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .specialty-tag {
                    padding: 0.25rem 0.625rem;
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 9999px;
                    font-size: 0.6875rem;
                    color: #a78bfa;
                }

                .protetico-stats {
                    display: flex;
                    gap: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 0.8125rem;
                }

                .protetico-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .protetico-stat span:first-child {
                    color: #64748b;
                    font-size: 0.6875rem;
                }

                .protetico-stat span:last-child {
                    color: white;
                    font-weight: 600;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 2rem;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 1.5rem;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    color: #cbd5e1;
                    margin-bottom: 0.5rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: white;
                }

                .form-input:focus {
                    outline: none;
                    border-color: rgba(139, 92, 246, 0.5);
                }

                .specialty-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .specialty-option {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.5rem;
                    font-size: 0.8125rem;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .specialty-option:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .specialty-option.selected {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: rgba(139, 92, 246, 0.4);
                    color: #a78bfa;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }

                .btn-cancel {
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: #94a3b8;
                    font-weight: 500;
                    cursor: pointer;
                }

                .btn-save {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    border: none;
                    border-radius: 0.5rem;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-save:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

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
                }

                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                }

                .empty-text {
                    color: #64748b;
                    margin-bottom: 1.5rem;
                }

                @media (max-width: 768px) {
                    .stats-row {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .proteticos-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>🏭 Protéticos</h1>
                    <p>Gerencie os laboratórios e técnicos parceiros</p>
                </div>
                <button className="btn-add" onClick={() => setShowModal(true)}>
                    ➕ Novo Protético
                </button>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Total de Protéticos</div>
                    <div className="stat-value">{proteticos.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Pedidos Ativos</div>
                    <div className="stat-value">{orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Em Produção</div>
                    <div className="stat-value">{orders.filter(o => o.status === 'production').length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Prontos</div>
                    <div className="stat-value">{orders.filter(o => o.status === 'ready').length}</div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    Carregando...
                </div>
            ) : proteticos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏭</div>
                    <h3 className="empty-title">Nenhum protético cadastrado</h3>
                    <p className="empty-text">Cadastre laboratórios parceiros para começar a enviar pedidos.</p>
                    <button className="btn-add" onClick={() => setShowModal(true)}>
                        ➕ Cadastrar Protético
                    </button>
                </div>
            ) : (
                <div className="proteticos-grid">
                    {proteticos.map((protetico) => {
                        const proteticoOrders = orders.filter((o: any) => o.proteticoId === protetico.id);
                        const activeOrders = proteticoOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
                        const completedOrders = proteticoOrders.filter(o => o.status === 'delivered');

                        return (
                            <div key={protetico.id} className="protetico-card">
                                <div className="protetico-header">
                                    <div className="protetico-avatar">
                                        {protetico.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="protetico-name">{protetico.name}</div>
                                        {protetico.laboratoryName && (
                                            <div className="protetico-lab">{protetico.laboratoryName}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="protetico-email">📧 {protetico.email}</div>

                                {protetico.specialties?.length > 0 && (
                                    <div className="specialties">
                                        {protetico.specialties.map((s, i) => (
                                            <span key={i} className="specialty-tag">{s}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="protetico-stats">
                                    <div className="protetico-stat">
                                        <span>Ativos</span>
                                        <span>{activeOrders.length}</span>
                                    </div>
                                    <div className="protetico-stat">
                                        <span>Concluídos</span>
                                        <span>{completedOrders.length}</span>
                                    </div>
                                    <div className="protetico-stat">
                                        <span>Total</span>
                                        <span>{proteticoOrders.length}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Cadastrar Novo Protético</h2>

                        <div className="form-group">
                            <label className="form-label">Nome *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Nome do técnico"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nome do Laboratório</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formLab}
                                onChange={(e) => setFormLab(e.target.value)}
                                placeholder="Nome do laboratório"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                placeholder="email@laboratorio.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Telefone</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Senha de Acesso *</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                placeholder="Senha para acesso ao painel"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Especialidades</label>
                            <div className="specialty-options">
                                {specialtyOptions.map((spec) => (
                                    <div
                                        key={spec}
                                        className={`specialty-option ${formSpecialties.includes(spec) ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (formSpecialties.includes(spec)) {
                                                setFormSpecialties(formSpecialties.filter(s => s !== spec));
                                            } else {
                                                setFormSpecialties([...formSpecialties, spec]);
                                            }
                                        }}
                                    >
                                        {spec}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>
                                Cancelar
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSubmit}
                                disabled={submitting || !formName || !formEmail || !formPassword}
                            >
                                {submitting ? 'Salvando...' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
