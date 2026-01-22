/**
 * API: Prosthetic Order Attachments
 * GET /api/prosthetic-orders/[id]/attachments - Get order attachments
 * POST /api/prosthetic-orders/[id]/attachments - Upload attachment
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

        const attachments = await database.prostheticOrderAttachments.findByOrder(id);

        return NextResponse.json({ attachments });
    } catch (error) {
        console.error('Error fetching attachments:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar anexos' },
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
        const { fileName, fileType, fileUrl, fileSize, uploadedByType } = body;

        if (!fileName || !fileUrl) {
            return NextResponse.json(
                { error: 'Nome e URL do arquivo são obrigatórios' },
                { status: 400 }
            );
        }

        const attachment = await database.prostheticOrderAttachments.create({
            orderId: id,
            fileName,
            fileType: fileType || 'document',
            fileUrl,
            fileSize: fileSize || 0,
            uploadedBy: session.id,
            uploadedByType: uploadedByType || 'dentist',
        });

        return NextResponse.json({ attachment }, { status: 201 });
    } catch (error) {
        console.error('Error creating attachment:', error);
        return NextResponse.json(
            { error: 'Erro ao adicionar anexo' },
            { status: 500 }
        );
    }
}
