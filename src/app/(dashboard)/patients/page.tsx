'use client';

import { useState, useEffect } from 'react';
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
  createdAt?: string;
}

interface FormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  notes: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [erro, setErro] = useState('');
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: '',
  });

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      if (data.pacientes) {
        setPacientes(data.pacientes);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const salvarPaciente = async () => {
    setErro('');
    if (!formData.name.trim()) {
      setErro('Nome é obrigatório');
      return;
    }
    if (!formData.phone.trim()) {
      setErro('Telefone é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar paciente');
      }

      toast.success('Paciente cadastrado com sucesso!');
      setModalAberto(false);
      resetForm();
      carregarPacientes();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar paciente');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      phone: '',
      email: '',
      birthDate: '',
      notes: '',
    });
    setErro('');
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.name?.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf?.includes(busca) ||
    p.phone?.includes(busca)
  );

  const formatarData = (data?: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const abrirNovo = () => {
    setPacienteSelecionado(null);
    resetForm();
    setModalAberto(true);
  };

  const abrirEditar = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setFormData({
      name: paciente.name || '',
      cpf: paciente.cpf || '',
      phone: paciente.phone || '',
      email: paciente.email || '',
      birthDate: paciente.birthDate ? paciente.birthDate.split('T')[0] : '',
      notes: paciente.notes || '',
    });
    setModalAberto(true);
  };

  return (
    <div className="pacientes-dark">
      <style jsx>{`
                /* Dark Liquid Glass Patients */
                .pacientes-dark {
                    min-height: 100%;
                    color: #f8fafc;
                }

                /* Ambient Glow */
                .ambient-glow {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                    z-index: 0;
                }

                .glow-1 {
                    top: -20%;
                    left: -10%;
                    width: 50%;
                    height: 50%;
                    background: rgba(6, 182, 212, 0.1);
                }

                .glow-2 {
                    bottom: -20%;
                    right: -10%;
                    width: 50%;
                    height: 50%;
                    background: rgba(59, 130, 246, 0.1);
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

                @media (min-width: 768px) {
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

                .page-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    background: linear-gradient(to right, white, #e2e8f0, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.02em;
                }

                .page-subtitle {
                    color: #64748b;
                    font-size: 1.125rem;
                    font-weight: 300;
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                /* Search */
                .search-box {
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                    pointer-events: none;
                    transition: color 0.2s;
                }

                .search-box:focus-within .search-icon {
                    color: #22d3ee;
                }

                .search-input {
                    width: 20rem;
                    height: 3rem;
                    padding-left: 3rem;
                    padding-right: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 9999px;
                    color: white;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .search-input::placeholder {
                    color: #475569;
                }

                .search-input:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.5);
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Add Button */
                .btn-novo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 3rem;
                    padding: 0 1.5rem;
                    background: linear-gradient(180deg, rgba(6, 182, 212, 1) 0%, rgba(30, 130, 180, 1) 100%);
                    color: white;
                    border: none;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 15px rgba(6, 182, 212, 0.4);
                }

                .btn-novo:hover {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 6px 20px rgba(6, 182, 212, 0.6);
                }

                /* Glass Table */
                .glass-table-container {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    position: relative;
                }

                .table-shine-top {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
                    opacity: 0.5;
                }

                .table-shine-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
                }

                .glass-table {
                    width: 100%;
                    text-align: left;
                    border-collapse: collapse;
                }

                .glass-table thead tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(255, 255, 255, 0.02);
                }

                .glass-table th {
                    padding: 1.25rem 1.5rem;
                    font-size: 0.6875rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                }

                .glass-table tbody tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .glass-table tbody tr:last-child {
                    border-bottom: none;
                }

                .glass-table tbody tr:hover {
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
                    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
                }

                .glass-table td {
                    padding: 1rem 1.5rem;
                    white-space: nowrap;
                    font-size: 0.875rem;
                }

                /* Patient Cell */
                .patient-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .avatar-wrapper {
                    position: relative;
                }

                .avatar-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: rgba(6, 182, 212, 0.3);
                    filter: blur(8px);
                    opacity: 0.2;
                    transition: opacity 0.3s;
                }

                tr:hover .avatar-glow {
                    opacity: 0.4;
                }

                .avatar {
                    position: relative;
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
                    padding: 1px;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
                }

                .avatar-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .patient-info {
                    display: flex;
                    flex-direction: column;
                }

                .patient-name {
                    font-weight: 600;
                    color: white;
                }

                .patient-cpf {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-family: monospace;
                }

                .patient-phone {
                    color: #cbd5e1;
                }

                .patient-email {
                    color: #64748b;
                    font-size: 0.8125rem;
                }

                .patient-date {
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .date-icon {
                    color: #475569;
                    font-size: 1rem;
                }

                /* Status Badge */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.6875rem;
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                }

                .status-active {
                    background: rgba(6, 182, 212, 0.1);
                    color: #67e8f9;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }

                /* Actions */
                .action-btn {
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    background: transparent;
                    border: none;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .view-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }

                .view-btn:hover {
                    background: rgba(6, 182, 212, 0.1);
                    border-color: rgba(6, 182, 212, 0.3);
                    color: #22d3ee;
                }

                /* Pagination */
                .pagination {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 0;
                    margin-top: 1rem;
                }

                .pagination-info {
                    font-size: 0.875rem;
                    color: #475569;
                }

                .pagination-info span {
                    color: white;
                    font-weight: 500;
                }

                .pagination-btns {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .page-btn {
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .page-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .page-btn.active {
                    background: rgba(6, 182, 212, 0.2);
                    color: #67e8f9;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    font-weight: 700;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
                }

                .page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Loading & Empty */
                .loading, .empty-state {
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

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.3;
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
                    max-width: 600px;
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
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .modal-body {
                    padding: 1.5rem;
                    max-height: calc(90vh - 200px);
                    overflow-y: auto;
                }

                .error-box {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                    padding: 0.875rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-group.full {
                    grid-column: 1 / -1;
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

                .form-input {
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

                .form-input:focus {
                    outline: none;
                    border-color: rgba(6, 182, 212, 0.6);
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2), inset 0 2px 10px rgba(0, 0, 0, 0.2);
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

                .btn-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .header-actions {
                        flex-wrap: wrap;
                    }
                    .search-input {
                        width: 100%;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .glass-table th:nth-child(n+3),
                    .glass-table td:nth-child(n+3) {
                        display: none;
                    }
                }
            `}</style>

      {/* Ambient Glow */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">Gerencie cadastros, histórico e agendamentos.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nome, CPF..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="btn-novo" onClick={abrirNovo}>
            <span>+</span> Novo Paciente
          </button>
        </div>
      </div>

      {/* Patients Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Carregando pacientes...
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>{busca ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}</p>
          {!busca && (
            <button className="btn-novo" onClick={abrirNovo} style={{ marginTop: '1rem' }}>
              Cadastrar primeiro paciente
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="glass-table-container">
            <div className="table-shine-top" />
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Cadastrado</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id} onClick={() => abrirEditar(paciente)}>
                    <td>
                      <div className="patient-cell">
                        <div className="avatar-wrapper">
                          <div className="avatar-glow" />
                          <div className="avatar">
                            <div className="avatar-inner">
                              {paciente.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          </div>
                        </div>
                        <div className="patient-info">
                          <span className="patient-name">{paciente.name}</span>
                          <span className="patient-cpf">{paciente.cpf || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="patient-phone">{paciente.phone}</span>
                    </td>
                    <td>
                      <span className="patient-email">{paciente.email || '-'}</span>
                    </td>
                    <td>
                      <span className="patient-date">
                        <span className="date-icon">📅</span>
                        {formatarData(paciente.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-active">Ativo</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/patients/${paciente.id}`}
                        className="view-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver perfil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-shine-bottom" />
          </div>

          {/* Pagination */}
          <div className="pagination">
            <p className="pagination-info">
              Mostrando <span>1</span> a <span>{pacientesFiltrados.length}</span> de <span>{pacientes.length}</span> pacientes
            </p>
            <div className="pagination-btns">
              <button className="page-btn" disabled>←</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">→</button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <div className={`modal-overlay ${modalAberto ? 'active' : ''}`} onClick={() => setModalAberto(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">
              {pacienteSelecionado ? 'Editar Paciente' : 'Novo Paciente'}
            </h3>
            <button className="modal-close" onClick={() => setModalAberto(false)}>×</button>
          </div>
          <div className="modal-body">
            {erro && <div className="error-box">⚠️ {erro}</div>}

            <div className="form-row">
              <div className="form-group full">
                <label className="form-label">
                  Nome Completo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Nome do paciente"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-input"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-input"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Telefone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label className="form-label">Observações</label>
                <textarea
                  name="notes"
                  className="form-input"
                  rows={3}
                  placeholder="Observações sobre o paciente..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={() => setModalAberto(false)}>
              Cancelar
            </button>
            <button className="btn-salvar" onClick={salvarPaciente} disabled={saving}>
              {saving ? (
                <>
                  <div className="btn-spinner" />
                  Salvando...
                </>
              ) : (
                pacienteSelecionado ? 'Salvar Alterações' : 'Cadastrar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
