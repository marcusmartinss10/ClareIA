import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const clinicId = session.clinicId;
        const { searchParams } = new URL(request.url);
        const periodo = searchParams.get('periodo') || 'mes';

        // Calculate date ranges
        const now = new Date();
        let startDate: Date;

        if (periodo === 'dia') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (periodo === 'semana') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Fetch consultations for the period
        const { data: consultations, error: consultError } = await supabaseAdmin
            .from('consultations')
            .select('*')
            .eq('clinic_id', clinicId)
            .gte('started_at', startDate.toISOString())
            .lte('started_at', now.toISOString());

        if (consultError) {
            console.error('Error fetching consultations:', consultError);
        }

        // Fetch appointments with payment methods
        const { data: appointments, error: appError } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .eq('clinic_id', clinicId)
            .gte('scheduled_at', startDate.toISOString())
            .lte('scheduled_at', now.toISOString());

        if (appError) {
            console.error('Error fetching appointments:', appError);
        }

        // Fetch dentists
        const { data: dentists } = await supabaseAdmin
            .from('users')
            .select('id, name')
            .eq('clinic_id', clinicId)
            .eq('role', 'DENTIST');

        // Calculate metrics
        const consultationList = consultations || [];
        const appointmentList = appointments || [];

        // Payment methods summary
        const paymentSummary = {
            CASH: { count: 0, total: 0 },
            CARD: { count: 0, total: 0 },
            PIX: { count: 0, total: 0 },
            DENTAL_PLAN: { count: 0, total: 0 },
        };

        appointmentList.forEach((apt: any) => {
            const method = apt.payment_method as keyof typeof paymentSummary;
            if (method && paymentSummary[method]) {
                paymentSummary[method].count++;
            }
        });

        // Calculate total revenue from consultations with payment_amount
        consultationList.forEach((cons: any) => {
            if (cons.payment_amount) {
                // Find the related appointment to get payment method
                const apt = appointmentList.find((a: any) => a.id === cons.appointment_id);
                if (apt?.payment_method) {
                    const method = apt.payment_method as keyof typeof paymentSummary;
                    if (paymentSummary[method]) {
                        paymentSummary[method].total += cons.payment_amount;
                    }
                }
            }
        });

        // Dentist productivity (time worked)
        const dentistStats: Record<string, {
            id: string;
            nome: string;
            atendimentos: number;
            tempoTotal: number;
            tempoMedio: number;
        }> = {};

        (dentists || []).forEach((d: any) => {
            dentistStats[d.id] = {
                id: d.id,
                nome: d.name,
                atendimentos: 0,
                tempoTotal: 0,
                tempoMedio: 0,
            };
        });

        consultationList.forEach((cons: any) => {
            if (cons.dentist_id && dentistStats[cons.dentist_id]) {
                dentistStats[cons.dentist_id].atendimentos++;
                // total_time is in seconds, convert to minutes
                const timeMinutes = Math.floor((cons.total_time || 0) / 60);
                dentistStats[cons.dentist_id].tempoTotal += timeMinutes;
            }
        });

        // Calculate average time
        Object.values(dentistStats).forEach(stat => {
            if (stat.atendimentos > 0) {
                stat.tempoMedio = Math.round(stat.tempoTotal / stat.atendimentos);
            }
        });

        // General metrics
        const totalConsultations = consultationList.length;
        const completedConsultations = consultationList.filter((c: any) => c.status === 'COMPLETED').length;
        const totalTimeSeconds = consultationList.reduce((sum: number, c: any) => sum + (c.total_time || 0), 0);
        const avgTimeMinutes = totalConsultations > 0 ? Math.round((totalTimeSeconds / 60) / totalConsultations) : 0;

        const totalRevenue = consultationList.reduce((sum: number, c: any) => sum + (c.payment_amount || 0), 0);

        const metricas = {
            atendimentos: totalConsultations,
            atendimentosConcluidos: completedConsultations,
            tempoMedio: avgTimeMinutes,
            tempoTotal: Math.round(totalTimeSeconds / 60),
            receita: totalRevenue,
            taxaOcupacao: totalConsultations > 0 ? Math.round((completedConsultations / totalConsultations) * 100) : 0,
        };

        return NextResponse.json({
            metricas,
            pagamentos: paymentSummary,
            produtividade: Object.values(dentistStats),
            periodo,
        });

    } catch (error) {
        console.error('Erro no relatório:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
