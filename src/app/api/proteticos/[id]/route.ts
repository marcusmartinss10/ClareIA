/**
 * API: Protético by ID
 * GET /api/proteticos/[id] - Get protético details
 * PUT /api/proteticos/[id] - Update protético
 * DELETE /api/proteticos/[id] - Deactivate protético
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
        const protetico = await database.proteticos.findById(id);

        if (!protetico) {
            return NextResponse.json({ error: 'Protético não encontrado' }, { status: 404 });
        }

        if (protetico.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        // Remove password hash
        const { passwordHash, ...safeProtetico } = protetico;

        return NextResponse.json({ protetico: safeProtetico });
    } catch (error) {
        console.error('Error fetching protetico:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar protético' },
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

        if (session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const { id } = await params;
        const protetico = await database.proteticos.findById(id);

        if (!protetico) {
            return NextResponse.json({ error: 'Protético não encontrado' }, { status: 404 });
        }

        if (protetico.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const body = await request.json();
        const { name, laboratoryName, email, phone, specialties } = body;

        const updated = await database.proteticos.update(id, {
            name,
            laboratoryName,
            email,
            phone,
            specialties,
        });

        // Remove password hash
        const { passwordHash, ...safeProtetico } = updated;

        return NextResponse.json({ protetico: safeProtetico });
    } catch (error) {
        console.error('Error updating protetico:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar protético' },
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

        if (session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const { id } = await params;
        const protetico = await database.proteticos.findById(id);

        if (!protetico) {
            return NextResponse.json({ error: 'Protético não encontrado' }, { status: 404 });
        }

        if (protetico.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        await database.proteticos.deactivate(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deactivating protetico:', error);
        return NextResponse.json(
            { error: 'Erro ao desativar protético' },
            { status: 500 }
        );
    }
}
