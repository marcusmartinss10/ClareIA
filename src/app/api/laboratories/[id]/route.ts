/**
 * API: Single Laboratory
 * GET /api/laboratories/[id] - Get laboratory details
 * PUT /api/laboratories/[id] - Update laboratory
 * DELETE /api/laboratories/[id] - Deactivate laboratory
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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
        const laboratory = await database.laboratories.findById(id);

        if (!laboratory) {
            return NextResponse.json({ error: 'Laboratório não encontrado' }, { status: 404 });
        }

        // Check clinic access
        if (laboratory.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        // Return safe data (without password)
        const safeLab = {
            id: laboratory.id,
            name: laboratory.name,
            responsibleName: laboratory.responsibleName,
            email: laboratory.email,
            phone: laboratory.phone,
            specialties: laboratory.specialties || [],
            address: laboratory.address,
            active: laboratory.active,
            createdAt: laboratory.createdAt,
            updatedAt: laboratory.updatedAt,
        };

        return NextResponse.json({ laboratory: safeLab });
    } catch (error) {
        console.error('Error fetching laboratory:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar laboratório' },
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

        // Only admins can update laboratories
        if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem editar laboratórios' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const laboratory = await database.laboratories.findById(id);

        if (!laboratory) {
            return NextResponse.json({ error: 'Laboratório não encontrado' }, { status: 404 });
        }

        if (laboratory.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const body = await request.json();
        const { name, responsibleName, email, phone, password, specialties, address, active } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (responsibleName !== undefined) updateData.responsibleName = responsibleName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (specialties !== undefined) updateData.specialties = specialties;
        if (address !== undefined) updateData.address = address;
        if (active !== undefined) updateData.active = active;

        // Hash new password if provided
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        const updated = await database.laboratories.update(id, updateData);

        return NextResponse.json({ laboratory: updated });
    } catch (error) {
        console.error('Error updating laboratory:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar laboratório' },
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

        // Only admins can deactivate laboratories
        if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem desativar laboratórios' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const laboratory = await database.laboratories.findById(id);

        if (!laboratory) {
            return NextResponse.json({ error: 'Laboratório não encontrado' }, { status: 404 });
        }

        if (laboratory.clinicId !== session.clinicId) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        await database.laboratories.deactivate(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deactivating laboratory:', error);
        return NextResponse.json(
            { error: 'Erro ao desativar laboratório' },
            { status: 500 }
        );
    }
}
