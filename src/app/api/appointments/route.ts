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

// GET - Listar agendamentos
export async function GET(request: NextRequest) {
    try {
        const clinicId = getClinicId();
        console.log('API Appointments - clinicId:', clinicId);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');
        const startStr = searchParams.get('start');
        const endStr = searchParams.get('end');
        const status = searchParams.get('status');

        console.log('API Appointments - Parâmetros:', { dateStr, startStr, endStr, status });

        let agendamentos;
        if (dateStr) {
            // Criar a data a partir da string YYYY-MM-DD para evitar problemas de timezone
            const [ano, mes, dia] = dateStr.split('-').map(Number);
            const date = new Date(ano, mes - 1, dia);
            console.log('API Appointments - Data parseada:', date.toISOString());
            agendamentos = await database.appointments.findByDate(clinicId, date);
        } else if (startStr && endStr) {
            agendamentos = await database.appointments.findByDateRange(
                clinicId,
                new Date(startStr),
                new Date(endStr)
            );
        } else {
            agendamentos = await database.appointments.findByClinic(clinicId);
        }

        console.log('API Appointments - Agendamentos encontrados:', agendamentos.length);

        // Filtrar por status se especificado
        if (status) {
            agendamentos = agendamentos.filter(a => a.status === status);
        }

        // Buscar nomes de pacientes e dentistas
        const pacientes = await database.patients.findByClinic(clinicId);
        const usuarios = await database.users.findByClinic(clinicId);

        const pacientesMap = new Map(pacientes.map(p => [p.id, p.name]));
        const usuariosMap = new Map(usuarios.map(u => [u.id, u.name]));

        // Adicionar nomes aos agendamentos
        const agendamentosCompletos = agendamentos.map(ag => ({
            ...ag,
            patientName: pacientesMap.get(ag.patientId) || 'Paciente não encontrado',
            dentistName: usuariosMap.get(ag.dentistId) || 'Dentista não encontrado',
        }));

        return NextResponse.json({ agendamentos: agendamentosCompletos });
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// POST - Criar agendamento
export async function POST(request: NextRequest) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { patientId, dentistId, scheduledAt, duration, reason, adminNotes, paymentMethod } = body;

        if (!patientId || !dentistId || !scheduledAt || !reason) {
            return NextResponse.json(
                { error: 'Paciente, dentista, data/hora e motivo são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar se paciente existe
        const paciente = await database.patients.findById(patientId);
        if (!paciente) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        // Verificar se dentista existe
        const dentista = await database.users.findById(dentistId);
        if (!dentista) {
            return NextResponse.json({ error: 'Dentista não encontrado' }, { status: 404 });
        }

        const agendamento = await database.appointments.create({
            clinicId,
            patientId,
            dentistId,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 30,
            reason,
            status: 'SCHEDULED',
            adminNotes,
            paymentMethod: paymentMethod || null,
        });

        return NextResponse.json({
            success: true,
            agendamento: {
                ...agendamento,
                patientName: paciente.name,
                dentistName: dentista.name,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
