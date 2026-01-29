/**
 * API: Prosthetic Order Comments
 * GET /api/prosthetic-orders/[id]/comments - Get order comments
 * POST /api/prosthetic-orders/[id]/comments - Add comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const order = await database.prostheticOrders.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
        }

        if (order.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const comments = await database.prostheticOrderComments.findByOrder(id);

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar comentários' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const order = await database.prostheticOrders.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
        }

        if (order.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const body = await request.json();
        const { message } = body;

        if (!message || message.trim() === '') {
            return NextResponse.json(
                { error: 'Mensagem é obrigatória' },
                { status: 400 }
            );
        }

        const comment = await database.prostheticOrderComments.create({
            orderId: id,
            authorType: 'dentist', // For now, assuming dentist
            authorId: session.id,
            message: message.trim(),
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Erro ao adicionar comentário' },
            { status: 500 }
        );
    }
}
