/**
 * API: Protéticos (Prosthetic Technicians)
 * GET /api/proteticos - List protéticos for clinic
 * POST /api/proteticos - Create new protético
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkFeatureAccess } from '@/lib/plans';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const hasAccess = await checkFeatureAccess(session.clinicId, 'prosthetics');
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Seu plano não inclui acesso ao módulo de Protéticos. Faça upgrade para acessar.' },
                { status: 403 }
            );
        }

        const proteticos = await database.proteticos.findByClinic(session.clinicId);

        // Remove password hash from response
        const safeProteticos = proteticos.map((p: any) => {
            const { passwordHash, ...safe } = p;
            return safe;
        });

        return NextResponse.json({ proteticos: safeProteticos });
    } catch (error) {
        console.error('Error fetching proteticos:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar protéticos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const hasAccess = await checkFeatureAccess(session.clinicId, 'prosthetics');
        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Seu plano não inclui acesso ao módulo de Protéticos. Faça upgrade para acessar.' },
                { status: 403 }
            );
        }

        if (session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Apenas administradores podem cadastrar protéticos' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name,
            laboratoryName,
            email,
            phone,
            specialties = [],
            password,
        } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nome, email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await database.proteticos.findByEmail(email);
        if (existing) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const protetico = await database.proteticos.create({
            clinicId: session.clinicId,
            name,
            laboratoryName,
            email,
            phone,
            specialties,
            passwordHash,
            isActive: true,
        });

        // Remove password hash from response
        const { passwordHash: _, ...safeProtetico } = protetico;

        return NextResponse.json({ protetico: safeProtetico }, { status: 201 });
    } catch (error) {
        console.error('Error creating protetico:', error);
        return NextResponse.json(
            { error: 'Erro ao cadastrar protético' },
            { status: 500 }
        );
    }
}
