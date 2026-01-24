/**
 * API: Prosthetic Orders
 * GET /api/prosthetic-orders - List orders for clinic
 * POST /api/prosthetic-orders - Create new order
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkFeatureAccess } from '@/lib/plans';

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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const dentistId = searchParams.get('dentistId') || undefined;
        const laboratoryId = searchParams.get('laboratoryId') || searchParams.get('proteticoId') || undefined;

        const orders = await database.prostheticRequests.findByClinic(
            session.clinicId,
            { status, dentistId, laboratoryId }
        );

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching prosthetic orders:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar pedidos' },
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

        if (session.role !== 'ADMIN' && session.role !== 'DENTIST') {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const body = await request.json();

        const {
            patientId,
            proteticoId,
            laboratoryId,
            workType,
            workTypeCustom,
            material,
            shade,
            toothNumbers,
            observations,
            urgency = 'normal',
            deadline,
        } = body;

        if (!patientId || !workType) {
            return NextResponse.json(
                { error: 'Paciente e tipo de trabalho são obrigatórios' },
                { status: 400 }
            );
        }

        const order = await database.prostheticRequests.create({
            clinicId: session.clinicId,
            patientId,
            dentistId: session.userId,
            laboratoryId: laboratoryId || proteticoId || null,
            workType,
            workTypeCustom,
            material,
            shade,
            toothNumbers,
            dentistNotes: observations,
            urgency,
            deadline: deadline ? new Date(deadline).toISOString().split('T')[0] : null,
            status: 'pending',
        });

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error('Error creating prosthetic order:', error);
        return NextResponse.json(
            { error: 'Erro ao criar pedido' },
            { status: 500 }
        );
    }
}

