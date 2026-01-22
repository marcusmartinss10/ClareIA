import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { database } from '@/lib/db';
import type { SessionUser } from '@/types';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email e senha são obrigatórios');
                }

                const user = await database.users.findByEmail(credentials.email);

                if (!user) {
                    throw new Error('Usuário não encontrado');
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isValid) {
                    throw new Error('Senha incorreta');
                }

                // Check subscription status
                const subscription = await database.subscriptions.findByClinic(user.clinicId);

                if (!subscription) {
                    throw new Error('Clínica sem assinatura ativa');
                }

                if (subscription.status === 'CANCELLED') {
                    throw new Error('Assinatura cancelada. Entre em contato com o suporte.');
                }

                return {
                    id: user.id,
                    clinicId: user.clinicId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    subscriptionStatus: subscription.status,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.clinicId = (user as SessionUser).clinicId;
                token.role = (user as SessionUser).role;
                token.subscriptionStatus = (user as SessionUser).subscriptionStatus;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as SessionUser).id = token.id as string;
                (session.user as SessionUser).clinicId = token.clinicId as string;
                (session.user as SessionUser).role = token.role as SessionUser['role'];
                (session.user as SessionUser).subscriptionStatus = token.subscriptionStatus as SessionUser['subscriptionStatus'];
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET || 'clareia-secret-key-change-in-production',
};

// Helper to check if user has permission
export function hasPermission(
    userRole: SessionUser['role'],
    requiredRoles: SessionUser['role'][]
): boolean {
    return requiredRoles.includes(userRole);
}

// Helper to check subscription status
export function isSubscriptionActive(status: SessionUser['subscriptionStatus']): boolean {
    return status === 'ACTIVE';
}

// Helper to check if operation is allowed (for OVERDUE status)
export function canPerformOperation(status: SessionUser['subscriptionStatus']): boolean {
    return status === 'ACTIVE';
}

// Tipos de sessão para API routes
export interface Session {
    userId: string;
    id: string;
    clinicId: string;
    role: 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
    subscriptionStatus: 'ACTIVE' | 'OVERDUE' | 'CANCELLED';
}

// Obter sessão a partir de cookies (for API routes)
export async function getSession(): Promise<Session | null> {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        return null;
    }

    try {
        const sessionData = JSON.parse(sessionCookie.value);
        return {
            ...sessionData,
            id: sessionData.userId,
        };
    } catch {
        return null;
    }
}
