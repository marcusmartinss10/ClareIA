/**
 * API: Prosthetic Order by ID
 * GET /api/prosthetic-orders/[id] - Get order details
 * PUT /api/prosthetic-orders/[id] - Update order
 * DELETE /api/prosthetic-orders/[id] - Cancel order
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';

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

        // Get attachments and history
        const [attachments, history, comments] = await Promise.all([
            database.prostheticOrderAttachments.findByOrder(id),
            database.prostheticOrderHistory.findByOrder(id),
            database.prostheticOrderComments.findByOrder(id),
        ]);

        return NextResponse.json({
            order,
            attachments,
            history,
            comments,
        });
    } catch (error) {
        console.error('Error fetching prosthetic order:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar pedido' },
            { status: 500 }
        );
    }
}

export async function PUT(
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
        const updatedOrder = await database.prostheticOrders.update(id, body);

        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error('Error updating prosthetic order:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar pedido' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        // Only allow deletion of pending orders
        if (order.status !== 'pending') {
            return NextResponse.json(
                { error: 'Apenas pedidos pendentes podem ser cancelados' },
                { status: 400 }
            );
        }

        await database.prostheticOrders.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting prosthetic order:', error);
        return NextResponse.json(
            { error: 'Erro ao cancelar pedido' },
            { status: 500 }
        );
    }
}
