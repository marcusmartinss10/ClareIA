'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

interface Paciente {
    id: string;
    name: string;
    phone: string;
    notes?: string;
}

interface AtendimentoAtivo {
    id: string;
    appointmentId: string;
    pacienteId: string;
    pacienteNome: string;
    motivo: string;
    observacoesAgenda?: string;
    dentistaId: string;
    dentistaNome: string;
    inicioAt: Date;
    status: 'IN_PROGRESS' | 'PAUSED';
    tempoTotal: number;
    tempoPausado: number;
}

interface AgendamentoHoje {
    id: string;
    horario: string;
    pacienteId: string;
    pacienteNome: string;
    motivo: string;
    observacoes?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    dentistaNome: string;
    dentistaId: string;
}

interface Prontuario {
    procedimentos: { name: string; tooth?: string; notes?: string }[];
    observacoes: string;
}

export default function ConsultationPage() {
    const [atendimentos, setAtendimentos] = useState<AtendimentoAtivo[]>([]);
    const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoHoje[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalProntuario, setModalProntuario] = useState<AtendimentoAtivo | null>(null);
    const [prontuario, setProntuario] = useState<Prontuario>({
        procedimentos: [{ name: '', tooth: '', notes: '' }],
        observacoes: '',
    });
    const [salvandoProntuario, setSalvandoProntuario] = useState(false);
    const [pacienteHistorico, setPacienteHistorico] = useState<any[]>([]);
    const [agendarRetorno, setAgendarRetorno] = useState(false);
    const [retornoData, setRetornoData] = useState('');
    const [retornoHorario, setRetornoHorario] = useState('');
    const [retornoMotivo, setRetornoMotivo] = useState('Retorno');
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
    const [carregandoHorarios, setCarregandoHorarios] = useState(false);
    const [valorProcedimento, setValorProcedimento] = useState<string>('');
    const toast = useToast();

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAtendimentos(prev =>
                prev.map(a => {
                    if (a.status === 'IN_PROGRESS') {
                        return { ...a, tempoTotal: a.tempoTotal + 1 };
                    }
                    return a;
                })
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const hoje = new Date().toISOString().split('T')[0];
            const resAgendamentos = await fetch(`/api/appointments?date=${hoje}`);
            if (resAgendamentos.ok) {
                const data = await resAgendamentos.json();
                const agendamentosFormatados = (data.agendamentos || []).map((ag: any) => {
                    const date = new Date(ag.scheduledAt);
                    return {
                        id: ag.id,
                        horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        pacienteId: ag.patientId,
                        pacienteNome: ag.patientName || 'Paciente',
                        motivo: ag.reason,
                        observacoes: ag.adminNotes,
                        status: ag.status,
                        dentistaNome: ag.dentistName || 'Dentista',
                        dentistaId: ag.dentistId,
                    };
                });
                setAgendamentosHoje(agendamentosFormatados);

                const emAndamento = agendamentosFormatados.filter((a: AgendamentoHoje) => a.status === 'IN_PROGRESS');
                if (emAndamento.length > 0) {
                    const resConsultas = await fetch('/api/consultations?status=IN_PROGRESS');
                    if (resConsultas.ok) {
                        const dataConsultas = await resConsultas.json();
                        const atendimentosAtivos = (dataConsultas.atendimentos || []).map((c: any) => {
                            const agendamento = emAndamento.find((a: AgendamentoHoje) => a.id === c.appointmentId);
                            return {
                                id: c.id,
                                appointmentId: c.appointmentId,
                                pacienteId: c.patientId,
                                pacienteNome: agendamento?.pacienteNome || 'Paciente',
                                motivo: agendamento?.motivo || '',
                                observacoesAgenda: agendamento?.observacoes,
                                dentistaId: c.dentistId,
                                dentistaNome: agendamento?.dentistaNome || 'Dentista',
                                inicioAt: new Date(c.startedAt),
                                status: c.status,
                                tempoTotal: c.totalTime || Math.floor((Date.now() - new Date(c.startedAt).getTime()) / 1000),
                                tempoPausado: c.pauseTime || 0,
                            };
                        });
                        setAtendimentos(atendimentosAtivos);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar atendimentos');
        }
        setLoading(false);
    };

    const formatarTempo = (segundos: number) => {
        const h = Math.floor(segundos / 3600);
        const m = Math.floor((segundos % 3600) / 60);
        const s = segundos % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const pausarAtendimento = async (atendimento: AtendimentoAtivo) => {
        try {
            const res = await fetch('/api/consultations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: atendimento.id, action: 'pause' }),
            });
            if (res.ok) {
                setAtendimentos(prev => prev.map(a => a.id === atendimento.id ? { ...a, status: 'PAUSED' as const } : a));
                toast.info('Atendimento pausado');
            }
        } catch (error) {
            toast.error('Erro ao pausar atendimento');
        }
    };

    const retomarAtendimento = async (atendimento: AtendimentoAtivo) => {
        try {
            const res = await fetch('/api/consultations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: atendimento.id, action: 'resume' }),
            });
            if (res.ok) {
                setAtendimentos(prev => prev.map(a => a.id === atendimento.id ? { ...a, status: 'IN_PROGRESS' as const } : a));
                toast.success('Atendimento retomado');
            }
        } catch (error) {
            toast.error('Erro ao retomar atendimento');
        }
    };

    const abrirModalProntuario = async (atendimento: AtendimentoAtivo) => {
        setModalProntuario(atendimento);
        setProntuario({ procedimentos: [{ name: '', tooth: '', notes: '' }], observacoes: '' });
        setAgendarRetorno(false);
        setRetornoData('');
        setRetornoHorario('');
        setRetornoMotivo('Retorno');
        setHorariosDisponiveis([]);
        setValorProcedimento('');

        try {
            const res = await fetch(`/api/medical-records?patientId=${atendimento.pacienteId}`);
            if (res.ok) {
                const data = await res.json();
                setPacienteHistorico(data.prontuarios || []);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    const buscarHorariosDisponiveis = async (data: string) => {
        if (!data || !modalProntuario) return;
        setCarregandoHorarios(true);
        setRetornoData(data);
        setRetornoHorario('');
        try {
            const res = await fetch(`/api/appointments?date=${data}`);
            if (res.ok) {
                const result = await res.json();
                const agendamentosDia = result.agendamentos || [];
                const todosHorarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
                const horariosOcupados = agendamentosDia.filter((ag: any) => ag.dentistId === modalProntuario.dentistaId && ag.status !== 'CANCELLED').map((ag: any) => { const date = new Date(ag.scheduledAt); return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }); });
                setHorariosDisponiveis(todosHorarios.filter(h => !horariosOcupados.includes(h)));
            }
        } catch (error) {
            toast.error('Erro ao buscar horários disponíveis');
        }
        setCarregandoHorarios(false);
    };

    const adicionarProcedimento = () => { setProntuario(prev => ({ ...prev, procedimentos: [...prev.procedimentos, { name: '', tooth: '', notes: '' }] })); };
    const removerProcedimento = (index: number) => { setProntuario(prev => ({ ...prev, procedimentos: prev.procedimentos.filter((_, i) => i !== index) })); };
    const atualizarProcedimento = (index: number, field: string, value: string) => { setProntuario(prev => ({ ...prev, procedimentos: prev.procedimentos.map((p, i) => i === index ? { ...p, [field]: value } : p) })); };

    const encerrarAtendimento = async () => {
        if (!modalProntuario) return;
        const procedimentosValidos = prontuario.procedimentos.filter(p => p.name.trim());
        if (procedimentosValidos.length === 0) { toast.warning('Informe pelo menos um procedimento realizado'); return; }
        if (agendarRetorno && (!retornoData || !retornoHorario)) { toast.warning('Selecione data e horário para o retorno'); return; }

        setSalvandoProntuario(true);
        try {
            const paymentAmount = valorProcedimento ? parseFloat(valorProcedimento.replace(',', '.')) : null;
            const res = await fetch('/api/consultations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: modalProntuario.id,
                    action: 'end',
                    prontuario: { procedimentos: procedimentosValidos, observacoes: prontuario.observacoes },
                    paymentAmount: paymentAmount,
                }),
            });
            if (res.ok) {
                if (agendarRetorno && retornoData && retornoHorario) {
                    const [ano, mes, dia] = retornoData.split('-').map(Number);
                    const [hora, minuto] = retornoHorario.split(':').map(Number);
                    const scheduledAt = new Date(ano, mes - 1, dia, hora, minuto);
                    await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: modalProntuario.pacienteId, dentistId: modalProntuario.dentistaId, scheduledAt: scheduledAt.toISOString(), duration: 30, reason: retornoMotivo, adminNotes: `Retorno do atendimento de ${new Date().toLocaleDateString('pt-BR')}` }) });
                    toast.success('Atendimento finalizado e retorno agendado!');
                } else {
                    toast.success('Atendimento finalizado com sucesso!');
                }
                setAtendimentos(prev => prev.filter(a => a.id !== modalProntuario.id));
                setAgendamentosHoje(prev => prev.map(a => a.id === modalProntuario.appointmentId ? { ...a, status: 'COMPLETED' as const } : a));
                setModalProntuario(null);
            } else {
                toast.error('Erro ao finalizar atendimento');
            }
        } catch (error) {
            toast.error('Erro ao finalizar atendimento');
        }
        setSalvandoProntuario(false);
    };

    const iniciarAtendimento = async (agendamento: AgendamentoHoje) => {
        try {
            const res = await fetch('/api/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appointmentId: agendamento.id }) });
            if (res.ok) {
                const data = await res.json();
                const novoAtendimento: AtendimentoAtivo = { id: data.atendimento.id, appointmentId: agendamento.id, pacienteId: agendamento.pacienteId, pacienteNome: agendamento.pacienteNome, motivo: agendamento.motivo, observacoesAgenda: agendamento.observacoes, dentistaId: agendamento.dentistaId, dentistaNome: agendamento.dentistaNome, inicioAt: new Date(), status: 'IN_PROGRESS', tempoTotal: 0, tempoPausado: 0 };
                setAtendimentos(prev => [...prev, novoAtendimento]);
                setAgendamentosHoje(prev => prev.map(a => a.id === agendamento.id ? { ...a, status: 'IN_PROGRESS' as const } : a));
                toast.success(`Atendimento de ${agendamento.pacienteNome} iniciado!`);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Erro ao iniciar atendimento');
            }
        } catch (error) {
            toast.error('Erro ao iniciar atendimento');
        }
    };

    const proximosAgendamentos = agendamentosHoje.filter(a => a.status === 'SCHEDULED');
    const concluidos = agendamentosHoje.filter(a => a.status === 'COMPLETED');

    return (
        <div className="consultation-dark">
            <style jsx>{`
                /* Dark Liquid Glass Consultation */
                .consultation-dark {
                    min-height: 100%;
                    color: #f8fafc;
                    position: relative;
                }

                /* Active Session Card */
                .session-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(30px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .session-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
                }

                .session-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .patient-info {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .patient-avatar {
                    width: 5rem;
                    height: 5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                }

                .patient-details h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .patient-procedure {
                    font-size: 0.875rem;
                    color: #22d3ee;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-active {
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
                }

                .status-paused {
                    background: rgba(245, 158, 11, 0.1);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    box-shadow: 0 0 10px rgba(245, 158, 11, 0.1);
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }

                .obs-box {
                    background: rgba(245, 158, 11, 0.1);
                    border-left: 3px solid #fbbf24;
                    padding: 0.75rem 1rem;
                    border-radius: 0 0.75rem 0.75rem 0;
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    color: #fcd34d;
                }

                .obs-box strong {
                    display: block;
                    margin-bottom: 0.25rem;
                    color: #fbbf24;
                }

                /* Timer */
                .timer-section {
                    text-align: center;
                    margin: 2rem 0;
                }

                .timer-display {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 5rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 0 30px rgba(34, 211, 238, 0.5);
                    letter-spacing: 0.1em;
                    margin-bottom: 0.5rem;
                }

                .timer-label {
                    color: #64748b;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                /* Controls */
                .controls {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .btn-control {
                    height: 4rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    border-radius: 1rem;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                    position: relative;
                    overflow: hidden;
                }

                .btn-control::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.5s;
                }

                .btn-control:hover::before {
                    transform: translateX(100%);
                }

                .btn-start {
                    background: rgba(6, 182, 212, 0.2);
                    color: #67e8f9;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
                }

                .btn-start:hover {
                    background: rgba(6, 182, 212, 0.3);
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);
                }

                .btn-pause {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-pause:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .btn-end {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .btn-end:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .btn-end .timer-mini {
                    font-size: 0.75rem;
                    color: #22d3ee;
                    font-family: monospace;
                    text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
                }

                .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(to right, #06b6d4, #3b82f6);
                    box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
                }

                /* Queue Section */
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .section-icon {
                    color: #22d3ee;
                }

                .queue-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .queue-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .queue-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .queue-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .queue-time {
                    padding: 0.5rem 0.75rem;
                    background: rgba(6, 182, 212, 0.1);
                    color: #67e8f9;
                    border-radius: 0.5rem;
                    font-weight: 700;
                    font-size: 0.875rem;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }

                .queue-details h4 {
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.125rem;
                }

                .queue-details p {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .queue-obs {
                    font-size: 0.6875rem;
                    color: #fbbf24;
                    background: rgba(245, 158, 11, 0.1);
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    margin-top: 0.25rem;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }

                .btn-iniciar {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8));
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }

                .btn-iniciar:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 25px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    color: #64748b;
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.3;
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

                /* Completed Section */
                .completed-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    opacity: 0.6;
                }

                .completed-check {
                    color: #22c55e;
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
                    max-width: 700px;
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
                }

                .modal-close {
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: #94a3b8;
                    transition: all 0.2s;
                }

                .modal-close:hover {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }

                .modal-body {
                    padding: 1.5rem;
                    max-height: calc(90vh - 200px);
                    overflow-y: auto;
                }

                .info-box {
                    background: rgba(6, 182, 212, 0.1);
                    border: 1px solid rgba(6, 182, 212, 0.2);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }

                .info-box h4 {
                    font-weight: 700;
                    color: #22d3ee;
                    margin-bottom: 0.5rem;
                }

                .info-box p {
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .proc-group {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                }

                .proc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .proc-number {
                    font-weight: 600;
                    color: #22d3ee;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                }

                .proc-remove {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    width: 1.75rem;
                    height: 1.75rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .proc-remove:hover {
                    background: rgba(239, 68, 68, 0.2);
                }

                .proc-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 0.75rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    color: #64748b;
                    margin-bottom: 0.375rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-input {
                    width: 100%;
                    padding: 0.625rem 0.875rem;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.2s;
                }

                .form-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .form-input:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.6);
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
                }

                .btn-add-proc {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: #64748b;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 1.5rem;
                }

                .btn-add-proc:hover {
                    border-color: rgba(6, 182, 212, 0.5);
                    color: #22d3ee;
                    background: rgba(6, 182, 212, 0.05);
                }

                .section-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.75rem;
                    margin-top: 1.5rem;
                }

                .retorno-check {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .retorno-check:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .retorno-check input {
                    width: 1.25rem;
                    height: 1.25rem;
                    accent-color: #22d3ee;
                }

                .retorno-check label {
                    font-weight: 500;
                    color: white;
                    cursor: pointer;
                }

                .retorno-fields {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                    margin-top: 1rem;
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

                .btn-finalizar {
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

                .btn-finalizar:hover {
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
                    transform: translateY(-1px);
                }

                .btn-finalizar:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @media (max-width: 768px) {
                    .controls {
                        grid-template-columns: 1fr;
                    }
                    .timer-display {
                        font-size: 3rem;
                    }
                    .session-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .proc-row, .retorno-fields {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                    Carregando atendimentos...
                </div>
            ) : (
                <>
                    {/* Active Sessions */}
                    {atendimentos.map((atendimento) => (
                        <div key={atendimento.id} className="session-card">
                            <div className="session-header">
                                <div className="patient-info">
                                    <div className="patient-avatar">
                                        {atendimento.pacienteNome.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="patient-details">
                                        <h2>{atendimento.pacienteNome}</h2>
                                        <p className="patient-procedure">{atendimento.motivo}</p>
                                    </div>
                                </div>
                                <span className={`status-badge ${atendimento.status === 'IN_PROGRESS' ? 'status-active' : 'status-paused'}`}>
                                    <span className="pulse-dot" />
                                    {atendimento.status === 'IN_PROGRESS' ? 'Em Atendimento' : 'Pausado'}
                                </span>
                            </div>

                            {atendimento.observacoesAgenda && (
                                <div className="obs-box">
                                    <strong>📋 Observações da Agenda</strong>
                                    {atendimento.observacoesAgenda}
                                </div>
                            )}

                            <div className="timer-section">
                                <div className="timer-display">{formatarTempo(atendimento.tempoTotal)}</div>
                                <div className="timer-label">Tempo de Atendimento</div>
                            </div>

                            <div className="controls">
                                <button className="btn-control btn-start" onClick={() => abrirModalProntuario(atendimento)}>
                                    ▶ INICIAR CONSULTA
                                </button>
                                {atendimento.status === 'IN_PROGRESS' ? (
                                    <button className="btn-control btn-pause" onClick={() => pausarAtendimento(atendimento)}>
                                        ⏸ PAUSAR
                                    </button>
                                ) : (
                                    <button className="btn-control btn-pause" onClick={() => retomarAtendimento(atendimento)}>
                                        ▶ RETOMAR
                                    </button>
                                )}
                                <button className="btn-control btn-end" onClick={() => abrirModalProntuario(atendimento)}>
                                    <span>🚪 FINALIZAR</span>
                                    <span className="timer-mini">{formatarTempo(atendimento.tempoTotal)}</span>
                                    <div className="progress-bar" style={{ width: '33%' }} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Queue */}
                    {proximosAgendamentos.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3 className="section-title">
                                <span className="section-icon">📋</span>
                                Próximos na Fila ({proximosAgendamentos.length})
                            </h3>
                            <div className="queue-list">
                                {proximosAgendamentos.map((ag) => (
                                    <div key={ag.id} className="queue-card">
                                        <div className="queue-info">
                                            <span className="queue-time">{ag.horario}</span>
                                            <div className="queue-details">
                                                <h4>{ag.pacienteNome}</h4>
                                                <p>{ag.motivo} • {ag.dentistaNome}</p>
                                                {ag.observacoes && (
                                                    <span className="queue-obs">📝 {ag.observacoes}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button className="btn-iniciar" onClick={() => iniciarAtendimento(ag)}>
                                            ▶ Iniciar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {atendimentos.length === 0 && proximosAgendamentos.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🦷</div>
                            <p>Nenhum atendimento agendado para hoje</p>
                        </div>
                    )}

                    {/* Completed */}
                    {concluidos.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3 className="section-title">
                                <span className="section-icon">✅</span>
                                Concluídos Hoje ({concluidos.length})
                            </h3>
                            <div className="queue-list">
                                {concluidos.map((ag) => (
                                    <div key={ag.id} className="completed-card">
                                        <span className="completed-check">✓</span>
                                        <span>{ag.horario}</span>
                                        <span>{ag.pacienteNome}</span>
                                        <span style={{ color: '#64748b' }}>{ag.motivo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal Prontuário */}
            <div className={`modal-overlay ${modalProntuario ? 'active' : ''}`} onClick={() => setModalProntuario(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">Finalizar Atendimento</h3>
                        <button className="modal-close" onClick={() => setModalProntuario(null)}>×</button>
                    </div>
                    <div className="modal-body">
                        {modalProntuario && (
                            <>
                                <div className="info-box">
                                    <h4>{modalProntuario.pacienteNome}</h4>
                                    <p>{modalProntuario.motivo} • Tempo: {formatarTempo(modalProntuario.tempoTotal)}</p>
                                </div>

                                <div className="section-label">Procedimentos Realizados</div>
                                {prontuario.procedimentos.map((proc, index) => (
                                    <div key={index} className="proc-group">
                                        <div className="proc-header">
                                            <span className="proc-number">Procedimento {index + 1}</span>
                                            {prontuario.procedimentos.length > 1 && (
                                                <button className="proc-remove" onClick={() => removerProcedimento(index)}>×</button>
                                            )}
                                        </div>
                                        <div className="proc-row">
                                            <div>
                                                <label className="form-label">Procedimento *</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Ex: Limpeza, Restauração..."
                                                    value={proc.name}
                                                    onChange={(e) => atualizarProcedimento(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Dente</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Ex: 36"
                                                    value={proc.tooth || ''}
                                                    onChange={(e) => atualizarProcedimento(index, 'tooth', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn-add-proc" onClick={adicionarProcedimento}>
                                    + Adicionar Procedimento
                                </button>

                                <div className="section-label">Observações</div>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="Observações do atendimento..."
                                    value={prontuario.observacoes}
                                    onChange={(e) => setProntuario(prev => ({ ...prev, observacoes: e.target.value }))}
                                />

                                <div className="section-label">💰 Valor do Procedimento</div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#22d3ee', fontSize: '1.5rem', fontWeight: 700 }}>R$</span>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="0,00"
                                            value={valorProcedimento}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9,]/g, '');
                                                setValorProcedimento(value);
                                            }}
                                            style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: '#22d3ee',
                                                maxWidth: '200px'
                                            }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                        Informe o valor cobrado pelo atendimento (será exibido nos relatórios)
                                    </p>
                                </div>

                                <div className="section-label">Agendamento de Retorno</div>
                                <div className="retorno-check">
                                    <input
                                        type="checkbox"
                                        id="retorno"
                                        checked={agendarRetorno}
                                        onChange={(e) => setAgendarRetorno(e.target.checked)}
                                    />
                                    <label htmlFor="retorno">Agendar retorno para este paciente</label>
                                </div>
                                {agendarRetorno && (
                                    <div className="retorno-fields">
                                        <div>
                                            <label className="form-label">Data</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={retornoData}
                                                onChange={(e) => buscarHorariosDisponiveis(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Horário</label>
                                            <select
                                                className="form-input"
                                                value={retornoHorario}
                                                onChange={(e) => setRetornoHorario(e.target.value)}
                                                disabled={carregandoHorarios || !retornoData}
                                            >
                                                <option value="">Selecione</option>
                                                {horariosDisponiveis.map(h => (
                                                    <option key={h} value={h}>{h}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">Motivo</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={retornoMotivo}
                                                onChange={(e) => setRetornoMotivo(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={() => setModalProntuario(null)}>Cancelar</button>
                        <button className="btn-finalizar" onClick={encerrarAtendimento} disabled={salvandoProntuario}>
                            {salvandoProntuario ? <><span className="btn-spinner" /> Salvando...</> : '✓ Finalizar Atendimento'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
