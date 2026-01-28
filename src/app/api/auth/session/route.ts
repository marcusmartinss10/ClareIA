import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        // Buscar dados do membro (role e organização)
        const { data: memberData, error: memberError } = await supabase
            .from('organization_members')
            .select(`
                role,
                organization:organizations (
                    id,
                    name
                )
            `)
            .eq('user_id', user.id)
            .single();

        let role = 'DENTIST';
        let clinicName = '';
        let clinicId = '';

        if (memberData) {
            role = memberData.role.toUpperCase();
            if (memberData.organization) {
                // @ts-ignore
                clinicName = memberData.organization.name;
                // @ts-ignore
                clinicId = memberData.organization.id;
            }
        }

        const name = user.user_metadata?.full_name || user.email;

        return NextResponse.json({
            user: {
                id: user.id,
                name: name,
                email: user.email,
                role: role,
                clinicId: clinicId,
                clinicName: clinicName,
            },
            subscriptionStatus: 'ACTIVE' // Placeholder temporário
        });
    } catch (error) {
        console.error('Erro ao obter sessão:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
