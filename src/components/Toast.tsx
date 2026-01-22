'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="toast-container">
            <style jsx>{`
                .toast-container {
                    position: fixed;
                    top: 1.5rem;
                    right: 1.5rem;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    pointer-events: none;
                    max-width: 400px;
                }

                @media (max-width: 640px) {
                    .toast-container {
                        top: 1rem;
                        right: 1rem;
                        left: 1rem;
                        max-width: none;
                    }
                }
            `}</style>
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 200);
    };

    const getStyles = () => {
        const baseStyles = {
            success: {
                bg: 'linear-gradient(135deg, #10b981, #059669)',
                icon: '✓',
                shadow: 'rgba(16, 185, 129, 0.3)',
            },
            error: {
                bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
                icon: '✕',
                shadow: 'rgba(239, 68, 68, 0.3)',
            },
            warning: {
                bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
                icon: '⚠',
                shadow: 'rgba(245, 158, 11, 0.3)',
            },
            info: {
                bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                icon: 'ℹ',
                shadow: 'rgba(59, 130, 246, 0.3)',
            },
        };
        return baseStyles[toast.type];
    };

    const styles = getStyles();

    return (
        <div
            className={`toast-item ${isVisible ? 'visible' : ''}`}
            style={{
                background: styles.bg,
                boxShadow: `0 10px 40px ${styles.shadow}`,
            }}
        >
            <style jsx>{`
                .toast-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    border-radius: 1rem;
                    color: white;
                    pointer-events: auto;
                    opacity: 0;
                    transform: translateX(100px) scale(0.9);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    backdrop-filter: blur(8px);
                }

                .toast-item.visible {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }

                .toast-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .toast-content {
                    flex: 1;
                }

                .toast-message {
                    font-size: 0.925rem;
                    font-weight: 500;
                    line-height: 1.4;
                }

                .toast-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .toast-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                @media (max-width: 640px) {
                    .toast-item {
                        transform: translateY(-50px) scale(0.9);
                    }
                    .toast-item.visible {
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
            <div className="toast-icon">{styles.icon}</div>
            <div className="toast-content">
                <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={handleRemove}>×</button>
        </div>
    );
}
