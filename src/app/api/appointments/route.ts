import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/client';
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

// GET - Listar agendamentos
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');
        const startStr = searchParams.get('start');
        const endStr = searchParams.get('end');
        const status = searchParams.get('status');

        let query = supabase
            .from('appointments')
            .select(`
                *,
                patient:patients!left(name),
                dentist:users!left(name)
            `)
            .eq('organization_id', clinicId);

        if (dateStr) {
            const start = `${dateStr}T00:00:00`;
            const end = `${dateStr}T23:59:59`;
            query = query.gte('scheduled_at', start).lte('scheduled_at', end);
        } else if (startStr && endStr) {
            query = query.gte('scheduled_at', startStr).lte('scheduled_at', endStr);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data: agendamentos, error } = await query;

        if (error) {
            console.error('Erro Supabase appointments:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Mapear para o formato esperado pelo frontend (camelCase)
        const agendamentosCompletos = agendamentos.map((ag: any) => ({
            id: ag.id,
            organizationId: ag.organization_id,
            patientId: ag.patient_id,
            dentistId: ag.dentist_id,
            scheduledAt: ag.scheduled_at,
            duration: ag.duration,
            reason: ag.reason,
            status: ag.status,
            adminNotes: ag.admin_notes,
            paymentMethod: ag.payment_method,
            createdAt: ag.created_at,
            updatedAt: ag.updated_at,
            patientName: ag.patient?.name || 'Paciente não encontrado',
            dentistName: ag.dentist?.name || 'Dentista não encontrado',
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
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

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

        const { data: agendamento, error } = await supabaseAdmin
            .from('appointments')
            .insert({
                organization_id: clinicId,
                patient_id: patientId,
                dentist_id: dentistId,
                scheduled_at: scheduledAt,
                duration: duration || 30,
                reason,
                status: 'SCHEDULED',
                admin_notes: adminNotes,
                payment_method: paymentMethod
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            agendamento
        }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
