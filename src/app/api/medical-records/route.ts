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

// GET - Listar prontuários de um paciente
export async function GET(request: NextRequest) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');
        const consultationId = searchParams.get('consultationId');

        if (consultationId) {
            const prontuario = await database.medicalRecords.findByConsultation(consultationId);
            return NextResponse.json({ prontuario });
        }

        if (!patientId) {
            return NextResponse.json({ error: 'ID do paciente é obrigatório' }, { status: 400 });
        }

        const prontuarios = await database.medicalRecords.findByPatient(patientId);

        return NextResponse.json({ prontuarios });
    } catch (error) {
        console.error('Erro ao buscar prontuários:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// POST - Criar prontuário (geralmente feito via API de consultations)
export async function POST(request: NextRequest) {
    try {
        const clinicId = getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { consultationId, patientId, procedures, observations } = body;

        if (!consultationId || !patientId || !procedures) {
            return NextResponse.json(
                { error: 'Dados incompletos para criar prontuário' },
                { status: 400 }
            );
        }

        const prontuario = await database.medicalRecords.create({
            consultationId,
            clinicId,
            patientId,
            procedures,
            observations,
        });

        return NextResponse.json({ success: true, prontuario }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar prontuário:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
