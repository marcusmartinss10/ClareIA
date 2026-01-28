import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getClinicId(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

    return member?.organization_id || null;
}

// GET - Listar pacientes da clínica
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const busca = searchParams.get('q');

        let query = supabase
            .from('patients')
            .select('*')
            .eq('organization_id', clinicId)
            .order('name');

        if (busca) {
            query = query.ilike('name', `%${busca}%`);
        }

        const { data: pacientes, error } = await query;

        if (error) {
            console.error('Erro Supabase patients:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
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
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

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

        const { data: paciente, error } = await supabase
            .from('patients')
            .insert({
                organization_id: clinicId,
                name,
                cpf,
                email,
                phone,
                birth_date: birthDate ? new Date(birthDate) : new Date(),
                address,
                notes,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, paciente }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
