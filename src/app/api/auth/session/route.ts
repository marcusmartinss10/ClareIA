import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { database } from '@/lib/db';

// Tipos de sessão
interface Session {
    userId: string;
    clinicId: string;
    role: 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';
    subscriptionStatus: 'ACTIVE' | 'OVERDUE' | 'CANCELLED';
}

// Obter sessão a partir de cookies
export async function getSession(): Promise<Session | null> {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        return null;
    }

    try {
        return JSON.parse(sessionCookie.value) as Session;
    } catch {
        return null;
    }
}

// Obter usuário da sessão
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const user = await database.users.findById(session.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        const clinic = await database.clinics.findById(user.clinicId);

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId,
                clinicName: clinic?.name,
            },
            subscriptionStatus: session.subscriptionStatus,
        });
    } catch (error) {
        console.error('Erro ao obter sessão:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
