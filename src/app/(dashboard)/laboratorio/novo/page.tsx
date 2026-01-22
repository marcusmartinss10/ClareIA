'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkTypeLabels, UrgencyLabels } from '@/types';

interface Patient {
    id: string;
    name: string;
    phone?: string;
}

interface Protetico {
    id: string;
    name: string;
    laboratoryName?: string;
    specialties: string[];
}

const workTypes = [
    { value: 'crown', label: 'Coroa', icon: '👑', desc: 'Coroa unitária ou múltipla' },
    { value: 'partial_prosthesis', label: 'Prótese Parcial', icon: '🔗', desc: 'PPR ou prótese removível' },
    { value: 'total_prosthesis', label: 'Prótese Total', icon: '🦷', desc: 'Dentadura completa' },
    { value: 'veneer', label: 'Faceta', icon: '✨', desc: 'Laminado ou faceta' },
    { value: 'implant', label: 'Implante', icon: '🔩', desc: 'Prótese sobre implante' },
    { value: 'bridge', label: 'Ponte', icon: '🌉', desc: 'Ponte fixa' },
    { value: 'other', label: 'Outro', icon: '📝', desc: 'Trabalho personalizado' },
];

export default function NovoLaboratorioPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [patients, setPatients] = useState<Patient[]>([]);
    const [proteticos, setProteticos] = useState<Protetico[]>([]);
    const [searchPatient, setSearchPatient] = useState('');

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [workType, setWorkType] = useState('');
    const [workTypeCustom, setWorkTypeCustom] = useState('');
    const [material, setMaterial] = useState('');
    const [shade, setShade] = useState('');
    const [toothNumbers, setToothNumbers] = useState('');
    const [observations, setObservations] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [deadline, setDeadline] = useState('');
    const [selectedProtetico, setSelectedProtetico] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [patientsRes, laboratoriesRes] = await Promise.all([
                fetch('/api/patients'),
                fetch('/api/laboratories'),
            ]);

            if (patientsRes.ok) {
                const data = await patientsRes.json();
                setPatients(data.pacientes || data.patients || []);
            }

            if (laboratoriesRes.ok) {
                const data = await laboratoriesRes.json();
                setProteticos(data.laboratories || data.proteticos || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!selectedPatient || !workType) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/prosthetic-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient.id,
                    proteticoId: selectedProtetico || null,
                    workType,
                    workTypeCustom: workType === 'other' ? workTypeCustom : null,
                    material,
                    shade,
                    toothNumbers,
                    observations,
                    urgency,
                    deadline: deadline || null,
                }),
            });

            if (res.ok) {
                router.push('/laboratorio');
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao criar pedido');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Erro ao criar pedido');
        } finally {
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return !!selectedPatient;
        if (step === 2) return !!workType && (workType !== 'other' || workTypeCustom);
        if (step === 3) return true;
        return true;
    };

    return (
        <div className="novo-pedido">
            <style jsx>{`
                .novo-pedido {
                    min-height: 100%;
                    color: #f8fafc;
                    max-width: 800px;
                    margin: 0 auto;
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

                .page-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    color: #64748b;
                }

                /* Progress */
                .progress-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }

                .progress-step {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .progress-step.active {
                    background: linear-gradient(to right, #22d3ee, #06b6d4);
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
                }

                .progress-step.completed {
                    background: #22d3ee;
                }

                /* Card */
                .form-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                }

                .step-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .step-desc {
                    color: #64748b;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }

                /* Search Input */
                .search-input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    padding-left: 2.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.2s;
                    margin-bottom: 1rem;
                }

                .search-input:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.5);
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
                }

                .search-input::placeholder {
                    color: #475569;
                }

                .search-wrapper {
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #475569;
                }

                /* Patient List */
                .patient-list {
                    max-height: 300px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .patient-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .patient-option:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .patient-option.selected {
                    background: rgba(6, 182, 212, 0.1);
                    border-color: rgba(6, 182, 212, 0.3);
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
                    color: white;
                }

                .patient-name {
                    font-weight: 500;
                    color: white;
                }

                .patient-phone {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                /* Work Types Grid */
                .work-types-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                }

                .work-type-card {
                    padding: 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .work-type-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-2px);
                }

                .work-type-card.selected {
                    background: rgba(6, 182, 212, 0.1);
                    border-color: rgba(6, 182, 212, 0.4);
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
                }

                .work-type-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .work-type-label {
                    font-weight: 600;
                    color: white;
                    font-size: 0.875rem;
                    margin-bottom: 0.25rem;
                }

                .work-type-desc {
                    font-size: 0.6875rem;
                    color: #64748b;
                }

                /* Form Fields */
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group.full {
                    grid-column: 1 / -1;
                }

                .form-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #cbd5e1;
                }

                .form-input, .form-select, .form-textarea {
                    padding: 0.75rem 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.2s;
                }

                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.5);
                }

                .form-select {
                    appearance: none;
                    cursor: pointer;
                }

                .form-textarea {
                    resize: none;
                    min-height: 100px;
                }

                /* Urgency Options */
                .urgency-options {
                    display: flex;
                    gap: 0.75rem;
                }

                .urgency-option {
                    flex: 1;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .urgency-option:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .urgency-option.selected {
                    border-color: rgba(6, 182, 212, 0.4);
                }

                .urgency-option.selected.normal {
                    background: rgba(148, 163, 184, 0.1);
                }

                .urgency-option.selected.urgent {
                    background: rgba(249, 115, 22, 0.1);
                    border-color: rgba(249, 115, 22, 0.4);
                }

                .urgency-option.selected.express {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.4);
                }

                .urgency-label {
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: white;
                }

                /* Protetico List */
                .protetico-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .protetico-option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .protetico-option:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .protetico-option.selected {
                    background: rgba(139, 92, 246, 0.1);
                    border-color: rgba(139, 92, 246, 0.3);
                }

                .protetico-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .protetico-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                }

                .protetico-name {
                    font-weight: 500;
                    color: white;
                }

                .protetico-lab {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .specialty-tags {
                    display: flex;
                    gap: 0.25rem;
                }

                .specialty-tag {
                    padding: 0.25rem 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 0.25rem;
                    font-size: 0.6875rem;
                    color: #94a3b8;
                }

                /* Actions */
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .btn-back {
                    padding: 0.875rem 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: #94a3b8;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-back:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-next {
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, #22d3ee, #06b6d4);
                    color: #0f172a;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                }

                .btn-next:hover:not(:disabled) {
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
                    transform: translateY(-2px);
                }

                .btn-next:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    .work-types-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .urgency-options {
                        flex-direction: column;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <a href="/laboratorio" className="back-link">← Voltar para Laboratório</a>
                <h1 className="page-title">Novo Pedido de Prótese</h1>
                <p className="page-subtitle">Preencha as informações para enviar ao laboratório</p>
            </div>

            {/* Progress */}
            <div className="progress-bar">
                <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} />
                <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} />
                <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`} />
                <div className={`progress-step ${step >= 4 ? 'active' : ''}`} />
            </div>

            {/* Step 1: Patient */}
            {step === 1 && (
                <div className="form-card">
                    <h2 className="step-title">👤 Selecionar Paciente</h2>
                    <p className="step-desc">Escolha o paciente para este pedido</p>

                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar paciente por nome..."
                            value={searchPatient}
                            onChange={(e) => setSearchPatient(e.target.value)}
                        />
                    </div>

                    <div className="patient-list">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className={`patient-option ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <div className="patient-avatar">{patient.name.charAt(0)}</div>
                                <div>
                                    <div className="patient-name">{patient.name}</div>
                                    {patient.phone && <div className="patient-phone">{patient.phone}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Work Type */}
            {step === 2 && (
                <div className="form-card">
                    <h2 className="step-title">🦷 Tipo de Trabalho</h2>
                    <p className="step-desc">Selecione o tipo de prótese a ser confeccionada</p>

                    <div className="work-types-grid">
                        {workTypes.map((type) => (
                            <div
                                key={type.value}
                                className={`work-type-card ${workType === type.value ? 'selected' : ''}`}
                                onClick={() => setWorkType(type.value)}
                            >
                                <div className="work-type-icon">{type.icon}</div>
                                <div className="work-type-label">{type.label}</div>
                                <div className="work-type-desc">{type.desc}</div>
                            </div>
                        ))}
                    </div>

                    {workType === 'other' && (
                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label className="form-label">Especifique o tipo de trabalho</label>
                            <input
                                type="text"
                                className="form-input"
                                value={workTypeCustom}
                                onChange={(e) => setWorkTypeCustom(e.target.value)}
                                placeholder="Descreva o trabalho..."
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Technical Details */}
            {step === 3 && (
                <div className="form-card">
                    <h2 className="step-title">📋 Detalhes Técnicos</h2>
                    <p className="step-desc">Informe as especificações do trabalho</p>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Material</label>
                            <select className="form-select" value={material} onChange={(e) => setMaterial(e.target.value)}>
                                <option value="">Selecione...</option>
                                <option value="Porcelana">Porcelana</option>
                                <option value="Zircônia">Zircônia</option>
                                <option value="Metal">Metal</option>
                                <option value="Metalocerâmica">Metalocerâmica</option>
                                <option value="Resina">Resina</option>
                                <option value="E-max">E-max</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Cor / Escala</label>
                            <input
                                type="text"
                                className="form-input"
                                value={shade}
                                onChange={(e) => setShade(e.target.value)}
                                placeholder="Ex: A2, B1..."
                            />
                        </div>

                        <div className="form-group full">
                            <label className="form-label">Dentes (números)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={toothNumbers}
                                onChange={(e) => setToothNumbers(e.target.value)}
                                placeholder="Ex: 11, 12, 21..."
                            />
                        </div>

                        <div className="form-group full">
                            <label className="form-label">Observações</label>
                            <textarea
                                className="form-textarea"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Instruções específicas para o laboratório..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Protetico & Deadline */}
            {step === 4 && (
                <>
                    <div className="form-card">
                        <h2 className="step-title">⏰ Urgência e Prazo</h2>
                        <p className="step-desc">Defina a prioridade do pedido</p>

                        <div className="urgency-options">
                            {(['normal', 'urgent', 'express'] as const).map((urg) => (
                                <div
                                    key={urg}
                                    className={`urgency-option ${urgency === urg ? `selected ${urg}` : ''}`}
                                    onClick={() => setUrgency(urg)}
                                >
                                    <div className="urgency-label">
                                        {urg === 'normal' && '🕐 Normal'}
                                        {urg === 'urgent' && '⚡ Urgente'}
                                        {urg === 'express' && '🚀 Expresso'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label className="form-label">Data de Entrega Desejada</label>
                            <input
                                type="date"
                                className="form-input"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-card">
                        <h2 className="step-title">🏭 Selecionar Laboratório</h2>
                        <p className="step-desc">Escolha o protético responsável (opcional)</p>

                        <div className="protetico-list">
                            {proteticos.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                                    Nenhum protético cadastrado. O pedido ficará pendente.
                                </p>
                            ) : (
                                proteticos.map((prot) => (
                                    <div
                                        key={prot.id}
                                        className={`protetico-option ${selectedProtetico === prot.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedProtetico(selectedProtetico === prot.id ? '' : prot.id)}
                                    >
                                        <div className="protetico-info">
                                            <div className="protetico-avatar">{prot.name.charAt(0)}</div>
                                            <div>
                                                <div className="protetico-name">{prot.name}</div>
                                                {prot.laboratoryName && <div className="protetico-lab">{prot.laboratoryName}</div>}
                                            </div>
                                        </div>
                                        {prot.specialties?.length > 0 && (
                                            <div className="specialty-tags">
                                                {prot.specialties.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="specialty-tag">{s}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="form-actions">
                {step > 1 ? (
                    <button className="btn-back" onClick={() => setStep(step - 1)}>
                        ← Voltar
                    </button>
                ) : (
                    <div />
                )}

                {step < 4 ? (
                    <button
                        className="btn-next"
                        disabled={!canProceed()}
                        onClick={() => setStep(step + 1)}
                    >
                        Continuar →
                    </button>
                ) : (
                    <button
                        className="btn-next"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        {submitting ? 'Criando...' : '✓ Criar Pedido'}
                    </button>
                )}
            </div>
        </div>
    );
}
