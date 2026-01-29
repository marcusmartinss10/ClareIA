import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { database } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Listar atendimentos
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const dentistId = searchParams.get('dentistId');

        let atendimentos;
        if (dentistId) {
            atendimentos = await database.consultations.findByDentist(dentistId);
        } else {
            atendimentos = await database.consultations.findByClinic(session.clinicId);
        }

        // Filtrar por status se especificado
        if (status) {
            atendimentos = atendimentos.filter(a => a.status === status);
        }

        return NextResponse.json({ atendimentos });
    } catch (error) {
        console.error('Erro ao buscar atendimentos:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// POST - Iniciar novo atendimento
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Verificar se é dentista ou admin
        if (session.role !== 'DENTIST' && session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Apenas dentistas podem iniciar atendimentos' }, { status: 403 });
        }

        const body = await request.json();
        const { appointmentId } = body;

        if (!appointmentId) {
            return NextResponse.json({ error: 'Agendamento é obrigatório' }, { status: 400 });
        }

        // Buscar agendamento
        const agendamento = await database.appointments.findById(appointmentId);
        if (!agendamento) {
            return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
        }

        // Verificar se já existe atendimento para este agendamento
        const atendimentoExistente = await database.consultations.findByAppointment(appointmentId);
        if (atendimentoExistente) {
            return NextResponse.json({ error: 'Já existe um atendimento para este agendamento' }, { status: 400 });
        }

        // Criar atendimento
        const atendimento = await database.consultations.create({
            appointmentId,
            clinicId: session.clinicId,
            patientId: agendamento.patientId,
            dentistId: session.userId,
            startedAt: new Date(),
            totalTime: 0,
            pauseTime: 0,
            status: 'IN_PROGRESS',
        });

        // Atualizar status do agendamento
        await database.appointments.update(appointmentId, { status: 'IN_PROGRESS' });

        return NextResponse.json({ success: true, atendimento }, { status: 201 });
    } catch (error) {
        console.error('Erro ao iniciar atendimento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// PATCH - Pausar, retomar ou encerrar atendimento
export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { id, action, prontuario, paymentAmount } = body;

        if (!id || !action) {
            return NextResponse.json({ error: 'ID e ação são obrigatórios' }, { status: 400 });
        }

        const atendimento = await database.consultations.findById(id);
        if (!atendimento) {
            return NextResponse.json({ error: 'Atendimento não encontrado' }, { status: 404 });
        }

        let updateData: any = {};

        switch (action) {
            case 'pause':
                updateData = {
                    status: 'PAUSED',
                    pausedAt: new Date(),
                };
                break;

            case 'resume':
                // Calcular tempo pausado
                if (atendimento.pausedAt) {
                    const tempoPausado = Math.floor((Date.now() - new Date(atendimento.pausedAt).getTime()) / 1000);
                    updateData = {
                        status: 'IN_PROGRESS',
                        pausedAt: null,
                        pauseTime: (atendimento.pauseTime || 0) + tempoPausado,
                    };
                } else {
                    updateData = { status: 'IN_PROGRESS' };
                }
                break;

            case 'end':
                // Calcular tempo total
                const tempoTotal = Math.floor((Date.now() - new Date(atendimento.startedAt).getTime()) / 1000);

                updateData = {
                    status: 'COMPLETED',
                    endedAt: new Date(),
                    totalTime: tempoTotal - (atendimento.pauseTime || 0),
                    paymentAmount: paymentAmount || null,
                };

                // Atualizar status do agendamento
                await database.appointments.update(atendimento.appointmentId, { status: 'COMPLETED' });

                // Criar prontuário se fornecido
                if (prontuario && prontuario.procedimentos?.length > 0) {
                    await database.medicalRecords.create({
                        consultationId: id,
                        clinicId: session.clinicId,
                        patientId: atendimento.patientId,
                        procedures: prontuario.procedimentos,
                        observations: prontuario.observacoes,
                    });
                }
                break;

            default:
                return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
        }

        const atendimentoAtualizado = await database.consultations.update(id, updateData);

        return NextResponse.json({ success: true, atendimento: atendimentoAtualizado });
    } catch (error) {
        console.error('Erro ao atualizar atendimento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
