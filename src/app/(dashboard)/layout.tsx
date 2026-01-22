'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
  clinicName?: string;
}

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST']
  },
  {
    href: '/agenda',
    label: 'Agenda',
    icon: '📅',
    roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST']
  },
  {
    href: '/patients',
    label: 'Pacientes',
    icon: '👥',
    roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST']
  },
  {
    href: '/consultation',
    label: 'Atendimentos',
    icon: '🦷',
    roles: ['ADMIN', 'DENTIST']
  },
  {
    href: '/laboratorio',
    label: 'Laboratório',
    icon: '🏭',
    roles: ['ADMIN', 'DENTIST']
  },
  {
    href: '/reports',
    label: 'Relatórios',
    icon: '📈',
    roles: ['ADMIN']
  },
  {
    href: '/settings',
    label: 'Configurações',
    icon: '⚙️',
    roles: ['ADMIN']
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredMenuItems = menuItems.filter(
    item => !user || item.roles.includes(user.role)
  );

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      DENTIST: 'Dentista',
      RECEPTIONIST: 'Recepcionista',
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #020617;
          }
          .loading-content {
            text-align: center;
          }
          .loading-logo {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(6, 182, 212, 0.2);
            border-top-color: #22d3ee;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-content">
          <div className="loading-logo">ClareIA</div>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <style jsx>{`
        /* Dark Liquid Glass Layout */
        .dashboard-layout {
          min-height: 100vh;
          background: #020617;
          color: #f8fafc;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          height: 100vh;
          background: rgba(5, 10, 20, 0.6);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.3s ease;
          box-shadow: 4px 0 30px rgba(0, 0, 0, 0.5);
        }

        .sidebar-header {
          height: 6rem;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          cursor: pointer;
        }

        .logo-wrapper:hover .logo-icon {
          transform: scale(1.1);
        }

        .logo-wrapper:hover .logo-text {
          color: #22d3ee;
        }

        .logo-icon {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }

        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .logo-subtitle {
          font-size: 0.625rem;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 0.125rem;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 1.25rem;
          overflow-y: auto;
        }

        .nav-section-label {
          padding: 0 0.75rem;
          font-size: 0.625rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .nav-section-label:first-child {
          margin-top: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-radius: 1rem;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-bottom: 0.25rem;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.3);
          color: #22d3ee;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
          font-weight: 600;
        }

        .nav-icon {
          font-size: 1.25rem;
          opacity: 0.7;
          transition: opacity 0.2s, color 0.2s;
        }

        .nav-item:hover .nav-icon,
        .nav-item.active .nav-icon {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 1rem;
          background: rgba(10, 15, 30, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .user-card:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-logout {
          width: 100%;
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.5);
          color: #f87171;
        }

        /* Main Content */
        .main-content {
          margin-left: 280px;
          min-height: 100vh;
          background: #020617;
        }

        /* Topbar */
        .topbar {
          height: 6rem;
          background: rgba(5, 10, 20, 0.6);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.5rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: #e2e8f0;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .search-wrapper {
          position: relative;
          max-width: 28rem;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.25rem;
          pointer-events: none;
          transition: color 0.2s;
        }

        .search-wrapper:focus-within .search-icon {
          color: #22d3ee;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-input:focus {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(6, 182, 212, 0.6);
          box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.3), inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          font-size: 1.25rem;
        }

        .topbar-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          color: white;
        }

        .notification-dot {
          position: absolute;
          top: 0.75rem;
          right: 0.875rem;
          width: 0.5rem;
          height: 0.5rem;
          background: #ef4444;
          border-radius: 50%;
          border: 1px solid #020617;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .today-date {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
          display: none;
        }

        @media (min-width: 768px) {
          .today-date {
            display: block;
          }
        }

        .content-area {
          padding: 2rem;
        }

        /* Overlay for mobile */
        .overlay {
          display: none;
        }

        /* Mobile styles */
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
          }

          .menu-toggle {
            display: flex;
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 90;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
          }

          .overlay.active {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>

      {/* Overlay para mobile */}
      <div
        className={`overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <div className="logo-icon">🦷</div>
            <div className="logo-text-wrapper">
              <h1 className="logo-text">ClareIA</h1>
              <span className="logo-subtitle">Dental Suite</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Navegação</p>
          {filteredMenuItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {filteredMenuItems.length > 4 && (
            <>
              <p className="nav-section-label">Configurações</p>
              {filteredMenuItems.slice(4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user && getRoleLabel(user.role)}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar pacientes, agendamentos..."
              />
            </div>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </span>
            <button className="topbar-btn">
              🔔
              <span className="notification-dot" />
            </button>
          </div>
        </header>

        <div className="content-area">
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>
    </div>
  );
}
