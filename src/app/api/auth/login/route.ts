import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { database } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuário por email
        const user = await database.users.findByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 401 }
            );
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Senha incorreta' },
                { status: 401 }
            );
        }

        // Verificar assinatura da clínica
        const subscription = await database.subscriptions.findByClinic(user.clinicId);

        if (!subscription) {
            return NextResponse.json(
                { error: 'Clínica sem assinatura. Entre em contato com o suporte.' },
                { status: 403 }
            );
        }

        if (subscription.status === 'CANCELLED') {
            return NextResponse.json(
                { error: 'Assinatura cancelada. Entre em contato para reativar.' },
                { status: 403 }
            );
        }

        // Buscar clínica
        const clinic = await database.clinics.findById(user.clinicId);

        // Retornar dados do usuário (sem senha)
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId,
                clinicName: clinic?.name,
                subscriptionStatus: subscription.status,
            },
        });

        // Definir cookie de sessão simples
        response.cookies.set('session', JSON.stringify({
            userId: user.id,
            clinicId: user.clinicId,
            role: user.role,
            subscriptionStatus: subscription.status,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 horas
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
