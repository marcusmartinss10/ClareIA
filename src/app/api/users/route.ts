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

// GET - Listar usuários (dentistas, recepcionistas, etc)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const clinicId = await getClinicId(supabase);

        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        // Query the legacy users table
        let query = supabase
            .from('users')
            .select('id, name, email, role, avatar, created_at')
            .eq('clinic_id', clinicId);

        // Filter by role if specified
        if (role) {
            if (role === 'DENTIST') {
                // Include both DENTIST and ADMIN (admins can also be dentists)
                query = query.in('role', ['DENTIST', 'ADMIN']);
            } else {
                query = query.eq('role', role);
            }
        }

        const { data: usuarios, error } = await query.order('name');

        if (error) {
            console.error('Erro Supabase users:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ usuarios: usuarios || [] });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
