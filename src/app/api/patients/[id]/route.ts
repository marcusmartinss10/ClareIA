import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

// GET - Buscar detalhes completos de um paciente
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Buscar paciente
        const { data: paciente, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', params.id)
            .eq('organization_id', clinicId)
            .single();

        if (error || !paciente) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        // Buscar agendamentos do paciente
        const { data: agendamentos } = await supabase
            .from('appointments')
            .select(`
                *,
                dentist:profiles(full_name)
            `)
            .eq('patient_id', params.id)
            .eq('organization_id', clinicId)
            .order('scheduled_at', { ascending: false });

        // Adicionar nome do dentista aos agendamentos
        const agendamentosCompletos = (agendamentos || []).map((ag: any) => ({
            ...ag,
            dentistName: ag.dentist?.full_name || 'Dentista não encontrado',
        }));

        // Buscar prontuários
        const { data: prontuarios } = await supabase
            .from('medical_records')
            .select('*')
            .eq('patient_id', params.id)
            .eq('organization_id', clinicId)
            .order('created_at', { ascending: false });

        // Buscar atendimentos (consultations)
        const { data: atendimentos } = await supabase
            .from('consultations')
            .select('*')
            .eq('patient_id', params.id)
            .eq('organization_id', clinicId)
            .order('started_at', { ascending: false });

        const atendimentosList = atendimentos || [];
        const agendamentosList = agendamentos || [];

        // Calcular estatísticas
        const completedConsults = atendimentosList.filter((a: any) => a.status === 'COMPLETED');
        const stats = {
            totalAtendimentos: completedConsults.length,
            totalTempoAtendimento: completedConsults.reduce((sum: number, a: any) => sum + (a.total_time || 0), 0),
            ultimoAtendimento: completedConsults[0] || null,
            proximoAgendamento: agendamentosList.find((a: any) =>
                a.status === 'SCHEDULED' && new Date(a.scheduled_at) > new Date()
            ) || null,
        };

        return NextResponse.json({
            paciente,
            agendamentos: agendamentosCompletos,
            atendimentos: atendimentosList,
            prontuarios: prontuarios || [],
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
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);
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
        if (birthDate) updateData.birth_date = new Date(birthDate);
        if (notes !== undefined) updateData.notes = notes;
        updateData.updated_at = new Date().toISOString();

        const { data: paciente, error } = await supabase
            .from('patients')
            .update(updateData)
            .eq('id', params.id)
            .eq('organization_id', clinicId)
            .select()
            .single();

        if (error || !paciente) {
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
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', params.id)
            .eq('organization_id', clinicId);

        if (error) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
