'use client';

import { useState, useEffect } from 'react';
import { inviteMember, removeMember } from '@/actions/team';

// Types
type Role = 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
interface Member {
    id: string;
    user_id: string;
    role: Role;
    full_name: string;
    email: string;
    avatar_url?: string;
    status: 'active' | 'invited';
    last_access?: string;
}

export default function TeamSettingsPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    // Invite Form State (inline, not modal)
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'DENTIST' | 'RECEPTIONIST'>('DENTIST');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/organization/members');
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members);
            }
        } catch (error) {
            console.error('Failed to fetch members', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);
        setInviteMessage(null);

        const result = await inviteMember(inviteEmail, inviteRole);

        if (result.success) {
            setInviteMessage({ type: 'success', text: result.message! });
            setInviteEmail('');
            fetchMembers();
            setTimeout(() => setInviteMessage(null), 3000);
        } else {
            setInviteMessage({ type: 'error', text: result.error! });
        }
        setInviteLoading(false);
    };

    const handleRemove = async (userId: string) => {
        if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;

        const result = await removeMember(userId);
        if (result.success) {
            fetchMembers();
        } else {
            alert(result.error);
        }
    };

    const getRoleLabel = (role: Role) => {
        const labels: Record<Role, { text: string; class: string }> = {
            ADMIN: { text: 'Administrador', class: 'text-primary bg-primary/10' },
            DENTIST: { text: 'Cirurgião Dentista', class: 'text-primary bg-primary/10' },
            RECEPTIONIST: { text: 'Recepcionista', class: 'text-white/40 bg-white/5' },
        };
        return labels[role] || labels.DENTIST;
    };

    return (
        <div className="min-h-screen">
            <main className="px-4 py-10 lg:px-12">
                <div className="max-w-[1000px] mx-auto space-y-8">
                    {/* Page Heading */}
                    <div className="flex flex-wrap items-end justify-between gap-6 px-4">
                        <div className="space-y-1">
                            <h1 className="text-white text-4xl lg:text-5xl font-black tracking-tight">Gestão de Equipe</h1>
                            <p className="text-primary/80 text-lg font-medium flex items-center gap-2">
                                <span className="size-2 bg-primary rounded-full animate-pulse" />
                                {loading ? 'Carregando...' : `${members.length} membro${members.length !== 1 ? 's' : ''} ativo${members.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel hover:bg-white/10 text-white font-bold text-sm transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Exportar Relatório
                        </button>
                    </div>

                    {/* Invite Section (Glass Panel) */}
                    <section className="glass-panel rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                        {/* Decorative Icon */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15 12c3.31 0 6 2.69 6 6v1h-4v-1c0-1.66-1.34-3-3-3s-3 1.34-3 3v1H7v-1c0-3.31 2.69-6 6-6zm0-2c1.93 0 3.5-1.57 3.5-3.5S16.93 3 15 3 11.5 4.57 11.5 6.5 13.07 10 15 10zm-6 0c1.93 0 3.5-1.57 3.5-3.5S10.93 3 9 3 5.5 4.57 5.5 6.5 7.07 10 9 10z" />
                            </svg>
                        </div>

                        <form onSubmit={handleInvite} className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Convidar Novo Membro</h2>
                                <p className="text-white/50">Expanda sua clínica adicionando novos profissionais de saúde ou suporte administrativo.</p>
                            </div>

                            {/* Message */}
                            {inviteMessage && (
                                <div className={`p-4 rounded-xl text-center font-medium ${inviteMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    {inviteMessage.text}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Role Selection */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-white/70 ml-2 uppercase tracking-widest">Função do Profissional</label>
                                    <div className="flex h-14 p-1.5 glass-input rounded-full">
                                        <label className={`flex-1 flex items-center justify-center cursor-pointer rounded-full transition-all font-bold ${inviteRole === 'DENTIST' ? 'bg-primary text-white' : 'text-white/40 hover:text-white/60'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="DENTIST"
                                                checked={inviteRole === 'DENTIST'}
                                                onChange={() => setInviteRole('DENTIST')}
                                                className="hidden"
                                            />
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                Dentista
                                            </span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center cursor-pointer rounded-full transition-all font-bold ${inviteRole === 'RECEPTIONIST' ? 'bg-primary text-white' : 'text-white/40 hover:text-white/60'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="RECEPTIONIST"
                                                checked={inviteRole === 'RECEPTIONIST'}
                                                onChange={() => setInviteRole('RECEPTIONIST')}
                                                className="hidden"
                                            />
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Recepcionista
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-white/70 ml-2 uppercase tracking-widest">E-mail de Acesso</label>
                                    <div className="relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <input
                                            type="email"
                                            required
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="nome@exemplo.com.br"
                                            className="glass-input w-full h-14 pl-12 pr-4 rounded-full text-white placeholder:text-white/20 focus:border-primary focus:shadow-[0_0_15px_rgba(13,185,242,0.3)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInviteEmail('');
                                        setInviteMessage(null);
                                    }}
                                    className="w-full sm:w-auto px-8 py-3 rounded-full text-white/60 font-bold hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteLoading}
                                    className="w-full sm:w-auto px-10 py-4 liquid-button rounded-full text-white font-black tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    {inviteLoading ? 'Enviando...' : 'Enviar Convite'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Team List Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white/80 px-4">Membros Atuais</h3>
                        <div className="grid gap-3">
                            {loading ? (
                                <div className="glass-panel p-8 rounded-2xl text-center text-white/40">
                                    <div className="animate-pulse flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10" />
                                        <div className="h-4 w-48 bg-white/10 rounded" />
                                    </div>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="glass-panel p-8 rounded-2xl text-center text-white/40">
                                    <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="font-medium">Nenhum membro na equipe ainda</p>
                                    <p className="text-sm mt-1">Use o formulário acima para convidar seu primeiro membro.</p>
                                </div>
                            ) : (
                                members.map((member, index) => {
                                    const roleInfo = getRoleLabel(member.role);
                                    const isAdmin = member.role === 'ADMIN';
                                    const isPending = member.status === 'invited';

                                    return (
                                        <div
                                            key={member.user_id}
                                            className={`glass-panel flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group ${isAdmin ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-white/10'} ${isPending ? 'opacity-70' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className="size-12 rounded-full glass-panel flex items-center justify-center p-0.5 overflow-hidden">
                                                    {member.avatar_url ? (
                                                        <img
                                                            src={member.avatar_url}
                                                            alt={member.full_name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : isPending ? (
                                                        <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    ) : (
                                                        <span className="text-white font-bold text-lg">
                                                            {member.full_name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div>
                                                    <p className={`font-bold group-hover:text-primary transition-colors ${isPending ? 'text-white/50 italic' : 'text-white'}`}>
                                                        {isPending ? member.email : member.full_name || 'Sem nome'}
                                                    </p>
                                                    {isPending ? (
                                                        <span className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Convite Pendente
                                                        </span>
                                                    ) : (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${roleInfo.class}`}>
                                                            {roleInfo.text}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-4">
                                                {!isAdmin && (
                                                    isPending ? (
                                                        <>
                                                            <button className="px-4 py-2 rounded-full glass-panel text-xs font-bold text-white/40 hover:text-white transition-all">
                                                                Reenviar
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemove(member.user_id)}
                                                                className="size-10 flex items-center justify-center rounded-full glass-panel text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRemove(member.user_id)}
                                                            className="size-10 flex items-center justify-center rounded-full glass-panel hover:border-primary transition-colors text-white/40 hover:text-red-400"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
