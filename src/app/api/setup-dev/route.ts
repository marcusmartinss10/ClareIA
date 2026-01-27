import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createAdminClient();
        const email = 'admin@clareia.com';
        const password = 'admin123'; // Simple password for dev

        // 1. Create User
        const { data: userResult, error: userError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name: 'Admin Dev' }
        });

        let user = userResult.user;

        if (userError) {
            // If user already exists, try to get it (by sign in or generic invite, but lets just assume we want to reset or use existing)
            console.log('User might already exist, trying to fetch...', userError.message);
            // We can't easily "get" the user by email with admin api without listUsers permission or specific getter
            // Let's list users and find
            const { data: users } = await supabase.auth.admin.listUsers();
            user = users.users.find(u => u.email === email) || null;

            if (!user) {
                return NextResponse.json({ error: 'Failed to create user and could not find existing.' + userError.message }, { status: 500 });
            }
        }

        if (!user) return NextResponse.json({ error: 'No user user' }, { status: 500 });

        // 2. Create Organization
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({
                name: 'Clínica Dev',
                slug: 'clinica-dev', // Assuming slug exists or we generate it
                stripe_customer_id: null // optional
            })
            .select()
            .single();

        // If org exists/slug conflict, ignoring for now or fetching
        let organizationId = org?.id;
        if (orgError) {
            // Assume failure is duplicate, let's just pick the first one this user is in or create a random one
            // For simplicity in this script, let's fetch any org or make a unique one
            const { data: existingOrg } = await supabase.from('organizations').select('id').eq('slug', 'clinica-dev').single();
            if (existingOrg) organizationId = existingOrg.id;
            else {
                // Create with random slug
                const { data: newOrg } = await supabase.from('organizations').insert({ name: 'Clínica Dev 2', slug: `dev-${Date.now()}` }).select().single();
                organizationId = newOrg?.id;
            }
        }

        if (!organizationId) return NextResponse.json({ error: 'Failed to get organization' }, { status: 500 });

        // 3. Link Member as ADMIN
        const { error: linkError } = await supabase
            .from('organization_members')
            .upsert({
                organization_id: organizationId,
                user_id: user.id,
                role: 'ADMIN'
            }, { onConflict: 'organization_id, user_id' });

        if (linkError) return NextResponse.json({ error: 'Failed to link member: ' + linkError.message }, { status: 500 });

        return NextResponse.json({
            success: true,
            message: 'Developer account created/verified',
            credentials: {
                email,
                password
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
