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

// GET - Buscar detalhes completos de um paciente
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const paciente = await database.patients.findById(params.id);
        if (!paciente) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        // Verificar se paciente pertence à clínica
        if (paciente.clinicId !== clinicId) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Buscar histórico de agendamentos
        const todosAgendamentos = await database.appointments.findByClinic(clinicId);
        const agendamentos = todosAgendamentos.filter(a => a.patientId === params.id);

        // Buscar nomes dos dentistas
        const usuarios = await database.users.findByClinic(clinicId);
        const usuariosMap = new Map(usuarios.map(u => [u.id, u.name]));

        // Adicionar nome do dentista aos agendamentos
        const agendamentosCompletos = agendamentos.map(ag => ({
            ...ag,
            dentistName: usuariosMap.get(ag.dentistId) || 'Dentista não encontrado',
        }));

        // Buscar prontuários
        const prontuarios = await database.medicalRecords.findByPatient(params.id);

        // Buscar atendimentos
        const todosAtendimentos = await database.consultations.findByClinic(clinicId);
        const atendimentos = todosAtendimentos.filter(c => c.patientId === params.id);

        // Calcular estatísticas
        const stats = {
            totalAtendimentos: atendimentos.filter(a => a.status === 'COMPLETED').length,
            totalTempoAtendimento: atendimentos
                .filter(a => a.status === 'COMPLETED')
                .reduce((sum, a) => sum + (a.totalTime || 0), 0),
            ultimoAtendimento: atendimentos
                .filter(a => a.status === 'COMPLETED')
                .sort((a, b) => new Date(b.endedAt || 0).getTime() - new Date(a.endedAt || 0).getTime())[0],
            proximoAgendamento: agendamentos
                .filter(a => a.status === 'SCHEDULED' && new Date(a.scheduledAt) > new Date())
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0],
        };

        return NextResponse.json({
            paciente,
            agendamentos: agendamentosCompletos,
            atendimentos,
            prontuarios,
            stats,
        });
    } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// PATCH - Atualizar paciente
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
        const { name, cpf, phone, email, birthDate, notes } = body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (cpf) updateData.cpf = cpf;
        if (phone) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (birthDate) updateData.birthDate = new Date(birthDate);
        if (notes !== undefined) updateData.notes = notes;

        const paciente = await database.patients.update(params.id, updateData);

        if (!paciente) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, paciente });
    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// DELETE - Excluir paciente
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const deleted = await database.patients.delete(params.id);

        if (!deleted) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
