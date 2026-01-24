import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Helper para obter clinicId da sessão
async function getClinicId(): Promise<string | null> {
    const session = await getSession();
    return session?.clinicId || null;
}

// GET - Listar pacientes da clínica
export async function GET(request: NextRequest) {
    try {
        const clinicId = await getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const busca = searchParams.get('q');

        let pacientes;
        if (busca) {
            pacientes = await database.patients.search(clinicId, busca);
        } else {
            pacientes = await database.patients.findByClinic(clinicId);
        }

        return NextResponse.json({ pacientes });
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// POST - Criar novo paciente
export async function POST(request: NextRequest) {
    try {
        const clinicId = await getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { name, cpf, email, phone, birthDate, address, notes } = body;

        if (!name || !cpf || !phone) {
            return NextResponse.json(
                { error: 'Nome, CPF e telefone são obrigatórios' },
                { status: 400 }
            );
        }

        const paciente = await database.patients.create({
            clinicId,
            name,
            cpf,
            email,
            phone,
            birthDate: birthDate ? new Date(birthDate) : new Date(),
            address,
            notes,
        });

        return NextResponse.json({ success: true, paciente }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
