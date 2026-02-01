'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const ALLOWED_ROLES = ['ADMIN', 'DENTIST', 'RECEPTIONIST'] as const;
type Role = typeof ALLOWED_ROLES[number];

/**
 * Invite a new member to the organization
 */
export async function inviteMember(email: string, role: Role) {
    try {
        const supabase = await createClient(); // Authenticated client
        const admin = createAdminClient();     // Service Role client

        // 1. Verify Authentication & Permissions
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: 'Você precisa estar logado para convidar membros.' };
        }

        // Check if current user is ADMIN of their organization
        const { data: currentMember } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id)
            .single();

        if (!currentMember || currentMember.role?.toUpperCase() !== 'ADMIN') {
            return { error: 'Apenas administradores podem enviar convites.' };
        }

        const organizationId = currentMember.organization_id;

        // 2. Check if user already exists in the organization
        const { data: existingMember } = await admin
            .from('organization_members')
            .select('user_id')
            .eq('organization_id', organizationId)
            .eq('user_id', (
                await admin.from('profiles').select('id').eq('email', email.toLowerCase()).single()
            ).data?.id || 'no-match')
            .single();

        if (existingMember) {
            return { error: 'Este usuário já faz parte da equipe.' };
        }

        // 3. Try to find existing user by email first
        let userId: string | null = null;

        // Search for existing user in profiles table
        const { data: existingProfile } = await admin
            .from('profiles')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existingProfile) {
            // User exists, just link them
            userId = existingProfile.id;
        } else {
            // 4. User doesn't exist, try to invite them
            const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
                data: { invited_by: user.id },
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clare-ia-psi.vercel.app'}/login`
            });

            if (inviteError) {
                // Check if error is "user already registered"
                if (inviteError.message?.includes('already registered') ||
                    inviteError.message?.includes('already been registered') ||
                    inviteError.status === 422) {
                    // Try to get user from auth.users via admin
                    const { data: usersData } = await admin.auth.admin.listUsers();
                    const existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

                    if (existingUser) {
                        userId = existingUser.id;
                    } else {
                        console.error('Erro ao convidar usuário:', inviteError);
                        return { error: 'Este email já está registrado no sistema, mas não foi possível vinculá-lo.' };
                    }
                } else {
                    console.error('Erro ao convidar usuário (Auth):', inviteError);
                    return { error: `Erro ao enviar convite: ${inviteError.message || 'Verifique se o email é válido.'}` };
                }
            } else if (inviteData?.user) {
                userId = inviteData.user.id;
            }
        }

        if (!userId) {
            return { error: 'Não foi possível processar o convite. Tente novamente.' };
        }

        // 5. Link user to Organization
        const { error: dbError } = await admin
            .from('organization_members')
            .upsert({
                organization_id: organizationId,
                user_id: userId,
                role: role,
            }, { onConflict: 'organization_id, user_id' });

        if (dbError) {
            console.error('Erro ao vincular membro no banco:', dbError);
            return { error: 'Usuário identificado, mas houve erro ao vinculá-lo à clínica.' };
        }

        revalidatePath('/settings/team');
        return { success: true, message: 'Membro adicionado com sucesso!' };

    } catch (error) {
        console.error('Erro interno ao convidar:', error);
        return { error: 'Erro interno ao processar sua solicitação.' };
    }
}


/**
 * Remove a member from the organization
 */
export async function removeMember(userIdToRemove: string) {
    try {
        const supabase = await createClient();

        // 1. Verify Authentication & Permissions
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'Não autenticado.' };

        const { data: currentMember } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id)
            .single();

        if (!currentMember || currentMember.role?.toUpperCase() !== 'ADMIN') {
            return { error: 'Permissã negada.' };
        }

        // prevent suicide
        if (userIdToRemove === user.id) {
            return { error: 'Você não pode remover a si mesmo.' };
        }

        // 2. Remove from database
        const { error } = await supabase
            .from('organization_members')
            .delete()
            .eq('organization_id', currentMember.organization_id)
            .eq('user_id', userIdToRemove);

        if (error) {
            console.error('Erro ao remover membro:', error);
            return { error: 'Erro ao remover membro da equipe.' };
        }

        revalidatePath('/settings/team');
        return { success: true, message: 'Membro removido com sucesso.' };

    } catch (error) {
        console.error('Erro interno ao remover:', error);
        return { error: 'Erro interno.' };
    }
}

/**
 * Update member role
 */
export async function updateMemberRole(userIdToUpdate: string, newRole: Role) {
    // ... similar permission check ...
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'Não autenticado.' };

        const { data: currentMember } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id)
            .single();

        if (!currentMember || currentMember.role?.toUpperCase() !== 'ADMIN') {
            return { error: 'Permissã negada.' };
        }

        // prevent suicide logic (if downgrading self)
        if (userIdToUpdate === user.id && newRole !== 'ADMIN') {
            // Check if there are other admins? For MVP, just block.
            return { error: 'Você não pode rebaixar seu próprio cargo.' };
        }

        const { error } = await supabase
            .from('organization_members')
            .update({ role: newRole })
            .eq('organization_id', currentMember.organization_id)
            .eq('user_id', userIdToUpdate);

        if (error) {
            return { error: 'Erro ao atualizar cargo.' };
        }

        revalidatePath('/settings/team');
        return { success: true };

    } catch (error) {
        return { error: 'Erro interno.' };
    }
}
