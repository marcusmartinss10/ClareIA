'use client';

import { useState, useEffect } from 'react';

interface Assinatura {
  id: string;
  plano: string;
  preco: number;
  status: 'ACTIVE' | 'OVERDUE' | 'CANCELLED';
  dataInicio: string;
  dataRenovacao: string;
  recursos: string[];
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
}

export default function SettingsPage() {
  const [tab, setTab] = useState<'perfil' | 'clinica' | 'usuarios' | 'seguranca' | 'assinatura'>('perfil');
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [nome, setNome] = useState('Dr. Sarah Smith');
  const [email, setEmail] = useState('sarah.smith@clinicademo.com');
  const [bio, setBio] = useState('Especialista em alinhadores transparentes e procedimentos de odontologia estética.');
  const [notificacoes, setNotificacoes] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setTimeout(() => {
      setAssinatura({
        id: 'sub-1',
        plano: 'Plano Profissional',
        preco: 299.90,
        status: 'ACTIVE',
        dataInicio: '2026-01-01',
        dataRenovacao: '2026-02-01',
        recursos: ['Até 10 usuários', 'Agenda ilimitada', 'CRM de pacientes', 'Prontuário digital', 'Relatórios avançados', 'Suporte prioritário'],
      });

      setUsuarios([
        { id: '1', nome: 'Administrador', email: 'admin@clinicademo.com', perfil: 'ADMIN' },
        { id: '2', nome: 'Dr. João Silva', email: 'dentista@clinicademo.com', perfil: 'DENTIST' },
        { id: '3', nome: 'Maria Santos', email: 'recepcao@clinicademo.com', perfil: 'RECEPTIONIST' },
      ]);

      setLoading(false);
    }, 300);
  };

  const getPerfilLabel = (perfil: string) => {
    const labels: Record<string, string> = { ADMIN: 'Administrador', DENTIST: 'Dentista', RECEPTIONIST: 'Recepcionista' };
    return labels[perfil] || perfil;
  };

  const menuItems = [
    { id: 'perfil', icon: '👤', label: 'Perfil' },
    { id: 'clinica', icon: '🏥', label: 'Clínica' },
    { id: 'usuarios', icon: '👥', label: 'Usuários' },
    { id: 'seguranca', icon: '🔒', label: 'Segurança' },
    { id: 'assinatura', icon: '💳', label: 'Assinatura' },
  ];

  return (
    <div className="settings-dark">
      <style jsx>{`
                /* Dark Liquid Glass Settings */
                .settings-dark {
                    min-height: 100%;
                    color: #f8fafc;
                    position: relative;
                }

                /* Ambient Gradient */
                .ambient-gradient {
                    position: fixed;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
                                radial-gradient(circle at 15% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Main Panel */
                .settings-panel {
                    background: rgba(22, 30, 35, 0.65);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    display: flex;
                    min-height: calc(100vh - 180px);
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    position: relative;
                    z-index: 10;
                }

                /* Sidebar */
                .settings-sidebar {
                    width: 16rem;
                    background: rgba(0, 0, 0, 0.1);
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .sidebar-header {
                    margin-bottom: 2rem;
                }

                .sidebar-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .sidebar-subtitle {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .nav-item.active {
                    background: rgba(6, 182, 212, 0.2);
                    border-color: rgba(6, 182, 212, 0.1);
                    color: white;
                }

                .nav-item.active .nav-icon {
                    color: #22d3ee;
                }

                .nav-icon {
                    font-size: 1.25rem;
                    transition: transform 0.2s;
                }

                .nav-item:hover .nav-icon {
                    transform: scale(1.1);
                }

                .sidebar-footer {
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #f87171;
                    cursor: pointer;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    width: 100%;
                }

                .logout-btn:hover {
                    color: #ef4444;
                }

                /* Content */
                .settings-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow-y: auto;
                }

                .content-header-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 8rem;
                    background: linear-gradient(to bottom, rgba(6, 182, 212, 0.05), transparent);
                    pointer-events: none;
                }

                .content-header {
                    padding: 2rem;
                    position: relative;
                }

                .content-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .content-subtitle {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                /* Profile Card */
                .profile-card {
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    backdrop-filter: blur(12px);
                }

                .profile-avatar {
                    position: relative;
                    width: 5rem;
                    height: 5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: white;
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
                    border: 3px solid rgba(255, 255, 255, 0.1);
                }

                .avatar-edit {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 1.5rem;
                    height: 1.5rem;
                    background: #22d3ee;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .profile-info h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                }

                .profile-badges {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }

                .role-badge {
                    padding: 0.25rem 0.5rem;
                    background: rgba(6, 182, 212, 0.1);
                    color: #22d3ee;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    border-radius: 9999px;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }

                .admin-badge {
                    font-size: 0.6875rem;
                    color: #64748b;
                }

                /* Form Content */
                .form-content {
                    padding: 2rem;
                    max-width: 40rem;
                }

                .form-section {
                    margin-bottom: 2rem;
                }

                .section-label {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }

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

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #475569;
                    font-size: 1.25rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    padding-left: 2.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.2s;
                }

                .form-input::placeholder {
                    color: #475569;
                }

                .form-input:focus {
                    outline: none;
                    background: rgba(0, 0, 0, 0.4);
                    border-color: rgba(6, 182, 212, 0.5);
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
                }

                textarea.form-input {
                    padding-left: 0.75rem;
                    resize: none;
                }

                .form-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.05);
                    margin: 2rem 0;
                }

                /* Toggle Items */
                .toggle-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    margin-bottom: 0.75rem;
                    transition: background 0.2s;
                }

                .toggle-item:hover {
                    background: rgba(255, 255, 255, 0.04);
                }

                .toggle-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .toggle-icon {
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    font-size: 1.25rem;
                }

                .toggle-icon.blue {
                    background: rgba(59, 130, 246, 0.1);
                }

                .toggle-icon.purple {
                    background: rgba(139, 92, 246, 0.1);
                }

                .toggle-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: white;
                }

                .toggle-desc {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .toggle-switch {
                    position: relative;
                    width: 2.75rem;
                    height: 1.5rem;
                    background: #334155;
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .toggle-switch.active {
                    background: #22d3ee;
                }

                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 1.25rem;
                    height: 1.25rem;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.2s;
                }

                .toggle-switch.active::after {
                    transform: translateX(1.25rem);
                }

                /* Action Buttons */
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    padding-top: 1rem;
                }

                .btn-cancel {
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .btn-cancel:hover {
                    color: white;
                }

                .btn-save {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(to right, #22d3ee, #06b6d4);
                    color: #0f172a;
                    font-size: 0.875rem;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
                }

                .btn-save:hover {
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
                    transform: translateY(-1px);
                }

                /* Users List */
                .users-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .user-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                    transition: all 0.2s;
                }

                .user-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(6, 182, 212, 0.3);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-avatar {
                    width: 2.75rem;
                    height: 2.75rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }

                .user-name {
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.125rem;
                }

                .user-email {
                    font-size: 0.8125rem;
                    color: #64748b;
                }

                .user-role {
                    padding: 0.375rem 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    color: #94a3b8;
                    font-size: 0.6875rem;
                    font-weight: 500;
                    border-radius: 9999px;
                }

                .btn-add-user {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.8), rgba(30, 130, 180, 0.8));
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
                }

                .btn-add-user:hover {
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
                    transform: translateY(-1px);
                }

                /* Subscription Card */
                .subscription-card {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1));
                    border: 1px solid rgba(6, 182, 212, 0.2);
                    border-radius: 1rem;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .sub-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }

                .plan-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .plan-price {
                    font-size: 0.875rem;
                    color: #94a3b8;
                }

                .status-active {
                    padding: 0.375rem 0.75rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 9999px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #cbd5e1;
                }

                .feature-check {
                    color: #22d3ee;
                }

                .sub-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .btn-upgrade {
                    padding: 0.75rem 1.25rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-upgrade:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
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
                    .settings-panel {
                        flex-direction: column;
                    }
                    .settings-sidebar {
                        width: 100%;
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    .form-grid, .features-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

      {/* Ambient Gradient */}
      <div className="ambient-gradient" />

      {/* Main Panel */}
      <div className="settings-panel">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <div>
            <div className="sidebar-header">
              <h1 className="sidebar-title">Configurações</h1>
              <p className="sidebar-subtitle">Gerencie seu espaço de trabalho</p>
            </div>
            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item ${tab === item.id ? 'active' : ''}`}
                  onClick={() => setTab(item.id as any)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>
          <div className="sidebar-footer">
            <button className="logout-btn">
              🚪 Sair da conta
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="settings-content">
          <div className="content-header-bg" />

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              Carregando...
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {tab === 'perfil' && (
                <>
                  <div className="content-header">
                    <h2 className="content-title">Configurações do Perfil</h2>
                    <p className="content-subtitle">Gerencie suas informações pessoais e preferências.</p>

                    <div className="profile-card">
                      <div className="profile-avatar">
                        👨‍⚕️
                        <span className="avatar-edit">✏️</span>
                      </div>
                      <div className="profile-info">
                        <h3>{nome}</h3>
                        <div className="profile-badges">
                          <span className="role-badge">Ortodontista Líder</span>
                          <span className="admin-badge">Administrador</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-content">
                    <div className="form-section">
                      <h4 className="section-label">Informações Pessoais</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Nome Completo</label>
                          <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input type="text" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">E-mail</label>
                          <div className="input-wrapper">
                            <span className="input-icon">✉️</span>
                            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group full" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Bio</label>
                        <textarea className="form-input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-divider" />

                    <div className="form-section">
                      <h4 className="section-label">Preferências</h4>
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <div className="toggle-icon blue">🔔</div>
                          <div>
                            <div className="toggle-label">Notificações de Pacientes</div>
                            <div className="toggle-desc">Receba notificações quando pacientes chegarem</div>
                          </div>
                        </div>
                        <div className={`toggle-switch ${notificacoes ? 'active' : ''}`} onClick={() => setNotificacoes(!notificacoes)} />
                      </div>
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <div className="toggle-icon purple">🌙</div>
                          <div>
                            <div className="toggle-label">Modo Escuro Padrão</div>
                            <div className="toggle-desc">Sempre iniciar no modo escuro</div>
                          </div>
                        </div>
                        <div className={`toggle-switch ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(!darkMode)} />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button className="btn-cancel">Cancelar</button>
                      <button className="btn-save">Salvar Alterações</button>
                    </div>
                  </div>
                </>
              )}

              {/* Clinic Tab */}
              {tab === 'clinica' && (
                <>
                  <div className="content-header">
                    <h2 className="content-title">Dados da Clínica</h2>
                    <p className="content-subtitle">Configure as informações da sua clínica.</p>
                  </div>
                  <div className="form-content">
                    <div className="form-grid">
                      <div className="form-group full">
                        <label className="form-label">Nome da Clínica</label>
                        <input type="text" className="form-input" style={{ paddingLeft: '0.75rem' }} defaultValue="Clínica Demonstração" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CNPJ</label>
                        <input type="text" className="form-input" style={{ paddingLeft: '0.75rem' }} defaultValue="00.000.000/0001-00" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Telefone</label>
                        <input type="tel" className="form-input" style={{ paddingLeft: '0.75rem' }} defaultValue="(11) 99999-9999" />
                      </div>
                      <div className="form-group full">
                        <label className="form-label">E-mail</label>
                        <input type="email" className="form-input" style={{ paddingLeft: '0.75rem' }} defaultValue="contato@clinicademo.com" />
                      </div>
                      <div className="form-group full">
                        <label className="form-label">Endereço</label>
                        <input type="text" className="form-input" style={{ paddingLeft: '0.75rem' }} defaultValue="Rua Exemplo, 123 - Centro, São Paulo - SP" />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-cancel">Cancelar</button>
                      <button className="btn-save">Salvar Alterações</button>
                    </div>
                  </div>
                </>
              )}

              {/* Users Tab */}
              {tab === 'usuarios' && (
                <>
                  <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 className="content-title">Usuários ({usuarios.length})</h2>
                      <p className="content-subtitle">Gerencie os usuários da sua clínica.</p>
                    </div>
                    <button className="btn-add-user">+ Novo Usuário</button>
                  </div>
                  <div className="form-content">
                    <div className="users-list">
                      {usuarios.map((usuario) => (
                        <div key={usuario.id} className="user-card">
                          <div className="user-info">
                            <div className="user-avatar">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="user-name">{usuario.nome}</div>
                              <div className="user-email">{usuario.email}</div>
                            </div>
                          </div>
                          <span className="user-role">{getPerfilLabel(usuario.perfil)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Security Tab */}
              {tab === 'seguranca' && (
                <>
                  <div className="content-header">
                    <h2 className="content-title">Segurança</h2>
                    <p className="content-subtitle">Configure opções de segurança da sua conta.</p>
                  </div>
                  <div className="form-content">
                    <div className="form-section">
                      <h4 className="section-label">Alterar Senha</h4>
                      <div className="form-grid">
                        <div className="form-group full">
                          <label className="form-label">Senha Atual</label>
                          <input type="password" className="form-input" style={{ paddingLeft: '0.75rem' }} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Nova Senha</label>
                          <input type="password" className="form-input" style={{ paddingLeft: '0.75rem' }} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirmar Senha</label>
                          <input type="password" className="form-input" style={{ paddingLeft: '0.75rem' }} placeholder="••••••••" />
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-cancel">Cancelar</button>
                      <button className="btn-save">Alterar Senha</button>
                    </div>
                  </div>
                </>
              )}

              {/* Subscription Tab */}
              {tab === 'assinatura' && assinatura && (
                <>
                  <div className="content-header">
                    <h2 className="content-title">Assinatura</h2>
                    <p className="content-subtitle">Gerencie seu plano e faturamento.</p>
                  </div>
                  <div className="form-content">
                    <div className="subscription-card">
                      <div className="sub-header">
                        <div>
                          <div className="plan-name">{assinatura.plano}</div>
                          <div className="plan-price">R$ {assinatura.preco.toFixed(2).replace('.', ',')} / mês</div>
                        </div>
                        <span className="status-active">Ativa</span>
                      </div>
                      <div className="features-grid">
                        {assinatura.recursos.map((recurso, index) => (
                          <div key={index} className="feature-item">
                            <span className="feature-check">✓</span>
                            {recurso}
                          </div>
                        ))}
                      </div>
                      <div className="sub-footer">
                        <span>Renova em: {new Date(assinatura.dataRenovacao).toLocaleDateString('pt-BR')}</span>
                        <button className="btn-upgrade">Fazer Upgrade</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
