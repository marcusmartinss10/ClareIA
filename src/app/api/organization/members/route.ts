import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Get Current User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get Organization ID
        const { data: currentMember } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', user.id)
            .single();

        if (!currentMember) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // 3. List Members with Profile Data
        // We join organization_members with profiles (assuming profiles table has user info)
        // Note: If profiles table doesn't exist or doesn't have data for invited users, we might need a different strategy.
        // For invited users who haven't accepted, they might not have a profile.
        // BUT, our invite logic creates the user in Auth.
        // Ideally, we should also create a profile for them or fetch from auth.users (which we can't do easily here without admin).

        // Let's assume for now we just fetch what we can. 
        // If we can't join easily, we might just return the member data and handle "Unknown" in frontend, 
        // or use a view.

        // Let's try to join with `profiles`.
        const { data: members, error } = await supabase
            .from('organization_members')
            .select(`
        id,
        user_id,
        role,
        created_at,
        profile:profiles(full_name, email, avatar_url) 
      `)
            .eq('organization_id', currentMember.organization_id);

        // Note: If the user is just invited, they might not have a profile row if our trigger doesn't handle invites.
        // If `inviteUserByEmail` creates the user, the `on_auth_user_created` trigger SHOULD run and create the profile.
        // So this join should work.

        if (error) {
            console.error('Error fetching members:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Flatten the response
        const formattedMembers = members.map((m: any) => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            status: 'active', // We don't have status column yet, assume active
            full_name: m.profile?.full_name || 'Usuário Convidado',
            email: m.profile?.email || 'Email oculto', // Profile might not have email depending on schema, but let's hope.
            avatar_url: m.profile?.avatar_url
        }));

        return NextResponse.json({ members: formattedMembers });

    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
