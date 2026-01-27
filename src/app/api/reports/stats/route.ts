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

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const monthStr = searchParams.get('month'); // YYYY-MM

        let startDate, endDate;

        if (monthStr) {
            const [year, month] = monthStr.split('-').map(Number);
            startDate = new Date(year, month - 1, 1).toISOString();
            // End of month
            endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
        } else {
            // Default to current month
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        }

        // 1. Fetch Appointments in Range
        const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select('id, status, scheduled_at, reason')
            .eq('clinic_id', clinicId)
            .gte('scheduled_at', startDate)
            .lte('scheduled_at', endDate);

        if (appError) throw appError;

        // 2. Fetch New Patients in Range
        // Assuming patients also have created_at and belong to clinic
        const { count: newPatientsCount, error: patError } = await supabase
            .from('patients')
            .select('id', { count: 'exact', head: true })
            .eq('clinic_id', clinicId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (patError) throw patError;

        // 3. Process Metrics
        const totalAppointments = appointments.length;
        const completed = appointments.filter((a: any) => a.status === 'COMPLETED').length;
        const canceled = appointments.filter((a: any) => a.status === 'CANCELED').length;

        const completionRate = totalAppointments > 0
            ? Math.round((completed / totalAppointments) * 100)
            : 0;

        // Group by Day for Chart
        const appointmentsByDay: Record<string, number> = {};
        appointments.forEach((a: any) => {
            const day = new Date(a.scheduled_at).getDate();
            appointmentsByDay[day] = (appointmentsByDay[day] || 0) + 1;
        });

        const chartData = Object.keys(appointmentsByDay).map(day => ({
            day: parseInt(day),
            count: appointmentsByDay[day]
        })).sort((a, b) => a.day - b.day);

        return NextResponse.json({
            summary: {
                totalAppointments,
                completed,
                canceled,
                completionRate,
                newPatients: newPatientsCount || 0
            },
            chartData
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Erro interno ao gerar relatório' }, { status: 500 });
    }
}
