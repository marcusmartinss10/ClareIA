'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close on click outside
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        setLoading(true);
        try {
            await fetch('/api/notifications', { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
        setLoading(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '🔴';
            default: return 'ℹ️';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'Agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                className={`topbar-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔
                {unreadCount > 0 && <span className="notification-dot" />}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <style jsx>{`
                        .topbar-btn.active {
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                        }
                        
                        .notifications-dropdown {
                            position: absolute;
                            top: 120%;
                            right: 0;
                            width: 380px;
                            background: rgba(15, 23, 42, 0.95);
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 1rem;
                            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                            overflow: hidden;
                            z-index: 1000;
                            animation: slideDown 0.2s ease-out;
                        }

                        @keyframes slideDown {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }

                        .dropdown-header {
                            padding: 1rem;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            background: rgba(0, 0, 0, 0.2);
                        }

                        .dropdown-title {
                            font-weight: 700;
                            font-size: 0.875rem;
                            color: white;
                        }

                        .mark-read-btn {
                            font-size: 0.75rem;
                            color: #22d3ee;
                            background: transparent;
                            border: none;
                            cursor: pointer;
                            transition: color 0.2s;
                        }

                        .mark-read-btn:hover {
                            color: #67e8f9;
                            text-decoration: underline;
                        }

                        .notifications-list {
                            max-height: 400px;
                            overflow-y: auto;
                        }

                        .notification-item {
                            padding: 1rem;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                            display: flex;
                            gap: 0.75rem;
                            transition: background 0.2s;
                            cursor: pointer;
                        }

                        .notification-item:last-child {
                            border-bottom: none;
                        }

                        .notification-item:hover {
                            background: rgba(255, 255, 255, 0.05);
                        }

                        .notification-item.unread {
                            background: rgba(6, 182, 212, 0.05);
                        }

                        .notification-icon {
                            font-size: 1.25rem;
                            flex-shrink: 0;
                            padding-top: 0.125rem;
                        }

                        .notification-content {
                            flex: 1;
                        }

                        .notification-title {
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: white;
                            margin-bottom: 0.125rem;
                        }
                        
                        .notification-message {
                            font-size: 0.8125rem;
                            color: #94a3b8;
                            line-height: 1.4;
                            margin-bottom: 0.375rem;
                        }

                        .notification-time {
                            font-size: 0.6875rem;
                            color: #64748b;
                        }

                        .empty-state {
                            padding: 2rem;
                            text-align: center;
                            color: #64748b;
                            font-size: 0.875rem;
                        }
                     `}</style>

                    <div className="dropdown-header">
                        <span className="dropdown-title">Notificações {unreadCount > 0 ? `(${unreadCount})` : ''}</span>
                        {unreadCount > 0 && (
                            <button
                                className="mark-read-btn"
                                onClick={markAllAsRead}
                                disabled={loading}
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                Nenhuma notificação por enquanto
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <span className="notification-icon">{getIcon(notification.type)}</span>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{formatDate(notification.createdAt)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
