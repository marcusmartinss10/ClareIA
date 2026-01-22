'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Paciente {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    email?: string;
    birthDate?: string;
    notes?: string;
    createdAt: string;
}

interface Agendamento {
    id: string;
    scheduledAt: string;
    reason: string;
    status: string;
    dentistName: string;
    adminNotes?: string;
}

interface Atendimento {
    id: string;
    startedAt: string;
    endedAt?: string;
    totalTime: number;
    status: string;
}

interface Prontuario {
    id: string;
    createdAt: string;
    procedures: { name: string; tooth?: string; notes?: string }[];
    observations?: string;
}

interface Stats {
    totalAtendimentos: number;
    totalTempoAtendimento: number;
    ultimoAtendimento?: Atendimento;
    proximoAgendamento?: Agendamento;
}

export default function PacientePerfilPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const pacienteId = params.id as string;

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<'historico' | 'prontuarios' | 'agendamentos'>('historico');

    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        birthDate: '',
        notes: '',
    });

    useEffect(() => {
        carregarDados();
    }, [pacienteId]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/patients/${pacienteId}`);
            if (!res.ok) {
                toast.error('Paciente não encontrado');
                router.push('/patients');
                return;
            }

            const data = await res.json();
            setPaciente(data.paciente);
            setAgendamentos(data.agendamentos || []);
            setProntuarios(data.prontuarios || []);
            setStats(data.stats);

            // Preencher formulário de edição
            const p = data.paciente;
            setFormData({
                name: p.name || '',
                cpf: p.cpf || '',
                phone: p.phone || '',
                email: p.email || '',
                birthDate: p.birthDate ? new Date(p.birthDate).toISOString().split('T')[0] : '',
                notes: p.notes || '',
            });
        } catch (error) {
            console.error('Erro ao carregar paciente:', error);
            toast.error('Erro ao carregar dados do paciente');
        }
        setLoading(false);
    };

    const salvarEdicao = async () => {
        setSalvando(true);
        try {
            const res = await fetch(`/api/patients/${pacienteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success('Dados atualizados com sucesso!');
                setEditando(false);
                carregarDados();
            } else {
                toast.error('Erro ao atualizar dados');
            }
        } catch (error) {
            toast.error('Erro ao salvar alterações');
        }
        setSalvando(false);
    };

    const formatarTempo = (segundos: number) => {
        const h = Math.floor(segundos / 3600);
        const m = Math.floor((segundos % 3600) / 60);
        if (h > 0) return `${h}h ${m}min`;
        return `${m}min`;
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatarDataHora = (data: string) => {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calcularIdade = (birthDate: string) => {
        const hoje = new Date();
        const nascimento = new Date(birthDate);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string; cor: string; bg: string }> = {
            COMPLETED: { label: 'Concluído', cor: '#166534', bg: '#dcfce7' },
            IN_PROGRESS: { label: 'Em andamento', cor: '#92400e', bg: '#fef3c7' },
            SCHEDULED: { label: 'Agendado', cor: '#1e40af', bg: '#dbeafe' },
            CANCELLED: { label: 'Cancelado', cor: '#991b1b', bg: '#fee2e2' },
        };
        return configs[status] || { label: status, cor: '#374151', bg: '#f3f4f6' };
    };

    if (loading) {
        return (
            <div className="loading-page">
                <style jsx>{`
                    .loading-page {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 50vh;
                        color: var(--text-secondary);
                    }
                `}</style>
                <div>Carregando perfil do paciente...</div>
            </div>
        );
    }

    if (!paciente) return null;

    return (
        <div className="perfil-page">
            <style jsx>{`
                .perfil-page {
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .btn-voltar {
                    padding: 0.5rem 1rem;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .btn-voltar:hover {
                    background: var(--bg-secondary);
                }

                .page-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    flex: 1;
                }

                /* Perfil Card */
                .perfil-card {
                    background: linear-gradient(135deg, #1e3a5f 0%, #0d47a1 100%);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    color: white;
                    margin-bottom: 1.5rem;
                }

                .perfil-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .perfil-info {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .perfil-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                }

                .perfil-dados h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .perfil-dados p {
                    opacity: 0.8;
                    font-size: 0.925rem;
                    margin-bottom: 0.25rem;
                }

                .perfil-acoes {
                    display: flex;
                    gap: 0.75rem;
                }

                .btn-editar, .btn-agendar {
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .btn-editar {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                }

                .btn-editar:hover {
                    background: rgba(255,255,255,0.3);
                }

                .btn-agendar {
                    background: #4caf50;
                    border: none;
                    color: white;
                }

                .btn-agendar:hover {
                    background: #43a047;
                }

                /* Stats Cards */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .stat-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.75rem;
                    opacity: 0.8;
                    text-transform: uppercase;
                }

                /* Abas */
                .tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    background: var(--bg-secondary);
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    width: fit-content;
                }

                .tab {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: transparent;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                }

                .tab.active {
                    background: var(--bg-primary);
                    color: var(--primary-600);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                /* Histórico */
                .historico-item {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    margin-bottom: 0.75rem;
                    transition: all 0.2s;
                }

                .historico-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .historico-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                }

                .historico-data {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .historico-status {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .historico-motivo {
                    color: var(--text-secondary);
                    font-size: 0.925rem;
                    margin-bottom: 0.5rem;
                }

                .historico-dentista {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                /* Prontuários */
                .prontuario-item {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    margin-bottom: 0.75rem;
                }

                .prontuario-data {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }

                .procedimento {
                    background: var(--bg-secondary);
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .procedimento-nome {
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .procedimento-dente {
                    color: var(--primary-600);
                    font-size: 0.875rem;
                }

                .procedimento-obs {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }

                .prontuario-obs {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    font-style: italic;
                }

                /* Modal Edição */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                }

                .modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal {
                    background: var(--bg-primary);
                    border-radius: 1rem;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow: hidden;
                    transform: scale(0.95);
                    transition: transform 0.2s;
                }

                .modal-overlay.active .modal {
                    transform: scale(1);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-muted);
                }

                .modal-body {
                    padding: 1.5rem;
                    max-height: calc(90vh - 180px);
                    overflow-y: auto;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }

                .form-input, .form-textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                    font-size: 0.925rem;
                    transition: all 0.2s;
                }

                .form-input:focus, .form-textarea:focus {
                    outline: none;
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .modal-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    background: var(--bg-secondary);
                }

                .btn-cancelar {
                    padding: 0.75rem 1.25rem;
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                    background: var(--bg-primary);
                    cursor: pointer;
                    font-weight: 500;
                }

                .btn-salvar {
                    padding: 0.75rem 1.25rem;
                    background: var(--primary-500);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }

                .btn-salvar:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: var(--text-secondary);
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                @media (max-width: 768px) {
                    .perfil-header {
                        flex-direction: column;
                    }
                    .stats-row {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Cabeçalho */}
            <div className="page-header">
                <Link href="/patients" className="btn-voltar">
                    ← Voltar
                </Link>
                <h1 className="page-title">Perfil do Paciente</h1>
            </div>

            {/* Card do Perfil */}
            <div className="perfil-card">
                <div className="perfil-header">
                    <div className="perfil-info">
                        <div className="perfil-avatar">
                            {paciente.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="perfil-dados">
                            <h2>{paciente.name}</h2>
                            <p>📱 {paciente.phone}</p>
                            {paciente.email && <p>✉️ {paciente.email}</p>}
                            {paciente.birthDate && (
                                <p>🎂 {formatarData(paciente.birthDate)} ({calcularIdade(paciente.birthDate)} anos)</p>
                            )}
                            {paciente.cpf && <p>🪪 CPF: {paciente.cpf}</p>}
                        </div>
                    </div>
                    <div className="perfil-acoes">
                        <button className="btn-editar" onClick={() => setEditando(true)}>
                            ✏️ Editar
                        </button>
                        <Link href="/agenda" className="btn-agendar">
                            + Agendar
                        </Link>
                    </div>
                </div>

                {/* Estatísticas */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-value">{stats?.totalAtendimentos || 0}</div>
                        <div className="stat-label">Atendimentos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {stats?.totalTempoAtendimento ? formatarTempo(stats.totalTempoAtendimento) : '0min'}
                        </div>
                        <div className="stat-label">Tempo Total</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {stats?.ultimoAtendimento
                                ? formatarData(stats.ultimoAtendimento.endedAt || stats.ultimoAtendimento.startedAt)
                                : '--'}
                        </div>
                        <div className="stat-label">Último Atendimento</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {stats?.proximoAgendamento
                                ? formatarData(stats.proximoAgendamento.scheduledAt)
                                : '--'}
                        </div>
                        <div className="stat-label">Próxima Consulta</div>
                    </div>
                </div>
            </div>

            {/* Observações */}
            {paciente.notes && (
                <div className="historico-item" style={{ marginBottom: '1.5rem' }}>
                    <strong>📝 Observações Gerais:</strong>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{paciente.notes}</p>
                </div>
            )}

            {/* Abas */}
            <div className="tabs">
                <button
                    className={`tab ${abaAtiva === 'historico' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('historico')}
                >
                    📋 Histórico
                </button>
                <button
                    className={`tab ${abaAtiva === 'prontuarios' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('prontuarios')}
                >
                    🦷 Prontuários
                </button>
                <button
                    className={`tab ${abaAtiva === 'agendamentos' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('agendamentos')}
                >
                    📅 Agendamentos
                </button>
            </div>

            {/* Conteúdo das Abas */}
            {abaAtiva === 'historico' && (
                <div>
                    {agendamentos.filter(a => a.status === 'COMPLETED').length > 0 ? (
                        agendamentos
                            .filter(a => a.status === 'COMPLETED')
                            .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                            .map(ag => {
                                const status = getStatusConfig(ag.status);
                                return (
                                    <div key={ag.id} className="historico-item">
                                        <div className="historico-header">
                                            <span className="historico-data">{formatarDataHora(ag.scheduledAt)}</span>
                                            <span className="historico-status" style={{ background: status.bg, color: status.cor }}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="historico-motivo">🦷 {ag.reason}</div>
                                        <div className="historico-dentista">👨‍⚕️ {ag.dentistName}</div>
                                        {ag.adminNotes && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                📝 {ag.adminNotes}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <p>Nenhum atendimento concluído</p>
                        </div>
                    )}
                </div>
            )}

            {abaAtiva === 'prontuarios' && (
                <div>
                    {prontuarios.length > 0 ? (
                        prontuarios
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map(p => (
                                <div key={p.id} className="prontuario-item">
                                    <div className="prontuario-data">📅 {formatarDataHora(p.createdAt)}</div>
                                    {p.procedures.map((proc, i) => (
                                        <div key={i} className="procedimento">
                                            <div className="procedimento-nome">{proc.name}</div>
                                            {proc.tooth && <div className="procedimento-dente">Dente: {proc.tooth}</div>}
                                            {proc.notes && <div className="procedimento-obs">{proc.notes}</div>}
                                        </div>
                                    ))}
                                    {p.observations && (
                                        <div className="prontuario-obs">
                                            <strong>Observações:</strong> {p.observations}
                                        </div>
                                    )}
                                </div>
                            ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🦷</div>
                            <p>Nenhum prontuário registrado</p>
                        </div>
                    )}
                </div>
            )}

            {abaAtiva === 'agendamentos' && (
                <div>
                    {agendamentos.filter(a => a.status === 'SCHEDULED').length > 0 ? (
                        agendamentos
                            .filter(a => a.status === 'SCHEDULED')
                            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                            .map(ag => {
                                const status = getStatusConfig(ag.status);
                                return (
                                    <div key={ag.id} className="historico-item">
                                        <div className="historico-header">
                                            <span className="historico-data">{formatarDataHora(ag.scheduledAt)}</span>
                                            <span className="historico-status" style={{ background: status.bg, color: status.cor }}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="historico-motivo">🦷 {ag.reason}</div>
                                        <div className="historico-dentista">👨‍⚕️ {ag.dentistName}</div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <p>Nenhum agendamento futuro</p>
                            <Link href="/agenda" style={{ color: 'var(--primary-500)', marginTop: '1rem', display: 'inline-block' }}>
                                + Criar agendamento
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Edição */}
            <div className={`modal-overlay ${editando ? 'active' : ''}`} onClick={() => setEditando(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">Editar Paciente</h3>
                        <button className="modal-close" onClick={() => setEditando(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Nome Completo *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">CPF</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Telefone *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">E-mail</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Data de Nascimento</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Observações</label>
                            <textarea
                                className="form-textarea"
                                rows={4}
                                placeholder="Alergias, condições médicas, preferências..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                        <button className="btn-salvar" onClick={salvarEdicao} disabled={salvando}>
                            {salvando ? 'Salvando...' : '✓ Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
