/**
 * API: Prosthetic Order Status
 * PUT /api/prosthetic-orders/[id]/status - Update order status
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/client';

const VALID_STATUSES = [
    'pending',
    'received',
    'analysis',
    'production',
    'assembly',
    'adjustment',
    'ready',
    'delivered',
];

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
        const { status, notes } = body;

        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updatedOrder = await database.prostheticOrders.updateStatus(
            id,
            status,
            'dentist', // For now, assuming dentist. In future, detect protetico
            session.userId,
            notes
        );

        // Create notification for dentist when prosthetic is ready
        if (status === 'ready' && order.dentistId) {
            const patientName = order.patient?.name || 'Paciente';

            await supabaseAdmin.from('notifications').insert({
                user_id: order.dentistId,
                clinic_id: session.clinicId,
                type: 'PROSTHETIC_READY',
                title: '🦷 Prótese Pronta!',
                message: `A prótese do paciente ${patientName} está pronta para retirada.`,
                data: JSON.stringify({
                    orderId: id,
                    patientId: order.patientId,
                    patientName: patientName,
                }),
                read: false,
            });
        }

        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error('Error updating prosthetic order status:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar status' },
            { status: 500 }
        );
    }
}

