'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { inviteMember, removeMember } from '@/actions/team';

// Types
type Role = 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
interface Member {
    id: string; // This is the connection ID (organization_members.id) or user_id, depending on fetch
    user_id: string;
    role: Role;
    full_name: string;
    email: string;
    avatar_url?: string;
    status: 'active' | 'invited';
}

export default function TeamSettingsPage() {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Invite Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<Role>('DENTIST');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/organization/members'); // We need to create this API or use Server Action to list
            // For now, let's assume we'll create a simple API route for listing, or we could use the supabase client directly here if we wanted.
            // But let's build the API route next. For now, I'll mock the fetch ensuring the UI works.

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
            fetchMembers(); // Refresh list
            setTimeout(() => {
                setIsInviteModalOpen(false);
                setInviteMessage(null);
            }, 2000);
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

    const getRoleBadge = (role: Role) => {
        const styles = {
            ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            DENTIST: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            RECEPTIONIST: 'bg-green-500/10 text-green-400 border-green-500/20',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[role]}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <style jsx global>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        .glass-input {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
        }
        .glass-input:focus {
            border-color: #22d3ee;
            outline: none;
        }
      `}</style>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Equipe</h1>
                    <p className="text-slate-400">Gerencie os membros da sua clínica</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                >
                    + Convidar Membro
                </button>
            </div>

            {/* Members List */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">Membro</th>
                            <th className="p-4 font-semibold">Cargo</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Carregando...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum membro encontrado.</td></tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.user_id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    member.full_name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{member.full_name || 'Sem nome'}</div>
                                                <div className="text-slate-500 text-sm">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getRoleBadge(member.role)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <span className="text-slate-300 text-sm capitalize">{member.status === 'active' ? 'Ativo' : 'Pendente'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleRemove(member.user_id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)} />
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 relative z-10 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold text-white mb-1">Convidar Membro</h2>
                        <p className="text-slate-400 text-sm mb-6">Envie um convite por email para adicionar à sua equipe.</p>

                        <form onSubmit={handleInvite} className="flex flex-col gap-4">
                            {inviteMessage && (
                                <div className={`p-3 rounded-lg text-sm text-center ${inviteMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {inviteMessage.text}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="exemplo@clareia.com"
                                    className="glass-input px-4 py-3 rounded-xl w-full"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Cargo</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setInviteRole('DENTIST')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${inviteRole === 'DENTIST'
                                                ? 'bg-cyan-500/20 border-cyan-500 text-white'
                                                : 'border-white/10 hover:bg-white/5 text-slate-400'
                                            }`}
                                    >
                                        <span className="text-xl">🦷</span>
                                        <span className="text-sm font-bold">Dentista</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInviteRole('RECEPTIONIST')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${inviteRole === 'RECEPTIONIST'
                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                : 'border-white/10 hover:bg-white/5 text-slate-400'
                                            }`}
                                    >
                                        <span className="text-xl">📋</span>
                                        <span className="text-sm font-bold">Recepcionista</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteLoading}
                                    className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {inviteLoading ? 'Enviando...' : 'Enviar Convite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
