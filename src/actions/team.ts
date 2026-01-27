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

        if (!currentMember || currentMember.role !== 'ADMIN') {
            return { error: 'Apenas administradores podem enviar convites.' };
        }

        const organizationId = currentMember.organization_id;

        // 2. Check if user already exists in Auth
        // We use the admin client to search by email since RLS might block listing all users
        // Note: 'listUsers' is not efficient for searching, but 'inviteUserByEmail' handles check implicitly
        // However, we want to know if we should "Link" or "Create".

        // Simplest approach: Try to "invite". 
        // If user exists, Supabase effectively sends a magic link or returns the user.
        // If user is new, it creates them.
        // BUT, we want to control the 'organization_connection'. 

        // Let's create/fetch the user first using admin methods.

        // Scenario A: User might already exist in the system (e.g. registered for another clinic or just unlinked)
        // We can try to get user by email via admin API, but unfortunately Supabase Admin API 
        // doesn't have a direct "getUserByEmail" that returns ID easily without listing.
        // Actually `admin.auth.admin.listUsers` with filter can work but is rate limited.

        // Better Strategy: Use inviteUserByEmail. 
        // If user exists, it sends an email (which is fine). 
        // We just need their ID to link them.

        const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail({
            email: email,
            // We can pass metadata, but better to set it on organization_members
            data: { inserted_by: user.id }
        });

        if (inviteError) {
            console.error('Erro ao convidar usuário (Auth):', inviteError);
            return { error: 'Erro ao processar convite no sistema de autenticação.' };
        }

        const invitedUser = inviteData.user;

        if (!invitedUser) {
            return { error: 'Falha fatal ao criar/recuperar usuário.' };
        }

        // 3. Link to Organization (or Update role if already there)
        // We use 'upsert' to handle re-invites easily.
        const { error: dbError } = await supabase // Use authenticated client (RLS must allow INSERT/UPDATE if Admin)
            .from('organization_members')
            .upsert({
                organization_id: organizationId,
                user_id: invitedUser.id,
                role: role,
                // status: 'invited' // If we had a status column. Assuming direct active for MVP or using auth confirmation status.
            }, { onConflict: 'organization_id, user_id' });

        if (dbError) {
            console.error('Erro ao vincular membro no banco:', dbError);
            return { error: 'Usuário convidado, mas houve erro ao vinculá-lo à clínica.' };
        }

        revalidatePath('/settings/team');
        return { success: true, message: 'Convite enviado com sucesso!' };

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

        if (!currentMember || currentMember.role !== 'ADMIN') {
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

        if (!currentMember || currentMember.role !== 'ADMIN') {
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
