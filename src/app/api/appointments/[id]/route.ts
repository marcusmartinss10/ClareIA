import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { database } from '@/lib/db';

function getClinicId(): string | null {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;
    try {
        const session = JSON.parse(sessionCookie.value);
        return session.clinicId;
    } catch {
        return null;
    }
}

// PATCH - Atualizar agendamento
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { status, reason, adminNotes, scheduledAt } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (reason) updateData.reason = reason;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);

        const agendamento = await database.appointments.update(params.id, updateData);

        if (!agendamento) {
            return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, agendamento });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// DELETE - Excluir agendamento
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const deleted = await database.appointments.delete(params.id);

        if (!deleted) {
            return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
