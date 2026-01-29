import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

export async function GET() {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Get last 12 months
        const now = new Date();
        const months: { month: string; label: string; startDate: Date; endDate: Date }[] = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            months.push({
                month: date.toISOString().slice(0, 7), // YYYY-MM
                label: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
                startDate: date,
                endDate: endDate
            });
        }

        // Fetch all consultations with payment amounts for the last 12 months
        const startOfPeriod = months[0].startDate.toISOString();
        const endOfPeriod = now.toISOString();

        const { data: consultations, error: consultError } = await supabase
            .from('consultations')
            .select('id, payment_amount, started_at, status')
            .eq('organization_id', clinicId)
            .gte('started_at', startOfPeriod)
            .lte('started_at', endOfPeriod);

        if (consultError) {
            console.error('Error fetching consultations:', consultError);
        }

        // Also get appointments for payment data
        const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select('id, scheduled_at, status, payment_method')
            .eq('organization_id', clinicId)
            .gte('scheduled_at', startOfPeriod)
            .lte('scheduled_at', endOfPeriod);

        if (appError) {
            console.error('Error fetching appointments:', appError);
        }

        // Calculate monthly revenue
        const monthlyData = months.map(m => {
            const monthConsultations = (consultations || []).filter((c: any) => {
                const date = new Date(c.started_at);
                return date >= m.startDate && date <= m.endDate;
            });

            const revenue = monthConsultations.reduce((sum: number, c: any) => sum + (c.payment_amount || 0), 0);
            const count = monthConsultations.length;

            return {
                month: m.label,
                fullMonth: m.month,
                revenue,
                count
            };
        });

        // Calculate KPIs
        const currentMonthRevenue = monthlyData[11]?.revenue || 0;
        const lastMonthRevenue = monthlyData[10]?.revenue || 0;
        const revenueGrowth = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
            : '0';

        const totalYearRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
        const avgMonthlyRevenue = totalYearRevenue / 12;

        // Calculate net profit (simplified: 30% margin assumption for demo)
        const netProfitMargin = 0.30;
        const netProfit = currentMonthRevenue * netProfitMargin;

        // Ticket médio
        const currentMonthAppointments = (appointments || []).filter((a: any) => {
            const date = new Date(a.scheduled_at);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });

        const completedThisMonth = currentMonthAppointments.filter((a: any) => a.status === 'COMPLETED').length;
        const ticketMedio = completedThisMonth > 0 ? currentMonthRevenue / completedThisMonth : 0;

        // Calculate delinquency (simplified: pending/cancelled from this month)
        const canceledThisMonth = currentMonthAppointments.filter((a: any) => a.status === 'CANCELED').length;
        const delinquencyRate = currentMonthAppointments.length > 0
            ? ((canceledThisMonth / currentMonthAppointments.length) * 100).toFixed(1)
            : '0';

        // Recent transactions (last 10 completed consultations with patient info)
        const { data: recentTransactions } = await supabase
            .from('consultations')
            .select(`
                id,
                payment_amount,
                started_at,
                status,
                patient:patients(name),
                appointment:appointments(reason, payment_method)
            `)
            .eq('organization_id', clinicId)
            .order('started_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            kpis: {
                faturamentoMensal: currentMonthRevenue,
                crescimento: parseFloat(revenueGrowth as string),
                lucroLiquido: netProfit,
                taxaInadimplencia: parseFloat(delinquencyRate),
                ticketMedio: ticketMedio
            },
            chartData: monthlyData,
            transactions: (recentTransactions || []).map((t: any) => ({
                id: t.id,
                date: t.started_at,
                patient: t.patient?.name || 'Paciente',
                procedure: t.appointment?.reason || 'Consulta',
                amount: t.payment_amount || 0,
                status: t.status,
                paymentMethod: t.appointment?.payment_method || 'CASH'
            }))
        });

    } catch (error) {
        console.error('Error fetching financial data:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
