'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { useAppointments } from '@/hooks/useData';

interface Paciente {
    id: string;
    name: string;
    phone: string;
}

interface Dentista {
    id: string;
    name: string;
}

interface Agendamento {
    id: string;
    horario: string;
    pacienteId: string;
    pacienteNome: string;
    motivo: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    dentistaId: string;
    dentistaNome: string;
    observacoes?: string;
    scheduledAt: string;
    paymentMethod?: 'CASH' | 'CARD' | 'PIX' | 'DENTAL_PLAN';
}

export default function AgendaPage() {
    const [dataAtual, setDataAtual] = useState(new Date());
    const [visao, setVisao] = useState<'dia' | 'semana' | 'mes'>('dia');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [dentistas, setDentistas] = useState<Dentista[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [detalhesAberto, setDetalhesAberto] = useState<Agendamento | null>(null);
    const [salvando, setSalvando] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({
        pacienteId: '',
        dentistaId: '',
        data: '',
        horario: '08:00',
        motivo: '',
        observacoes: '',
        paymentMethod: '' as '' | 'CASH' | 'CARD' | 'PIX' | 'DENTAL_PLAN',
    });

    // SWR Data Fetching
    const { appointments: rawAppointments, mutate: mutateAgendamentos, isLoading } = useAppointments(dataAtual);

    // Derived state
    const agendamentos = (rawAppointments || []).map((ag: any) => ({
        id: ag.id,
        horario: new Date(ag.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        pacienteId: ag.patientId,
        pacienteNome: ag.patientName || 'Paciente',
        motivo: ag.reason,
        status: ag.status,
        dentistaId: ag.dentistId,
        dentistaNome: ag.dentistName || 'Dentista',
        observacoes: ag.adminNotes,
        scheduledAt: ag.scheduledAt,
    }));

    // Legacy Loading State (aliased to SWR)
    const loading = isLoading;

    useEffect(() => {
        carregarAuxiliares();
    }, []);

    const carregarAuxiliares = async () => {
        try {
            const resPacientes = await fetch('/api/patients');
            if (resPacientes.ok) {
                const dataPac = await resPacientes.json();
                setPacientes(dataPac.pacientes || []);
            }

            const resDentistas = await fetch('/api/users?role=DENTIST');
            if (resDentistas.ok) {
                const dataDent = await resDentistas.json();
                setDentistas(dataDent.usuarios || []);
            }
        } catch (error) {
            console.error('Erro ao carregar dados auxiliares:', error);
        }
    };

    const navegarData = (direcao: 'anterior' | 'proximo') => {
        const novaData = new Date(dataAtual);
        if (visao === 'dia') {
            novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 1 : -1));
        } else if (visao === 'semana') {
            novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 7 : -7));
        } else {
            novaData.setMonth(novaData.getMonth() + (direcao === 'proximo' ? 1 : -1));
        }
        setDataAtual(novaData);
    };

    const irParaHoje = () => {
        setDataAtual(new Date());
    };

    const formatarData = () => {
        if (visao === 'dia') {
            return dataAtual.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        } else if (visao === 'semana') {
            const inicio = new Date(dataAtual);
            inicio.setDate(inicio.getDate() - inicio.getDay());
            const fim = new Date(inicio);
            fim.setDate(fim.getDate() + 6);
            return `${inicio.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${fim.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`;
        }
        return dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string; color: string; bg: string; border: string; glow: string }> = {
            COMPLETED: {
                label: 'Concluído',
                color: '#4ade80',
                bg: 'rgba(5, 60, 35, 0.4)',
                border: 'rgba(34, 197, 94, 0.3)',
                glow: '0 0 15px rgba(74, 222, 128, 0.2)'
            },
            IN_PROGRESS: {
                label: 'Em andamento',
                color: '#fbbf24',
                bg: 'rgba(78, 53, 5, 0.4)',
                border: 'rgba(245, 158, 11, 0.3)',
                glow: '0 0 15px rgba(251, 191, 36, 0.2)'
            },
            SCHEDULED: {
                label: 'Agendado',
                color: '#60a5fa',
                bg: 'rgba(30, 58, 138, 0.4)',
                border: 'rgba(59, 130, 246, 0.3)',
                glow: '0 0 15px rgba(96, 165, 250, 0.2)'
            },
            CANCELLED: {
                label: 'Cancelado',
                color: '#f87171',
                bg: 'rgba(91, 20, 20, 0.4)',
                border: 'rgba(239, 68, 68, 0.3)',
                glow: '0 0 15px rgba(248, 113, 113, 0.2)'
            },
        };
        return configs[status] || configs.SCHEDULED;
    };

    const abrirModal = (horario?: string) => {
        setFormData({
            pacienteId: '',
            dentistaId: dentistas.length > 0 ? dentistas[0].id : '',
            data: dataAtual.toISOString().split('T')[0],
            horario: horario || '08:00',
            motivo: '',
            observacoes: '',
            paymentMethod: '',
        });
        setModalAberto(true);
    };

    const salvarAgendamento = async () => {
        if (!formData.pacienteId || !formData.dentistaId || !formData.motivo) {
            toast.warning('Preencha todos os campos obrigatórios');
            return;
        }

        setSalvando(true);
        try {
            const [ano, mes, dia] = formData.data.split('-').map(Number);
            const [hora, minuto] = formData.horario.split(':').map(Number);
            const scheduledAt = new Date(ano, mes - 1, dia, hora, minuto);

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: formData.pacienteId,
                    dentistId: formData.dentistaId,
                    scheduledAt: scheduledAt.toISOString(),
                    duration: 30,
                    reason: formData.motivo,
                    adminNotes: formData.observacoes,
                    paymentMethod: formData.paymentMethod || null,
                }),
            });

            if (res.ok) {
                toast.success('Agendamento criado com sucesso!');
                setModalAberto(false);
                const novaData = new Date(ano, mes - 1, dia);
                if (novaData.toDateString() !== dataAtual.toDateString()) {
                    setDataAtual(novaData);
                } else {
                    mutateAgendamentos();
                }
            } else {
                const data = await res.json();
                toast.error(data.error || 'Erro ao criar agendamento');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao criar agendamento');
        }
        setSalvando(false);
    };

    const cancelarAgendamento = async (id: string) => {
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });

            if (res.ok) {
                toast.success('Agendamento cancelado');
                setDetalhesAberto(null);
                mutateAgendamentos();
            } else {
                toast.error('Erro ao cancelar agendamento');
            }
        } catch (error) {
            toast.error('Erro ao cancelar agendamento');
        }
    };

    const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
        <div className="agenda-dark">
            <style jsx>{`
                /* Dark Liquid Glass Agenda */
                .agenda-dark {
                    min-height: 100%;
                    color: #f8fafc;
                    position: relative;
                }

                /* Header */
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .nav-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .nav-btn {
                    width: 2.5rem;
                    height: 2.5rem;
                    border: none;
                    border-radius: 0.75rem;
                    background: transparent;
                    color: #94a3b8;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    font-size: 1.25rem;
                }

                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .data-atual {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    padding: 0 0.75rem;
                    text-transform: capitalize;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .visao-btns {
                    display: flex;
                    padding: 0.375rem;
                    background: rgba(30, 41, 59, 0.3);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .visao-btn {
                    padding: 0.5rem 1.25rem;
                    border: none;
                    background: transparent;
                    border-radius: 0.625rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s;
                }

                .visao-btn:hover {
                    color: #e2e8f0;
                    background: rgba(255, 255, 255, 0.05);
                }

                .visao-btn.active {
                    background: rgba(51, 65, 85, 0.8);
                    color: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-novo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 1rem;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(8px);
                }

                .btn-novo:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.6);
                }

                .btn-novo:active {
                    transform: scale(0.98);
                }

                /* Agenda Container */
                .agenda-container {
                    background: rgba(2, 6, 23, 0.4);
                    backdrop-filter: blur(30px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.2);
                }

                .horarios-grid {
                    display: flex;
                    flex-direction: column;
                }

                .horario-row {
                    display: flex;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    min-height: 5rem;
                }

                .horario-row:last-child {
                    border-bottom: none;
                }

                .horario-label {
                    width: 5rem;
                    padding: 1rem 0.75rem;
                    background: rgba(15, 23, 42, 0.3);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(2px);
                }

                .horario-slots {
                    flex: 1;
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                /* Appointment Cards */
                .agendamento-card {
                    padding: 0.875rem 1rem;
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(12px);
                }

                .agendamento-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
                    border-radius: 1rem 1rem 40% 40%;
                    pointer-events: none;
                }

                .agendamento-card:hover {
                    transform: scale(1.02) translateY(-2px);
                    filter: brightness(1.1);
                }

                .agendamento-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.375rem;
                    position: relative;
                    z-index: 1;
                }

                .agendamento-paciente {
                    font-weight: 700;
                    color: white;
                    font-size: 0.9375rem;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .agendamento-status {
                    padding: 0.25rem 0.625rem;
                    border-radius: 0.5rem;
                    font-size: 0.625rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    backdrop-filter: blur(8px);
                }

                .agendamento-motivo {
                    font-size: 0.75rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                    font-weight: 500;
                }

                .agendamento-obs {
                    font-size: 0.6875rem;
                    opacity: 0.7;
                    margin-top: 0.375rem;
                    font-style: italic;
                    position: relative;
                    z-index: 1;
                }

                /* Empty Slot */
                .agendamento-vazio {
                    height: 100%;
                    min-height: 4rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #475569;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .agendamento-vazio:hover {
                    border-color: rgba(6, 182, 212, 0.5);
                    background: rgba(6, 182, 212, 0.1);
                    color: #22d3ee;
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

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                }

                .modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal {
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow: hidden;
                    transform: scale(0.95);
                    transition: transform 0.3s;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                }

                .modal-overlay.active .modal {
                    transform: scale(1);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.05);
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .modal-close {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    width: 2rem;
                    height: 2rem;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: #94a3b8;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close:hover {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .modal-body {
                    padding: 1.5rem;
                    max-height: calc(90vh - 200px);
                    overflow-y: auto;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-label .required {
                    color: #f87171;
                }

                .form-input, .form-select, .form-textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    font-size: 0.9375rem;
                    color: white;
                    transition: all 0.2s;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .form-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.6);
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2), inset 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .form-select option {
                    background: #1e293b;
                    color: white;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .modal-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                }

                .btn-cancelar {
                    padding: 0.75rem 1.25rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    background: transparent;
                    color: #94a3b8;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .btn-cancelar:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-salvar {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }

                .btn-salvar:hover {
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
                    transform: translateY(-1px);
                }

                .btn-salvar:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-danger {
                    padding: 0.75rem 1.25rem;
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .btn-danger:hover {
                    background: rgba(239, 68, 68, 0.3);
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
                }

                .detalhes-section {
                    margin-bottom: 1.5rem;
                }

                .detalhes-section h4 {
                    font-size: 0.625rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }

                .detalhes-section p {
                    font-size: 1rem;
                    color: white;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .header-right {
                        justify-content: space-between;
                    }
                    .data-atual {
                        font-size: 0.9375rem;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <div className="nav-controls">
                        <button className="nav-btn" onClick={() => navegarData('anterior')}>←</button>
                        <span className="data-atual">{formatarData()}</span>
                        <button className="nav-btn" onClick={() => navegarData('proximo')}>→</button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="visao-btns">
                        <button
                            className={`visao-btn ${visao === 'dia' ? 'active' : ''}`}
                            onClick={() => setVisao('dia')}
                        >
                            Dia
                        </button>
                        <button
                            className={`visao-btn ${visao === 'semana' ? 'active' : ''}`}
                            onClick={() => setVisao('semana')}
                        >
                            Semana
                        </button>
                        <button
                            className={`visao-btn ${visao === 'mes' ? 'active' : ''}`}
                            onClick={() => setVisao('mes')}
                        >
                            Mês
                        </button>
                    </div>
                    <button className="btn-novo" onClick={() => abrirModal()}>
                        <span>+</span> Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Agenda Grid */}
            <div className="agenda-container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                        Carregando agenda...
                    </div>
                ) : (
                    <div className="horarios-grid">
                        {horarios.map((horario) => {
                            const agendamentosHorario = agendamentos.filter(a => a.horario === horario);
                            return (
                                <div key={horario} className="horario-row">
                                    <div className="horario-label">{horario}</div>
                                    <div className="horario-slots">
                                        {agendamentosHorario.length > 0 ? (
                                            agendamentosHorario.map((ag) => {
                                                const statusConfig = getStatusConfig(ag.status);
                                                return (
                                                    <div
                                                        key={ag.id}
                                                        className="agendamento-card"
                                                        style={{
                                                            background: statusConfig.bg,
                                                            border: `1px solid ${statusConfig.border}`,
                                                            boxShadow: statusConfig.glow,
                                                        }}
                                                        onClick={() => setDetalhesAberto(ag)}
                                                    >
                                                        <div className="agendamento-header">
                                                            <span className="agendamento-paciente">{ag.pacienteNome}</span>
                                                            <span
                                                                className="agendamento-status"
                                                                style={{
                                                                    background: statusConfig.bg,
                                                                    color: statusConfig.color,
                                                                    border: `1px solid ${statusConfig.border}`
                                                                }}
                                                            >
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <div className="agendamento-motivo" style={{ color: statusConfig.color }}>
                                                            {ag.motivo} • {ag.dentistaNome}
                                                        </div>
                                                        {ag.observacoes && (
                                                            <div className="agendamento-obs">📝 {ag.observacoes}</div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div
                                                className="agendamento-vazio"
                                                onClick={() => abrirModal(horario)}
                                            >
                                                + Agendar
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Novo Agendamento */}
            <div className={`modal-overlay ${modalAberto ? 'active' : ''}`} onClick={() => setModalAberto(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">Novo Agendamento</h3>
                        <button className="modal-close" onClick={() => setModalAberto(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Paciente <span className="required">*</span></label>
                            <select
                                className="form-select"
                                value={formData.pacienteId}
                                onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
                            >
                                <option value="">Selecione um paciente</option>
                                {pacientes.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} - {p.phone}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data <span className="required">*</span></label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Horário <span className="required">*</span></label>
                            <select
                                className="form-select"
                                value={formData.horario}
                                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            >
                                {horarios.map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dentista <span className="required">*</span></label>
                            <select
                                className="form-select"
                                value={formData.dentistaId}
                                onChange={(e) => setFormData({ ...formData, dentistaId: e.target.value })}
                            >
                                <option value="">Selecione um dentista</option>
                                {dentistas.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Motivo da Consulta <span className="required">*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ex: Limpeza, Clareamento, Avaliação..."
                                value={formData.motivo}
                                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Observações</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Observações adicionais..."
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Forma de Pagamento</label>
                            <select
                                className="form-select"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                            >
                                <option value="">Selecione a forma de pagamento</option>
                                <option value="CASH">💵 Dinheiro</option>
                                <option value="CARD">💳 Cartão (Débito/Crédito)</option>
                                <option value="PIX">📱 PIX</option>
                                <option value="DENTAL_PLAN">🏥 Plano Odontológico</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                        <button className="btn-salvar" onClick={salvarAgendamento} disabled={salvando}>
                            {salvando ? '⏳' : '✓'} Salvar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Detalhes */}
            <div className={`modal-overlay ${detalhesAberto ? 'active' : ''}`} onClick={() => setDetalhesAberto(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">Detalhes do Agendamento</h3>
                        <button className="modal-close" onClick={() => setDetalhesAberto(null)}>×</button>
                    </div>
                    {detalhesAberto && (
                        <>
                            <div className="modal-body">
                                <div className="detalhes-section">
                                    <h4>Paciente</h4>
                                    <p>{detalhesAberto.pacienteNome}</p>
                                </div>
                                <div className="detalhes-section">
                                    <h4>Horário</h4>
                                    <p>{detalhesAberto.horario}</p>
                                </div>
                                <div className="detalhes-section">
                                    <h4>Dentista</h4>
                                    <p>{detalhesAberto.dentistaNome}</p>
                                </div>
                                <div className="detalhes-section">
                                    <h4>Motivo</h4>
                                    <p>{detalhesAberto.motivo}</p>
                                </div>
                                <div className="detalhes-section">
                                    <h4>Status</h4>
                                    <p style={{ color: getStatusConfig(detalhesAberto.status).color }}>
                                        {getStatusConfig(detalhesAberto.status).label}
                                    </p>
                                </div>
                                {detalhesAberto.observacoes && (
                                    <div className="detalhes-section">
                                        <h4>Observações</h4>
                                        <p>{detalhesAberto.observacoes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                {detalhesAberto.status === 'SCHEDULED' && (
                                    <button
                                        className="btn-danger"
                                        onClick={() => cancelarAgendamento(detalhesAberto.id)}
                                    >
                                        Cancelar Agendamento
                                    </button>
                                )}
                                <button className="btn-cancelar" onClick={() => setDetalhesAberto(null)}>Fechar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
